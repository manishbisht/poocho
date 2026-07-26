import { AppError, fetchWithTimeout, throwIfAborted } from "../utils";

function toLanguageCode(language: string): string {
	switch (language) {
		case "hi":
			return "hi-IN";
		case "kn":
			return "kn-IN";
		case "en":
			return "en-IN";
		case "hi-en":
			return "hi-IN";
		default:
			return language.includes("-") ? language : "hi-IN";
	}
}

function selectSpeaker(language: string): string {
	switch (language) {
		case "kn":
			return "kavitha";
		case "en":
			return "shubh";
		case "hi":
		case "hi-en":
		default:
			return "priya";
	}
}

export class BulbulClient {
	constructor(private readonly apiKey: string) {}

	async streamTTS(
		text: string,
		language: string,
		ws: WebSocket,
		signal?: AbortSignal,
	): Promise<void> {
		throwIfAborted(signal);

		const response = await fetchWithTimeout(
			"https://api.sarvam.ai/text-to-speech/stream",
			{
				method: "POST",
				headers: {
					"api-subscription-key": this.apiKey,
					"content-type": "application/json",
				},
				body: JSON.stringify({
					model: "bulbul:v3",
					text,
					target_language_code: toLanguageCode(language),
					speaker: selectSpeaker(language),
					pace: 0.92,
					temperature: 0.35,
					output_audio_codec: "linear16",
					sample_rate: 24000,
				}),
				signal,
				timeoutMs: 25000,
			},
		);

		if (!response.ok || !response.body) {
			throw new AppError("Sarvam text-to-speech failed", 502, {
				status: response.status,
				body: await response.text(),
			});
		}

		const reader = response.body.getReader();

		while (true) {
			throwIfAborted(signal);
			const { done, value } = await reader.read();

			if (done) {
				return;
			}

			if (value && value.byteLength > 0 && ws.readyState === WebSocket.OPEN) {
				ws.send(value);
			}
		}
	}
}
