import { SaarasClient, unwrapSignedUrl } from "./sarvam/saaras";
import type { Env, TranscriptSegment, VideoMeta } from "./types";
import {
	AppError,
	corsHeaders,
	fetchWithTimeout,
	getErrorMessage,
	json,
	readJsonFromR2,
	sleep,
	writeJsonToR2,
} from "./utils";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const VIDEO_PREFIX = "videos";

function metaKey(videoId: string): string {
	return `${VIDEO_PREFIX}/${videoId}/meta.json`;
}

function transcriptKey(videoId: string): string {
	return `${VIDEO_PREFIX}/${videoId}/transcript.json`;
}

function originalVideoKey(videoId: string): string {
	return `${VIDEO_PREFIX}/${videoId}/original.mp4`;
}

export async function uploadVideo(
	request: Request,
	env: Env,
): Promise<Response> {
	const contentLength = request.headers.get("content-length");
	if (!contentLength) {
		console.warn("Rejecting upload without Content-Length header");
		throw new AppError("Content-Length is required for uploads", 413);
	}

	const size = Number(contentLength);
	if (!Number.isSafeInteger(size) || size < 0 || size > MAX_VIDEO_SIZE) {
		throw new AppError("Video exceeds 100MB limit", 413);
	}

	const contentType = request.headers.get("content-type") ?? "";
	if (!contentType.startsWith("video/")) {
		throw new AppError("contentType must be a video MIME type", 400);
	}

	const encodedFilename = request.headers.get("x-filename");
	if (!encodedFilename) {
		throw new AppError("X-Filename header is required", 400);
	}

	if (!request.body) {
		throw new AppError("Upload body is required", 400);
	}

	const filename = decodeFilename(encodedFilename);
	const videoId = crypto.randomUUID();
	const createdAt = new Date().toISOString();
	const meta: VideoMeta = {
		videoId,
		filename,
		contentType,
		size,
		status: "processing",
		createdAt,
	};

	try {
		await env.STORAGE.put(originalVideoKey(videoId), request.body, {
			httpMetadata: { contentType },
		});
	} catch (error) {
		await writeFailedUploadMeta(env, meta, getErrorMessage(error));
		throw new AppError("Failed to write video to storage", 502);
	}

	try {
		await writeJsonToR2(env, metaKey(videoId), meta);
	} catch (error) {
		await writeFailedUploadMeta(env, meta, getErrorMessage(error));
		throw new AppError("Failed to write video metadata", 502);
	}

	try {
		await queueVideoProcessing(videoId, env);
	} catch (error) {
		await updateMeta(env, videoId, {
			status: "failed",
			error: getErrorMessage(error),
		});
		throw error;
	}

	return json({ videoId, status: "processing" });
}

async function queueVideoProcessing(videoId: string, env: Env): Promise<void> {
	const durableObjectId = env.TRANSCRIPTION_JOB.idFromName(videoId);
	const job = env.TRANSCRIPTION_JOB.get(durableObjectId);
	const response = await job.fetch("https://transcription-job/queue", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ videoId }),
	});

	if (!response.ok) {
		throw new AppError("Failed to queue video processing", 502);
	}
}

export async function getVideoStatus(
	videoId: string,
	env: Env,
): Promise<Response> {
	const meta = await readJsonFromR2<VideoMeta>(env, metaKey(videoId));

	if (!meta) {
		throw new AppError("Video not found", 404);
	}

	return json(meta);
}

export async function streamVideo(
	request: Request,
	videoId: string,
	env: Env,
): Promise<Response> {
	// Pass the request headers straight through so R2 parses the `Range` header
	// itself and populates `object.range`; passing the raw header string throws.
	const object = await env.STORAGE.get(originalVideoKey(videoId), {
		range: request.headers,
	});

	if (!object) {
		return new Response("Video not found", {
			status: 404,
			headers: corsHeaders(request),
		});
	}

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set("accept-ranges", "bytes");

	const cors = corsHeaders(request);
	for (const [key, value] of Object.entries(cors)) {
		headers.set(key, value);
	}

	const status = object.range ? 206 : 200;

	if (object.range) {
		const size = object.size;
		// R2 normalizes a parsed Range header to the offset/length form, but the
		// R2Range type is a union (it also allows `{ suffix }`), so fall back
		// defensively to keep the header math correct for every shape.
		const offset = "offset" in object.range ? object.range.offset ?? 0 : 0;
		const length =
			"length" in object.range ? object.range.length ?? size - offset : size - offset;
		const end = offset + length - 1;
		headers.set("content-range", `bytes ${offset}-${end}/${size}`);
		headers.set("content-length", String(length));
	} else {
		headers.set("content-length", String(object.size));
	}

	return new Response(object.body, {
		status,
		headers,
	});
}

