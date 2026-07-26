import type { SaarasTranscription } from "../types";
import {
	AppError,
	fetchWithTimeout,
	getErrorMessage,
	throwIfAborted,
} from "../utils";

function toBcp47Language(language?: string): string {
	switch (language) {
		case "hi":
			return "hi-IN";
		case "kn":
			return "kn-IN";
		case "en":
			return "en-IN";
		case "hi-en":
			return "unknown";
		default:
			return language?.includes("-") ? language : "unknown";
	}
}

export class SaarasClient {
	constructor(private readonly apiKey: string) {}

	async transcribe(
		audio: Blob,
		expectedLang: string | undefined,
		signal?: AbortSignal,
	): Promise<SaarasTranscription> {
		throwIfAborted(signal);

		const formData = new FormData();
		formData.append("file", audio, "turn.pcm");
		formData.append("model", "saaras:v3");
		formData.append("mode", "codemix");
		formData.append("language_code", toBcp47Language(expectedLang));
		formData.append("input_audio_codec", "pcm_s16le");

		const response = await fetchWithTimeout(
			"https://api.sarvam.ai/speech-to-text",
			{
				method: "POST",
				headers: {
					"api-subscription-key": this.apiKey,
				},
				body: formData,
				signal,
				timeoutMs: 25000,
			},
		);

		if (!response.ok) {
			throw await sarvamResponseError("Sarvam speech-to-text failed", response);
		}

		const payload = (await response.json()) as {
			transcript?: string;
			language_code?: string | null;
		};

		if (!payload.transcript) {
			throw new AppError("Sarvam speech-to-text returned no transcript", 502);
		}

		return {
			text: payload.transcript,
			detectedLanguage: payload.language_code ?? expectedLang ?? "unknown",
		};
	}

	async submitBatchJob(signal?: AbortSignal): Promise<{ job_id: string }> {
		const response = await fetchWithTimeout(
			"https://api.sarvam.ai/speech-to-text/job/v1",
			{
				method: "POST",
				headers: {
					"api-subscription-key": this.apiKey,
					"content-type": "application/json",
				},
				body: JSON.stringify({
					job_parameters: {
						model: "saaras:v3",
						mode: "codemix",
						with_diarization: true,
					},
				}),
				signal,
				timeoutMs: 10000,
			},
		);

		if (!response.ok) {
			throw await sarvamResponseError("Sarvam batch job init failed", response);
		}

		return (await response.json()) as { job_id: string };
	}

	async requestBatchUploadUrls(
		jobId: string,
		files: string[],
		signal?: AbortSignal,
	): Promise<Record<string, SignedUrlValue>> {
		const response = await fetchWithTimeout(
			"https://api.sarvam.ai/speech-to-text/job/v1/upload-files",
			{
				method: "POST",
				headers: {
					"api-subscription-key": this.apiKey,
					"content-type": "application/json",
				},
				body: JSON.stringify({
					job_id: jobId,
					files,
				}),
				signal,
				timeoutMs: 10000,
			},
		);

		if (!response.ok) {
			throw new AppError("Sarvam batch upload URL request failed", 502, {
				status: response.status,
				body: await response.text(),
			});
		}

		const payload = (await response.json()) as {
			upload_urls?: Record<string, SignedUrlValue>;
		};

		return payload.upload_urls ?? {};
	}

	async startBatchJob(jobId: string, signal?: AbortSignal): Promise<void> {
		const response = await fetchWithTimeout(
			`https://api.sarvam.ai/speech-to-text/job/v1/${jobId}/start`,
			{
				method: "POST",
				headers: {
					"api-subscription-key": this.apiKey,
					"content-type": "application/json",
				},
				body: JSON.stringify({}),
				signal,
				timeoutMs: 10000,
			},
		);

		if (!response.ok) {
			throw await sarvamResponseError("Sarvam batch start failed", response);
		}
	}

	async getBatchStatus(
		jobId: string,
		signal?: AbortSignal,
	): Promise<Record<string, unknown>> {
		const response = await fetchWithTimeout(
			`https://api.sarvam.ai/speech-to-text/job/v1/${jobId}/status`,
			{
				method: "GET",
				headers: {
					"api-subscription-key": this.apiKey,
					"content-type": "application/json",
				},
				signal,
				timeoutMs: 10000,
			},
		);

		if (!response.ok) {
			throw new AppError("Sarvam batch status failed", 502, {
				status: response.status,
				body: await response.text(),
			});
		}

		return (await response.json()) as Record<string, unknown>;
	}

	async requestBatchDownloadUrls(
		jobId: string,
		files: string[],
		signal?: AbortSignal,
	): Promise<Record<string, SignedUrlValue>> {
		const response = await fetchWithTimeout(
			"https://api.sarvam.ai/speech-to-text/job/v1/download-files",
			{
				method: "POST",
				headers: {
					"api-subscription-key": this.apiKey,
					"content-type": "application/json",
				},
				body: JSON.stringify({
					job_id: jobId,
					files,
				}),
				signal,
				timeoutMs: 10000,
			},
		);

		if (!response.ok) {
			throw new AppError("Sarvam batch download URL request failed", 502, {
				status: response.status,
				body: await response.text(),
			});
		}

		const payload = (await response.json()) as {
			download_urls?: Record<string, SignedUrlValue>;
		};

		return payload.download_urls ?? {};
	}
}

async function sarvamResponseError(message: string, response: Response): Promise<AppError> {
	const body = (await response.text()).replace(/\s+/g, " ").trim().slice(0, 500);
	const details = body ? `: ${body}` : "";
	return new AppError(`${message} (Sarvam HTTP ${response.status})${details}`, 502, {
		status: response.status,
		body,
	});
}

export function unwrapSignedUrl(
	value: SignedUrlValue | undefined,
): string {
	if (typeof value === "string") {
		return value;
	}

	const url = value?.url ?? value?.file_url ?? value?.upload_url ?? value?.download_url;
	if (url) {
		return url;
	}

	const fields = value ? Object.keys(value).join(", ") : "none";
	throw new AppError(`Sarvam did not return a usable signed URL (fields: ${fields})`, 502);
}

type SignedUrlValue =
	| string
	| {
			url?: string;
			file_url?: string;
			upload_url?: string;
			download_url?: string;
	  };

export function mapSarvamLanguage(languageCode: string): string {
	if (languageCode.startsWith("hi")) {
		return "hi";
	}

	if (languageCode.startsWith("kn")) {
		return "kn";
	}

	if (languageCode.startsWith("en")) {
		return "en";
	}

	if (languageCode === "unknown" || languageCode.length === 0) {
		return "hi-en";
	}

	return languageCode;
}

export function ensureSarvamError(error: unknown, fallback: string): never {
	throw new AppError(fallback, 502, {
		message: getErrorMessage(error),
	});
}
