export interface Env {
	SESSION: DurableObjectNamespace;
	TRANSCRIPTION_JOB: DurableObjectNamespace;
	STORAGE: R2Bucket;
	SARVAM_API_KEY: string;
	R2_ACCESS_KEY_ID: string;
	R2_SECRET_ACCESS_KEY: string;
	R2_ACCOUNT_ID: string;
}

export interface TranscriptSegment {
	start: number;
	end: number;
	text: string;
	language?: string;
}

export interface Turn {
	user: string;
	assistant: string;
	jumpTo: number | null;
	timestamp: string;
}

export interface Session {
	videoId: string;
	transcript: TranscriptSegment[];
	playbackPosition: number;
	currentLanguage: string;
	history: Turn[];
	currentTurnBuffer: Uint8Array[];
	abortController?: AbortController;
}

export interface SessionAttachment {
	videoId: string;
	playbackPosition: number;
	currentLanguage: string;
	history: Turn[];
}

export type ClientMessage =
	| {
			type: "init";
			videoId: string;
	  }
	| {
			type: "position";
			seconds: number;
	  }
	| {
			type: "start_turn";
	  }
	| {
			type: "end_turn";
	  }
	| {
			type: "interrupt";
	  };

export type TutorLanguage = "hi" | "kn" | "en" | "hi-en";

export interface TutorTurnPayload {
	answer: string;
	language: TutorLanguage;
	jump_to_seconds: number | null;
	is_in_video: boolean;
	confidence: "high" | "medium" | "low";
}

export type ServerMessage =
	| {
			type: "ready";
	  }
	| {
			type: "transcript";
			text: string;
			language: string;
	  }
	| {
			type: "jump";
			seconds: number;
	  }
	| {
			type: "turn_complete";
			turn: TutorTurnPayload;
	  }
	| {
			type: "interrupted";
	  }
	| {
			type: "audio_format";
			sampleRate: number;
			channels: number;
			bitDepth: number;
	  }
	| {
			type: "answer_chunk";
			text: string;
	  }
	| {
			type: "audio_complete";
	  }
	| {
			type: "error";
			message: string;
	  };

export interface VideoMeta {
	videoId: string;
	filename: string;
	contentType: string;
	size: number;
	status: "uploading" | "processing" | "ready" | "failed";
	createdAt: string;
	updatedAt?: string;
	error?: string;
	transcriptKey?: string;
	sarvamJobId?: string;
}

export interface SaarasTranscription {
	text: string;
	detectedLanguage: string;
}