export async function processVideo(
	videoId: string,
	env: Env,
): Promise<void> {
	const saaras = new SaarasClient(env.SARVAM_API_KEY);

	try {
		const sourceVideo = await env.STORAGE.get(originalVideoKey(videoId));
		if (!sourceVideo?.body) {
			throw new AppError("Uploaded video is missing from storage", 404);
		}
		const { job_id: jobId } = await saaras.submitBatchJob();
		await updateMeta(env, videoId, {
			status: "processing",
			sarvamJobId: jobId,
			error: undefined,
		});

		// Sarvam's current batch docs expose init → upload URL → start → poll → download,
		// so the Worker streams the already-uploaded R2 object into Sarvam's signed upload URL.
		const uploadUrls = await saaras.requestBatchUploadUrls(jobId, ["original.mp4"]);
		const sarvamUploadUrl = unwrapSignedUrl(uploadUrls["original.mp4"]);
		await uploadVideoToSarvam(
			sourceVideo.body,
			sourceVideo.size,
			toSarvamContentType(sourceVideo.httpMetadata?.contentType),
			sarvamUploadUrl,
		);
		await saaras.startBatchJob(jobId);

		let status: Record<string, unknown> | null = null;

		for (let attempt = 0; attempt < 120; attempt += 1) {
			await sleep(5000);
			status = await saaras.getBatchStatus(jobId);
			const jobState = String(status.job_state ?? "");

			if (jobState === "Completed" || jobState === "PartiallyCompleted") {
				break;
			}

			if (jobState === "Failed") {
				throw new AppError(
					String(status.error_message ?? "Sarvam batch transcription failed"),
					502,
				);
			}
		}

		if (!status) {
			throw new AppError("Sarvam batch status was unavailable", 502);
		}

		const jobState = String(status.job_state ?? "");
		if (jobState !== "Completed" && jobState !== "PartiallyCompleted") {
			throw new AppError("Sarvam batch transcription timed out", 504);
		}

		const outputFile = getOutputFileName(status);
		if (!outputFile) {
			throw new AppError("Sarvam batch output file missing", 502);
		}

		const downloadUrls = await saaras.requestBatchDownloadUrls(jobId, [outputFile]);
		const transcriptDownloadUrl = unwrapSignedUrl(downloadUrls[outputFile]);
		const transcriptPayload = await downloadTranscriptPayload(transcriptDownloadUrl);
		const transcript = normalizeTranscriptPayload(transcriptPayload);

		await writeJsonToR2(env, transcriptKey(videoId), transcript);
		await updateMeta(env, videoId, {
			status: "ready",
			error: undefined,
			transcriptKey: transcriptKey(videoId),
		});
	} catch (error) {
		await updateMeta(env, videoId, {
			status: "failed",
			error: getErrorMessage(error),
		});
	}
}

async function uploadVideoToSarvam(
	source: ReadableStream<Uint8Array>,
	size: number,
	contentType: string,
	destinationUrl: string,
): Promise<void> {
	const uploadResponse = await fetchWithTimeout(destinationUrl, {
		method: "PUT",
		body: source,
		headers: {
			"content-length": String(size),
			"content-type": contentType,
			"x-ms-blob-type": "BlockBlob",
		},
		timeoutMs: 120000,
	});

	if (!uploadResponse.ok) {
		const body = (await uploadResponse.text()).replace(/\s+/g, " ").trim().slice(0, 500);
		const details = body ? `: ${body}` : "";
		throw new AppError(
			`Failed to upload video into Sarvam batch job (storage HTTP ${uploadResponse.status})${details}`,
			502,
			{
			status: uploadResponse.status,
			body,
			},
		);
	}
}

function toSarvamContentType(contentType: string | undefined): string {
	if (contentType === "video/mp4") {
		return "audio/mp4";
	}

	return contentType ?? "application/octet-stream";
}

function getOutputFileName(status: Record<string, unknown>): string | null {
	const details = Array.isArray(status.job_details) ? status.job_details : [];

	for (const detail of details) {
		if (!detail || typeof detail !== "object") {
			continue;
		}

		const outputs = Array.isArray((detail as { outputs?: unknown[] }).outputs)
			? ((detail as { outputs: Array<{ file_name?: string }> }).outputs ?? [])
			: [];

		for (const output of outputs) {
			if (output.file_name) {
				return output.file_name;
			}
		}
	}

	return null;
}

