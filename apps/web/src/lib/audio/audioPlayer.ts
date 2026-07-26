export class StreamingAudioPlayer {
	private context: AudioContext | null = null;
	private readonly sources = new Set<AudioBufferSourceNode>();
	private endedCallback: (() => void) | null = null;
	private nextStartTime = 0;
	private sampleRate: number;
	private bitDepth = 16;
	private generation = 0;
	private leftover: Uint8Array | null = null;

	constructor(sampleRate = 22_050) {
		this.sampleRate = sampleRate;
	}

	async resume(): Promise<void> {
		this.context ??= new AudioContext();
		if (this.context.state === "suspended") {
			await this.context.resume();
		}
	}

	enqueue(chunk: ArrayBuffer): void {
		if (this.bitDepth !== 16) {
			return;
		}

		let bytes = new Uint8Array(chunk);
		if (this.leftover && this.leftover.length > 0) {
			const combined = new Uint8Array(this.leftover.length + bytes.length);
			combined.set(this.leftover, 0);
			combined.set(bytes, this.leftover.length);
			bytes = combined;
			this.leftover = null;
		}

		if (bytes.length % 2 !== 0) {
			this.leftover = bytes.slice(bytes.length - 1);
			bytes = bytes.slice(0, bytes.length - 1);
		}

		if (bytes.length === 0) {
			return;
		}

		this.context ??= new AudioContext();
		void this.context.resume();

		const samples = new Int16Array(bytes.buffer, bytes.byteOffset, bytes.length / 2);
		const audioBuffer = this.context.createBuffer(1, samples.length, this.sampleRate);
		const channel = audioBuffer.getChannelData(0);
		for (let index = 0; index < samples.length; index += 1) {
			channel[index] = samples[index] / 0x8000;
		}

		const source = this.context.createBufferSource();
		source.buffer = audioBuffer;
		const gainNode = this.context.createGain();
		gainNode.gain.value = 2.5;
		source.connect(gainNode);
		gainNode.connect(this.context.destination);
		const isFirstChunk = this.sources.size === 0;
		const startAt = Math.max(
			this.nextStartTime,
			this.context.currentTime + (isFirstChunk ? 0.25 : 0.05)
		);
		this.nextStartTime = startAt + audioBuffer.duration;
		const generation = this.generation;
		this.sources.add(source);
		source.onended = () => {
			this.sources.delete(source);
			if (generation === this.generation && this.sources.size === 0) {
				this.nextStartTime = this.context?.currentTime ?? 0;
				this.endedCallback?.();
			}
		};
		source.start(startAt);
	}

	stop(): void {
		this.generation += 1;
		for (const source of this.sources) {
			source.onended = null;
			source.stop();
		}
		this.sources.clear();
		this.nextStartTime = this.context?.currentTime ?? 0;
		this.leftover = null;
	}

	isPlaying(): boolean {
		return this.sources.size > 0;
	}

	onEnded(callback: () => void): void {
		this.endedCallback = callback;
	}

	setFormat(sampleRate: number, bitDepth: number): void {
		this.stop();
		this.sampleRate = sampleRate;
		this.bitDepth = bitDepth;
	}

	destroy(): void {
		this.stop();
		void this.context?.close();
		this.context = null;
		this.endedCallback = null;
	}
}
