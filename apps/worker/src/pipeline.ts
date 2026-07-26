import { BulbulClient } from "./sarvam/bulbul";
import { SarvamChatClient } from "./sarvam/chat";
import { SaarasClient, mapSarvamLanguage } from "./sarvam/saaras";
import { buildSystemPrompt } from "./prompts";
import type { Env, Session, ServerMessage, TranscriptSegment, TutorTurnPayload, Turn } from "./types";
import {
	AppError,
	getErrorMessage,
	isAbortError,
	parseModelJson,
	throwIfAborted,
} from "./utils";

const SENTENCE_TERMINATORS = /[.!?।]/;

export async function runPipeline(
	ws: WebSocket,
	session: Session,
	env: Env,
): Promise<void> {
	const signal = session.abortController?.signal;
	const saaras = new SaarasClient(env.SARVAM_API_KEY);
	const chat = new SarvamChatClient(env.SARVAM_API_KEY);
	const bulbul = new BulbulClient(env.SARVAM_API_KEY);

	try {
		throwIfAborted(signal);

		const audioBlob = new Blob(session.currentTurnBuffer, {
			type: "audio/pcm_s16le",
		});
		session.currentTurnBuffer = [];

		const { text, detectedLanguage } = await saaras.transcribe(
			audioBlob,
			session.currentLanguage,
			signal,
		);

		sendMessage(ws, {
			type: "transcript",
			text,
			language: detectedLanguage,
		});

		session.currentLanguage = mapSarvamLanguage(detectedLanguage);
		const systemPrompt = buildSystemPrompt(session);
		let jumped = false;

		const runCompletion = async (extraInstruction?: string) => {
			let full = "";
			let lastSentLength = 0;

			for await (const chunk of chat.streamCompletion(
				systemPrompt,
				session.history,
				text,
				signal,
				extraInstruction,
			)) {
				throwIfAborted(signal);
				full += chunk;

				const partialAnswer = extractJsonStringValue(full, "answer");
				if (partialAnswer && partialAnswer.length > lastSentLength) {
					const newText = partialAnswer.substring(lastSentLength);
					sendMessage(ws, {
						type: "answer_chunk",
						text: newText,
					});
					lastSentLength = partialAnswer.length;
				}

				const partial = extractPartialTurn(full);
				if (
					partial.jump_to_seconds !== null &&
					partial.jump_to_seconds !== undefined &&
					!jumped
				) {
					sendMessage(ws, {
						type: "jump",
						seconds: partial.jump_to_seconds,
					});
					jumped = true;
				}
			}

			return full;
		};

		let full = await runCompletion();
		let finalTurn = parseAndValidateTurn(full);

		if (!finalTurn) {
			full = await runCompletion("Return valid JSON only, no prose.");
			finalTurn = parseAndValidateTurn(full);
		}

		if (!finalTurn) {
			throw new AppError("Sarvam chat returned invalid JSON", 502);
		}

		if (finalTurn.jump_to_seconds !== null && !jumped) {
			sendMessage(ws, {
				type: "jump",
				seconds: finalTurn.jump_to_seconds,
			});
			jumped = true;
		}

		sendMessage(ws, {
			type: "turn_complete",
			turn: finalTurn,
		});

		sendMessage(ws, {
			type: "audio_format",
			sampleRate: 24000,
			channels: 1,
			bitDepth: 16,
		});
		try {
			await bulbul.streamTTS(
				finalTurn.answer,
				finalTurn.language,
				ws,
				signal,
			);
		} catch (ttsError) {
			console.error("TTS streaming error:", ttsError);
			sendMessage(ws, {
				type: "error",
				message: ttsError instanceof Error ? ttsError.message : "TTS streaming failed",
			});
		} finally {
			sendMessage(ws, {
				type: "audio_complete",
			});
		}

		pushTurn(session, {
			user: text,
			assistant: finalTurn.answer,
			jumpTo: finalTurn.jump_to_seconds,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		if (isAbortError(error)) {
			sendMessage(ws, { type: "interrupted" });
			return;
		}

		sendMessage(ws, {
			type: "error",
			message: getErrorMessage(error),
		});
		throw error;
	} finally {
		session.abortController = undefined;
		session.currentTurnBuffer = [];
	}
}

function sendMessage(ws: WebSocket, message: ServerMessage): void {
	if (ws.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify(message));
	}
}

function pushTurn(session: Session, turn: Turn): void {
	session.history.push(turn);

	if (session.history.length > 8) {
		session.history = session.history.slice(-8);
	}
}

function parseAndValidateTurn(raw: string): TutorTurnPayload | null {
	const parsed = parseModelJson<Partial<TutorTurnPayload>>(raw);

	if (!parsed || typeof parsed !== "object") {
		return null;
	}

	if (typeof parsed.answer !== "string" || !parsed.answer.trim()) {
		return null;
	}

	let language: TutorLanguage = "hi-en";
	const rawLang = String(parsed.language || "").toLowerCase();
	if (rawLang === "hi" || rawLang === "kn" || rawLang === "en" || rawLang === "hi-en") {
		language = rawLang as TutorLanguage;
	}

	let jump_to_seconds: number | null = null;
	if (typeof parsed.jump_to_seconds === "number" && !isNaN(parsed.jump_to_seconds)) {
		jump_to_seconds = parsed.jump_to_seconds;
	}

	const is_in_video = typeof parsed.is_in_video === "boolean" ? parsed.is_in_video : true;

	let confidence: "high" | "medium" | "low" = "high";
	const rawConf = String(parsed.confidence || "").toLowerCase();
	if (rawConf === "high" || rawConf === "medium" || rawConf === "low") {
		confidence = rawConf as "high" | "medium" | "low";
	}

	return {
		answer: parsed.answer.trim(),
		language,
		jump_to_seconds,
		is_in_video,
		confidence,
	};
}

function extractPartialTurn(raw: string): Partial<TutorTurnPayload> & {
	answer?: string;
	language?: string;
} {
	const answer = extractJsonStringValue(raw, "answer");
	const language = extractJsonStringValue(raw, "language");
	const jumpMatch = raw.match(
		/"jump_to_seconds"\s*:\s*(null|-?\d+(?:\.\d+)?)/,
	);

	return {
		answer: answer ? answer.trim() : undefined,
		language:
			language === "hi" ||
			language === "kn" ||
			language === "en" ||
			language === "hi-en"
				? language
				: undefined,
		jump_to_seconds: jumpMatch
			? jumpMatch[1] === "null"
				? null
				: Number(jumpMatch[1])
			: undefined,
	};
}

function extractJsonStringValue(raw: string, key: string): string | null {
	const keyPattern = `"${key}"`;
	const keyIndex = raw.indexOf(keyPattern);

	if (keyIndex === -1) {
		return null;
	}

	const colonIndex = raw.indexOf(":", keyIndex + keyPattern.length);
	const firstQuoteIndex = raw.indexOf('"', colonIndex + 1);

	if (colonIndex === -1 || firstQuoteIndex === -1) {
		return null;
	}

	let result = "";
	let escaped = false;

	for (let index = firstQuoteIndex + 1; index < raw.length; index += 1) {
		const character = raw[index];

		if (escaped) {
			result += character;
			escaped = false;
			continue;
		}

		if (character === "\\") {
			escaped = true;
			continue;
		}

		if (character === '"') {
			return result;
		}

		result += character;
	}

	return result.length > 0 ? result : null;
}
