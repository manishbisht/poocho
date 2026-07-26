type VoiceActivityDetectorOptions = {
	speechThreshold?: number;
	silenceHangoverMs?: number;
	minSpeechMs?: number;
	onSpeechStart: () => void;
	onSpeechEnd: () => void;
};

export type VoiceActivityState = "idle" | "speaking";

export class VoiceActivityDetector {
	private readonly options: Required<VoiceActivityDetectorOptions>;
	private speechCandidateSince: number | null = null;
	private silenceSince: number | null = null;
	private state: VoiceActivityState = "idle";

	constructor(options: VoiceActivityDetectorOptions) {
		this.options = {
			speechThreshold: options.speechThreshold ?? 0.02,
			silenceHangoverMs: options.silenceHangoverMs ?? 700,
			minSpeechMs: options.minSpeechMs ?? 300,
			onSpeechStart: options.onSpeechStart,
			onSpeechEnd: options.onSpeechEnd,
		};
	}

	feed(rms: number, timestamp: number): void {
		if (rms >= this.options.speechThreshold) {
			this.silenceSince = null;
			if (this.state === "speaking") {
				return;
			}
			this.speechCandidateSince ??= timestamp;
			if (timestamp - this.speechCandidateSince >= this.options.minSpeechMs) {
				this.state = "speaking";
				this.speechCandidateSince = null;
				this.options.onSpeechStart();
			}
			return;
		}

		this.speechCandidateSince = null;
		if (this.state !== "speaking") {
			return;
		}
		this.silenceSince ??= timestamp;
		if (timestamp - this.silenceSince >= this.options.silenceHangoverMs) {
			this.state = "idle";
			this.silenceSince = null;
			this.options.onSpeechEnd();
		}
	}

	reset(): void {
		this.speechCandidateSince = null;
		this.silenceSince = null;
		this.state = "idle";
	}

	get currentState(): VoiceActivityState {
		return this.state;
	}
}
