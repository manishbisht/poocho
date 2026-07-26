declare abstract class AudioWorkletProcessor {
	readonly port: MessagePort;
	constructor(options?: AudioWorkletNodeOptions);
	abstract process(inputs: Float32Array[][]): boolean;
}

declare const sampleRate: number;
declare function registerProcessor(name: string, processor: typeof AudioWorkletProcessor): void;

class PcmWorkletProcessor extends AudioWorkletProcessor {
	private readonly targetSampleRate: number;
	private readonly chunkSamples: number;
	private readonly pcmSamples: number[] = [];
	private levelSamples = 0;
	private levelSumSquares = 0;

	constructor(options: AudioWorkletNodeOptions) {
		super();
		const processorOptions = options.processorOptions as { targetSampleRate?: number } | undefined;
		this.targetSampleRate = processorOptions?.targetSampleRate ?? 16_000;
		this.chunkSamples = Math.round(this.targetSampleRate * 0.2);
	}

	process(inputs: Float32Array[][]): boolean {
		const input = inputs[0]?.[0];
		if (!input || input.length === 0) {
			return true;
		}

		this.measureLevel(input);
		const downsampled = this.downsample(input);
		for (const sample of downsampled) {
			this.pcmSamples.push(Math.max(-1, Math.min(1, sample)) * 0x7fff);
		}

		while (this.pcmSamples.length >= this.chunkSamples) {
			const samples = this.pcmSamples.splice(0, this.chunkSamples);
			const chunk = new Int16Array(samples.length);
			for (let index = 0; index < samples.length; index += 1) {
				chunk[index] = samples[index];
			}
			this.port.postMessage({ type: "chunk", chunk: chunk.buffer }, [chunk.buffer]);
		}

		return true;
	}

	private downsample(input: Float32Array): Float32Array {
		if (sampleRate === this.targetSampleRate) {
			return input;
		}

		const outputLength = Math.max(1, Math.round(input.length * this.targetSampleRate / sampleRate));
		const output = new Float32Array(outputLength);
		const ratio = sampleRate / this.targetSampleRate;

		for (let outputIndex = 0; outputIndex < outputLength; outputIndex += 1) {
			const inputPosition = outputIndex * ratio;
			const before = Math.floor(inputPosition);
			const after = Math.min(before + 1, input.length - 1);
			const fraction = inputPosition - before;
			output[outputIndex] = input[before] * (1 - fraction) + input[after] * fraction;
		}

		return output;
	}

	private measureLevel(input: Float32Array): void {
		for (const sample of input) {
			this.levelSumSquares += sample * sample;
		}
		this.levelSamples += input.length;

		if (this.levelSamples >= sampleRate * 0.05) {
			this.port.postMessage({ type: "level", rms: Math.sqrt(this.levelSumSquares / this.levelSamples) });
			this.levelSamples = 0;
			this.levelSumSquares = 0;
		}
	}
}

registerProcessor("poocho-pcm-processor", PcmWorkletProcessor);