async function downloadTranscriptPayload(url: string): Promise<Record<string, unknown>> {
	const response = await fetchWithTimeout(url, {
		method: "GET",
		timeoutMs: 30000,
	});

	if (!response.ok) {
		throw new AppError("Failed to download transcript payload", 502, {
			status: response.status,
			body: await response.text(),
		});
	}

	return (await response.json()) as Record<string, unknown>;
}

function normalizeTranscriptPayload(
	payload: Record<string, unknown>,
): TranscriptSegment[] {
	const diarizedEntries = (payload.diarized_transcript as { entries?: unknown[] } | undefined)
		?.entries;

	if (Array.isArray(diarizedEntries) && diarizedEntries.length > 0) {
		const segments = diarizedEntries
			.map((entry) => mapTranscriptEntry(entry))
			.filter((segment): segment is TranscriptSegment => segment !== null);

		if (segments.length > 0) {
			return segments;
		}
	}

	const timestampContainer = payload.timestamps as
		| {
				timestamps?: {
					words?: unknown[];
					chunks?: unknown[];
					start_time_seconds?: unknown[];
					end_time_seconds?: unknown[];
				};
				words?: unknown[];
				chunks?: unknown[];
				start_time_seconds?: unknown[];
				end_time_seconds?: unknown[];
		  }
		| undefined;

	const timestampShape =
		timestampContainer?.timestamps && typeof timestampContainer.timestamps === "object"
			? timestampContainer.timestamps
			: timestampContainer;

	if (
		timestampShape &&
		Array.isArray(timestampShape.words ?? timestampShape.chunks) &&
		Array.isArray(timestampShape.start_time_seconds) &&
		Array.isArray(timestampShape.end_time_seconds)
	) {
		const entries = timestampShape.words ?? timestampShape.chunks ?? [];

		const segments = entries
			.map((word, index) => {
				const text = String(word ?? "").trim();
				const start = Number(timestampShape.start_time_seconds?.[index]);
				const end = Number(timestampShape.end_time_seconds?.[index]);
				if (!text) {
					return null;
				}

				if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end < start) {
					return null;
				}

				return {
					start,
					end,
					text,
				} satisfies TranscriptSegment;
			})
			.filter((segment): segment is TranscriptSegment => segment !== null);

		if (segments.length > 0) {
			return segments;
		}
	}

	throw new AppError("Sarvam batch transcript did not include timestamped segments", 502);
}

function mapTranscriptEntry(entry: unknown): TranscriptSegment | null {
	if (!entry || typeof entry !== "object") {
		return null;
	}

	const candidate = entry as {
		start_time_seconds?: number;
		end_time_seconds?: number;
		transcript?: string;
		language_code?: string;
	};

	const start = Number(candidate.start_time_seconds);
	const end = Number(candidate.end_time_seconds);

	if (
		!candidate.transcript ||
		!Number.isFinite(start) ||
		!Number.isFinite(end) ||
		start < 0 ||
		end < start
	) {
		return null;
	}

	return {
		start,
		end,
		text: candidate.transcript,
		language: candidate.language_code,
	};
}

async function getRequiredMeta(env: Env, videoId: string): Promise<VideoMeta> {
	const meta = await readJsonFromR2<VideoMeta>(env, metaKey(videoId));

	if (!meta) {
		throw new AppError("Video not found", 404);
	}

	return meta;
}

function decodeFilename(value: string): string {
	try {
		return decodeURIComponent(value);
	} catch {
		throw new AppError("X-Filename must be URL encoded", 400);
	}
}

async function writeFailedUploadMeta(
	env: Env,
	meta: VideoMeta,
	error: string,
): Promise<void> {
	try {
		await writeJsonToR2(env, metaKey(meta.videoId), {
			...meta,
			status: "failed",
			error,
			updatedAt: new Date().toISOString(),
		});
	} catch (metaError) {
		console.error("Failed to write failed-upload metadata", getErrorMessage(metaError));
	}
}

async function updateMeta(
	env: Env,
	videoId: string,
	patch: Partial<VideoMeta>,
): Promise<void> {
	const current = await getRequiredMeta(env, videoId);
	await writeJsonToR2(env, metaKey(videoId), {
		...current,
		...patch,
		updatedAt: new Date().toISOString(),
	});
}
