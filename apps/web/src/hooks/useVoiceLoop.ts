import { useCallback, useEffect, useRef, useState } from "react";
import { StreamingAudioPlayer } from "../lib/audio/audioPlayer";
import { MicCapture } from "../lib/audio/micCapture";
import { VoiceActivityDetector } from "../lib/audio/vad";
import { PoochoSocket } from "../lib/transport/wsClient";
import { useVoiceStore, type VoiceState } from "../store/voiceStore";
import type { ServerMessage, VoiceLanguage } from "../types/protocol";

type ConnectionState = "idle" | "connecting" | "ready" | "error";

type VoiceLoop = {
	connectionState: ConnectionState;
	voiceState: VoiceState;
	currentLanguage: VoiceLanguage | null;
	micLevel: number;
	latestTranscript: string | null;
	latestAnswer: string | null;
	errorMessage: string | null;
	activateMic: () => void;
	releaseMic: () => void;
	interrupt: () => void;
	clearError: () => void;
};

const DEFAULT_WS_URL = import.meta.env.VITE_WS_URL || "wss://poocho.manishbisht.workers.dev";

export function useVoiceLoop(videoId: string): VoiceLoop {
	const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
	const [latestTranscript, setLatestTranscript] = useState<string | null>(null);
	const [latestAnswer, setLatestAnswer] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const micLevel = useVoiceStore((state) => state.micLevel);
	const voiceState = useVoiceStore((state) => state.voiceState);
	const currentLanguage = useVoiceStore((state) => state.currentLanguage);
	const position = useVoiceStore((state) => state.position);
	const socketRef = useRef<PoochoSocket | null>(null);
	const micRef = useRef<MicCapture | null>(null);
	const playerRef = useRef<StreamingAudioPlayer | null>(null);
	const inputVadRef = useRef<VoiceActivityDetector | null>(null);
	const interruptVadRef = useRef<VoiceActivityDetector | null>(null);
	const turnActiveRef = useRef(false);
	const wasInterruptedRef = useRef(false);
	const lastPositionSentAtRef = useRef(0);
	const lastPositionSentValueRef = useRef<number | null>(null);
	const latestTranscriptRef = useRef<string | null>(null);
	const latestAnswerRef = useRef<string | null>(null);
	const latestJumpToRef = useRef<number | null>(null);
	const typingIntervalRef = useRef<any>(null);
	const latestFullAnswerTextRef = useRef<string | null>(null);
	const audioCompleteReceivedRef = useRef(false);

	const endTurn = useCallback(() => {
		if (!turnActiveRef.current) {
			return;
		}
		turnActiveRef.current = false;
		micRef.current?.stop();
		useVoiceStore.getState().setMicLevel(0);
		socketRef.current?.send({ type: "end_turn" });
		useVoiceStore.getState().setVoiceState("thinking");
	}, []);

	const interrupt = useCallback(() => {
		if (wasInterruptedRef.current || useVoiceStore.getState().voiceState !== "speaking") {
			return;
		}
		if (typingIntervalRef.current) {
			clearInterval(typingIntervalRef.current);
			typingIntervalRef.current = null;
		}
		audioCompleteReceivedRef.current = false;
		wasInterruptedRef.current = true;
		micRef.current?.stop();
		playerRef.current?.stop();
		socketRef.current?.send({ type: "interrupt" });
	}, []);

	const startMic = useCallback(async (forInterrupt: boolean) => {
		if (turnActiveRef.current || micRef.current?.isActive()) {
			return;
		}
		try {
			if (forInterrupt) {
				wasInterruptedRef.current = true;
				micRef.current?.stop();
				playerRef.current?.stop();
				socketRef.current?.send({ type: "interrupt" });
			}
			if (typingIntervalRef.current) {
				clearInterval(typingIntervalRef.current);
				typingIntervalRef.current = null;
			}
			latestFullAnswerTextRef.current = null;
			audioCompleteReceivedRef.current = false;
			useVoiceStore.getState().muteVideo();
			setLatestTranscript(null);
			setLatestAnswer(null);
			setErrorMessage(null);
			latestTranscriptRef.current = null;
			latestAnswerRef.current = null;
			latestJumpToRef.current = null;
			const detector = new VoiceActivityDetector({
				speechThreshold: 0.02,
				silenceHangoverMs: 700,
				minSpeechMs: 300,
				onSpeechStart: () => undefined,
				onSpeechEnd: endTurn,
			});
			inputVadRef.current = detector;
			const capture = new MicCapture({
				sampleRate: 16_000,
				onChunk: (chunk) => socketRef.current?.sendBinary(chunk),
					onLevel: (rms) => {
					useVoiceStore.getState().setMicLevel(rms);
					detector.feed(rms, performance.now());
				},
				onEnded: endTurn,
			});
			micRef.current = capture;
			await capture.start();
			turnActiveRef.current = true;
			socketRef.current?.send({ type: "start_turn" });
			useVoiceStore.getState().setVoiceState("listening");
		} catch {
			useVoiceStore.getState().setVoiceState("idle");
			useVoiceStore.getState().setMicLevel(0);
			setErrorMessage("Failed to start microphone. Please check permissions.");
		}
	}, [endTurn]);

	const activateMic = useCallback(() => {
		void playerRef.current?.resume().catch(() => undefined);
		void startMic(useVoiceStore.getState().voiceState === "speaking");
	}, [startMic]);

	const releaseMic = useCallback(() => {
		endTurn();
	}, [endTurn]);

	const clearError = useCallback(() => {
		setErrorMessage(null);
		if (connectionState === "error") {
			setConnectionState("ready");
		}
	}, [connectionState]);

	useEffect(() => {
		const socket = new PoochoSocket(DEFAULT_WS_URL, videoId);
		const player = new StreamingAudioPlayer();
		let disposed = false;
		socketRef.current = socket;
		playerRef.current = player;

		setLatestTranscript(null);
		setLatestAnswer(null);
		setErrorMessage(null);
		latestTranscriptRef.current = null;
		latestAnswerRef.current = null;
		latestJumpToRef.current = null;

		const commitTurn = () => {
			if (typingIntervalRef.current) {
				clearInterval(typingIntervalRef.current);
				typingIntervalRef.current = null;
			}

			if (!turnActiveRef.current) {
				micRef.current?.stop();
			}
			useVoiceStore.getState().setVoiceState("idle");
			useVoiceStore.getState().unmuteVideo();

			const finalAnswer = latestFullAnswerTextRef.current || latestAnswerRef.current || "";

			if (latestTranscriptRef.current) {
				const qText = latestTranscriptRef.current;
				const aText = finalAnswer;
				const lang = useVoiceStore.getState().currentLanguage || "hi-en";

				useVoiceStore.getState().appendUserTurn(qText, lang);
				useVoiceStore.getState().appendPoochoTurn(aText, lang, latestJumpToRef.current);

				setLatestTranscript(null);
				setLatestAnswer(null);
				latestTranscriptRef.current = null;
				latestAnswerRef.current = null;
				latestJumpToRef.current = null;
				latestFullAnswerTextRef.current = null;
			}
		};

		queueMicrotask(() => {
			if (disposed) {
				return;
			}
			setConnectionState("connecting");
			void socket.connect().then(
				() => setConnectionState("ready"),
				(err: Error) => {
					setConnectionState("error");
					setErrorMessage(err.message || "Failed to connect to the server.");
				},
			);
		});

		const removeListeners = [
			socket.on("ready", () => setConnectionState("ready")),
			socket.on("transcript", (message) => {
				const transcript = message as Extract<ServerMessage, { type: "transcript" }>;
				latestTranscriptRef.current = transcript.text;
				setLatestTranscript(transcript.text);
				useVoiceStore.getState().setCurrentLanguage(transcript.language);
			}),
			socket.on("jump", (message) => {
				const jump = message as Extract<ServerMessage, { type: "jump" }>;
				useVoiceStore.getState().seekVideo(jump.seconds);
				useVoiceStore.getState().triggerVideoFlash(jump.seconds);
			}),
			socket.on("audio_format", (message) => {
				const format = message as Extract<ServerMessage, { type: "audio_format" }>;
				player.setFormat(format.sampleRate, format.bitDepth);
			}),
			socket.on("answer_chunk", (message) => {
				const chunk = message as { type: "answer_chunk"; text: string };
				setLatestAnswer((prev) => (prev || "") + chunk.text);
				latestAnswerRef.current = (latestAnswerRef.current || "") + chunk.text;
			}),
			socket.on("audio", (chunk) => {
				if (useVoiceStore.getState().voiceState !== "speaking") {
					useVoiceStore.getState().setVoiceState("speaking");
					interruptVadRef.current = new VoiceActivityDetector({
						speechThreshold: 0.12,
						silenceHangoverMs: 700,
						minSpeechMs: 300,
						onSpeechStart: interrupt,
						onSpeechEnd: () => undefined,
					});
					const bargeCapture = new MicCapture({
						sampleRate: 16_000,
						onChunk: () => undefined,
						onLevel: (rms) => interruptVadRef.current?.feed(rms, performance.now()),
					});
					micRef.current = bargeCapture;
					void bargeCapture.start().catch(() => undefined);
				}
				player.enqueue(chunk as ArrayBuffer);
			}),
			socket.on("turn_complete", (message) => {
				const completion = message as Extract<ServerMessage, { type: "turn_complete" }>;
				const aText = completion.turn.answer;
				const jumpTo = completion.turn.jump_to_seconds;

				setLatestAnswer(aText);
				latestAnswerRef.current = aText;
				latestFullAnswerTextRef.current = aText;
				latestJumpToRef.current = jumpTo;

				if (typingIntervalRef.current) {
					clearInterval(typingIntervalRef.current);
					typingIntervalRef.current = null;
				}
			}),
			socket.on("audio_complete", () => {
				audioCompleteReceivedRef.current = true;
				if (!player.isPlaying()) {
					commitTurn();
				}
			}),
			socket.on("interrupted", () => {
				player.stop();
				if (typingIntervalRef.current) {
					clearInterval(typingIntervalRef.current);
					typingIntervalRef.current = null;
				}
				audioCompleteReceivedRef.current = false;

				const qText = latestTranscriptRef.current || "";
				const aText = latestAnswerRef.current || "";
				const lang = useVoiceStore.getState().currentLanguage || "hi-en";

				useVoiceStore.getState().appendUserTurn(qText, lang, true);
				if (aText) {
					useVoiceStore.getState().appendPoochoTurn(aText, lang, null, true);
				}

				setLatestTranscript(null);
				setLatestAnswer(null);
				latestTranscriptRef.current = null;
				latestAnswerRef.current = null;
				latestJumpToRef.current = null;
				latestFullAnswerTextRef.current = null;

				useVoiceStore.getState().setVoiceState("idle");
				useVoiceStore.getState().unmuteVideo();
				wasInterruptedRef.current = false;
			}),
			socket.on("error", (err) => {
				setConnectionState("error");
				if (err instanceof Error) {
					setErrorMessage(err.message);
				} else if (err && typeof err === "object" && "message" in err) {
					setErrorMessage(String((err as { message: unknown }).message));
				} else {
					setErrorMessage("An unknown error occurred");
				}
			}),
			socket.on("close", () => {
				if (socket.readyState !== "closed") {
					setConnectionState("connecting");
				}
			}),
		];
		player.onEnded(() => {
			if (!audioCompleteReceivedRef.current) {
				console.log("Buffer underrun: ignoring premature ended callback");
				return;
			}
			commitTurn();
		});

		return () => {
			disposed = true;
			removeListeners.forEach((remove) => remove());
			micRef.current?.stop();
			player.destroy();
			socket.close();
			socketRef.current = null;
			playerRef.current = null;
			useVoiceStore.getState().unmuteVideo();
			if (typingIntervalRef.current) {
				clearInterval(typingIntervalRef.current);
			}
		};
	}, [interrupt, startMic, videoId]);

	useEffect(() => {
		const state = useVoiceStore.getState();
		if (connectionState === "ready" && state.isPlaying && position !== lastPositionSentValueRef.current) {
			const now = performance.now();
			if (now - lastPositionSentAtRef.current >= 1_000) {
				socketRef.current?.send({ type: "position", seconds: position });
				lastPositionSentAtRef.current = now;
				lastPositionSentValueRef.current = position;
			}
		}
	}, [connectionState, position]);

	useEffect(() => {
		const onVisibilityChange = () => {
			if (document.hidden && micRef.current?.isActive()) {
				endTurn();
			}
		};
		document.addEventListener("visibilitychange", onVisibilityChange);
		return () => document.removeEventListener("visibilitychange", onVisibilityChange);
	}, [endTurn]);

	return { connectionState, voiceState, currentLanguage, micLevel, latestTranscript, latestAnswer, errorMessage, activateMic, releaseMic, interrupt, clearError };
}
