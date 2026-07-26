#!/usr/bin/env node

import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import pc from "picocolors";

const TEST_ASSETS_DIR = path.resolve(process.cwd(), "test-assets");
const VIDEO_PATH = path.resolve(TEST_ASSETS_DIR, "sample.mp4");
const AUDIO_PATH = path.resolve(TEST_ASSETS_DIR, "sample-question.wav");
const SILENCE_SECONDS = 3;
const SAMPLE_RATE = 16_000;

async function main(): Promise<void> {
	await mkdir(TEST_ASSETS_DIR, { recursive: true });

	const missing: string[] = [];

	if (!(await exists(VIDEO_PATH))) {
		missing.push("video");
		console.error(pc.red("Missing test video:"));
		console.error(`  ${VIDEO_PATH}`);
		console.error(
			pc.yellow(
				"Download a short (<30s) Creative Commons MP4, such as the Big Buck Bunny trailer, and save it at that path.",
			),
		);
	}

	if (!(await exists(AUDIO_PATH))) {
		missing.push("audio");
		await writeSilentWav(AUDIO_PATH, SILENCE_SECONDS, SAMPLE_RATE);
		console.error(pc.yellow("Generated placeholder audio:"));
		console.error(`  ${AUDIO_PATH}`);
		console.error(
			pc.yellow(
				'Replace it with a real recording saying: "yeh acceleration wala part samajh nahi aaya, dobara samjhao".',
			),
		);
		console.error(
			pc.dim(
				"Keep it as a short WAV file. The smoke test should use real speech, not silence.",
			),
		);
	}

	if (missing.length > 0) {
		process.exitCode = 1;
		return;
	}

	const [videoInfo, audioInfo] = await Promise.all([stat(VIDEO_PATH), stat(AUDIO_PATH)]);
	console.log(pc.green("Test assets ready"));
	console.log(pc.dim(`Video: ${VIDEO_PATH} (${formatBytes(videoInfo.size)})`));
	console.log(pc.dim(`Audio: ${AUDIO_PATH} (${formatBytes(audioInfo.size)})`));
}

async function exists(filePath: string): Promise<boolean> {
	try {
		await stat(filePath);
		return true;
	} catch {
		return false;
	}
}

async function writeSilentWav(
	filePath: string,
	seconds: number,
	sampleRate: number,
): Promise<void> {
	const numChannels = 1;
	const bitsPerSample = 16;
	const bytesPerSample = bitsPerSample / 8;
	const numSamples = seconds * sampleRate;
	const dataSize = numSamples * numChannels * bytesPerSample;
	const buffer = Buffer.alloc(44 + dataSize);

	buffer.write("RIFF", 0);
	buffer.writeUInt32LE(36 + dataSize, 4);
	buffer.write("WAVE", 8);
	buffer.write("fmt ", 12);
	buffer.writeUInt32LE(16, 16);
	buffer.writeUInt16LE(1, 20);
	buffer.writeUInt16LE(numChannels, 22);
	buffer.writeUInt32LE(sampleRate, 24);
	buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28);
	buffer.writeUInt16LE(numChannels * bytesPerSample, 32);
	buffer.writeUInt16LE(bitsPerSample, 34);
	buffer.write("data", 36);
	buffer.writeUInt32LE(dataSize, 40);

	await writeFile(filePath, buffer);
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) {
		return `${bytes} B`;
	}

	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(1)} KB`;
	}

	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

void main();
