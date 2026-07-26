export type VoiceLanguage = "hi" | "kn" | "en" | "hi-en";

export type ClientMessage =
	| { type: "init"; videoId: string }
	| { type: "position"; seconds: number }
	| { type: "start_turn" }
	| { type: "end_turn" }
	| { type: "interrupt" };

export type Turn = {
	answer: string;
	language: VoiceLanguage;
	jump_to_seconds: number | null;
	is_in_video: boolean;
	confidence: "high" | "medium" | "low";
};

export type ServerMessage =
	| { type: "ready" }
	| { type: "transcript"; text: string; language: VoiceLanguage }
	| { type: "jump"; seconds: number }
	| { type: "turn_complete"; turn: Turn }
	| { type: "interrupted" }
	| { type: "audio_format"; sampleRate: number; channels: number; bitDepth: number }
	| { type: "answer_chunk"; text: string }
	| { type: "audio_complete" }
	| { type: "error"; message: string };
