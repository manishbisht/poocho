// Zustand is necessary because this app did not previously have the requested shared voice/player store.
import { create } from "zustand";
import type { VoiceLanguage } from "../types/protocol";

export type VoiceState = "idle" | "listening" | "thinking" | "speaking";

export type ChatTurn = {
	role: "user" | "poocho";
	text: string;
	language: VoiceLanguage;
	jumpTo: number | null;
	timestamp: number;
	interrupted?: boolean;
};

type PlayerControl = {
	pause: () => void;
	play: () => void;
	seek: (seconds: number) => void;
	mute?: () => void;
	unmute?: () => void;
};

type VoiceStore = {
	videoId: string | null;
	micLevel: number;
	voiceState: VoiceState;
	currentLanguage: VoiceLanguage | null;
	chatTurns: ChatTurn[];
	videoShouldFlash: { seconds: number; key: number } | null;
	position: number;
	isPlaying: boolean;
	player: PlayerControl | null;
	setVideoId: (videoId: string) => void;
	clearVideoSession: () => void;
	appendUserTurn: (text: string, language: VoiceLanguage, interrupted?: boolean) => void;
	appendPoochoTurn: (text: string, language: VoiceLanguage, jumpTo: number | null, interrupted?: boolean) => void;
	setMicLevel: (level: number) => void;
	setVoiceState: (state: VoiceState) => void;
	setCurrentLanguage: (language: VoiceLanguage | null) => void;
	triggerVideoFlash: (seconds: number) => void;
	pauseVideo: () => void;
	resumeVideo: () => void;
	seekVideo: (seconds: number) => void;
	setPosition: (seconds: number) => void;
	setPlayer: (player: PlayerControl | null) => void;
	muteVideo: () => void;
	unmuteVideo: () => void;
	duration: number;
	setDuration: (duration: number) => void;
};

export const useVoiceStore = create<VoiceStore>((set, get) => ({
	videoId: null,
	micLevel: 0,
	voiceState: "idle",
	currentLanguage: null,
	chatTurns: [],
	videoShouldFlash: null,
	position: 0,
	isPlaying: true,
	player: null,
	setVideoId: (videoId) => set({ videoId }),
	clearVideoSession: () => set({
		videoId: null,
		micLevel: 0,
		voiceState: "idle",
		currentLanguage: null,
		chatTurns: [],
		videoShouldFlash: null,
		position: 0,
		isPlaying: true,
		player: null,
	}),
	appendUserTurn: (text, language, interrupted = false) => set((state) => ({
		chatTurns: [...state.chatTurns, { role: "user", text, language, jumpTo: null, timestamp: Date.now(), interrupted }],
	})),
	appendPoochoTurn: (text, language, jumpTo, interrupted = false) => set((state) => ({
		chatTurns: [...state.chatTurns, { role: "poocho", text, language, jumpTo, timestamp: Date.now(), interrupted }],
	})),
	setMicLevel: (level) => set({ micLevel: Math.max(0, Math.min(1, level)) }),
	setVoiceState: (voiceState) => set({ voiceState }),
	setCurrentLanguage: (currentLanguage) => set({ currentLanguage }),
	triggerVideoFlash: (seconds) => set((state) => ({
		videoShouldFlash: { seconds, key: (state.videoShouldFlash?.key ?? 0) + 1 },
	})),
	pauseVideo: () => {
		get().player?.pause();
		set({ isPlaying: false });
	},
	resumeVideo: () => {
		get().player?.play();
		set({ isPlaying: true });
	},
	seekVideo: (seconds) => {
		get().player?.seek(seconds);
		set({ position: seconds });
	},
	setPosition: (position) => set({ position }),
	setPlayer: (player) => set({ player }),
	muteVideo: () => {
		get().player?.mute?.();
	},
	unmuteVideo: () => {
		get().player?.unmute?.();
	},
	duration: 0,
	setDuration: (duration) => set({ duration }),
}));
