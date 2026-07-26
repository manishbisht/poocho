import type { Turn } from "../types";
import { AppError, fetchWithTimeout, throwIfAborted } from "../utils";

interface StreamChunk {
	choices?: Array<{
		delta?: {
			content?: string | null;
			reasoning_content?: string | null;
		};
	}>;
}

export class SarvamChatClient {
	constructor(private readonly apiKey: string) {}

	async *streamCompletion(
		system: string,
		history: Turn[],
		userText: string,
		signal?: AbortSignal,
		extraInstruction?: string,
	): AsyncIterable<string> {
		throwIfAborted(signal);

		const messages = [
			{
				role: "system",
				content: extraInstruction
					? `${system}\n\n${extraInstruction}`
					: system,
			},
			...history.flatMap((turn) => [
				{ role: "user", content: turn.user },
				{ role: "assistant", content: turn.assistant },
			]),
			{
				role: "user",
				content: userText,
			},
		];

		const response = await fetchWithTimeout(
			"https://api.sarvam.ai/v1/chat/completions",
			{
				method: "POST",
				headers: {
					"api-subscription-key": this.apiKey,
					"content-type": "application/json",
				},
				body: JSON.stringify({
					model: "sarvam-105b",
					stream: true,
					temperature: 0.2,
					reasoning_effort: null,
					max_tokens: 512,
					messages,
					response_format: { type: "json_object" },
				}),
				signal,
				timeoutMs: 25000,
			},
		);

		if (!response.ok || !response.body) {
			throw new AppError("Sarvam chat completion failed", 502, {
				status: response.status,
				body: await response.text(),
			});
		}

		const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
		let buffer = "";

		while (true) {
			throwIfAborted(signal);
			const { done, value } = await reader.read();

			if (done) {
				break;
			}

			buffer += value;
			const events = buffer.split("\n\n");
			buffer = events.pop() ?? "";

			for (const event of events) {
				const lines = event
					.split("\n")
					.map((line) => line.trim())
					.filter(Boolean);

				for (const line of lines) {
					if (!line.startsWith("data:")) {
						continue;
					}

					const data = line.slice(5).trim();

					if (data === "[DONE]") {
						return;
					}

					const payload = JSON.parse(data) as StreamChunk;
					const content = payload.choices?.[0]?.delta?.content;

					if (content) {
						yield content;
					}
				}
			}
		}
	}
}
