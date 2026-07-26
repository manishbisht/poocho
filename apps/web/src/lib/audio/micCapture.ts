export class MicPermissionError extends Error {
	constructor(message = "Microphone permission was denied") {
		super(message);
		this.name = "MicPermissionError";
	}
}

type MicCaptureOptions = {
	sampleRate: number;
	onChunk: (chunk: ArrayBuffer) => void;
	onLevel: (rms: number) => void;
	onEnded?: () => void;
};

type WorkletMessage =
	| { type: "chunk"; chunk: ArrayBuffer }
	| { type: "level"; rms: number };

export class MicCapture {
	private readonly options: MicCaptureOptions;
	private context: AudioContext | null = null;
	private stream: MediaStream | null = null;
	private source: MediaStreamAudioSourceNode | null = null;
	private worklet: AudioWorkletNode | null = null;
	private active = false;

	constructor(options: MicCaptureOptions) {
		this.options = options;
	}

	async start(): Promise<void> {
		if (this.active) {
			return;
		}

		this.context ??= new AudioContext();
		await this.context.resume();

		try {
			this.stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true,
					channelCount: 1,
					sampleRate: this.options.sampleRate,
				},
			});
		} catch (error) {
			if (error instanceof DOMException && ["NotAllowedError", "SecurityError"].includes(error.name)) {
				throw new MicPermissionError();
			}
			throw error;
		}

		await this.context.audioWorklet.addModule(new URL("./pcm-worklet.ts", import.meta.url));
		this.source = this.context.createMediaStreamSource(this.stream);
		this.worklet = new AudioWorkletNode(this.context, "poocho-pcm-processor", {
			processorOptions: { targetSampleRate: this.options.sampleRate },
		});
		this.worklet.port.onmessage = (event: MessageEvent<WorkletMessage>) => this.handleWorkletMessage(event.data);
		this.source.connect(this.worklet);
		this.stream.getTracks().forEach((track) => track.addEventListener("ended", this.handleTrackEnded, { once: true }));
		this.active = true;
	}

	stop(): void {
		this.active = false;
		this.stream?.getTracks().forEach((track) => {
			track.removeEventListener("ended", this.handleTrackEnded);
			track.stop();
		});
		this.source?.disconnect();
		this.worklet?.disconnect();
		if (this.worklet) {
			this.worklet.port.onmessage = null;
		}
		this.stream = null;
		this.source = null;
		this.worklet = null;
		void this.context?.close();
		this.context = null;
	}

	isActive(): boolean {
		return this.active;
	}

	private handleTrackEnded = (): void => {
		this.stop();
		this.options.onEnded?.();
	};

	private handleWorkletMessage(message: WorkletMessage): void {
		if (!this.active) {
			return;
		}
		if (message.type === "chunk") {
			this.options.onChunk(message.chunk);
			return;
		}
		this.options.onLevel(Math.max(0, Math.min(1, message.rms)));
	}
}
