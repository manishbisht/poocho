#!/usr/bin/env node

import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { setTimeout as delay } from "node:timers/promises";
import { AwsClient } from "aws4fetch";
import pc from "picocolors";
import WebSocket from "ws";

type StepStatus = "PASS" | "FAIL" | "WARN" | "SKIP";

type TranscriptSegment = {
	start: number;
	end: number;
	text: string;
	language?: string;
};

type ServerMessage =
	| { type: "ready" }
	| { type: "transcript"; text: string; language: string }
	| { type: "jump"; seconds: number }
	| {
			type: "turn_complete";
			turn: {
				answer: string;
				language: string;
				jump_to_seconds: number | null;
				is_in_video: boolean;
				confidence: string;
			};
	  }
	| { type: "interrupted" }
	| { type: "error"; message: string };

type SocketEvent =
	| { kind: "json"; data: ServerMessage }
	| { kind: "binary"; data: Buffer }
	| { kind: "close"; code: number; reason: string }
	| { kind: "error"; error: Error };

type StepResult = {
	name: string;
	status: StepStatus;
	durationMs: number;
	details?: string;
};

class AssertionError extends Error {
	constructor(
		message: string,
		public readonly actual?: unknown,
	) {
		super(message);
		this.name = "AssertionError";
	}
}

class StepFailure extends Error {
	constructor(
		public readonly stepName: string,
		message: string,
		public readonly actual?: unknown,
	) {
		super(message);
		this.name = "StepFailure";
	}
}

class SocketHarness {
	private readonly queue: SocketEvent[] = [];
	private readonly waiters: Array<(event: SocketEvent) => void> = [];

	constructor(private readonly socket: WebSocket) {
		socket.on("message", (data, isBinary) => {
			if (isBinary) {
				this.push({
					kind: "binary",
					data: Buffer.isBuffer(data) ? data : Buffer.from(data as ArrayBuffer),
				});
				return;
			}

			const text = data.toString();
			try {
				this.push({
					kind: "json",
					data: JSON.parse(text) as ServerMessage,
				});
			} catch {
				this.push({
					kind: "error",
					error: new Error(`Server sent invalid JSON: ${text}`),
				});
			}
		});

		socket.on("close", (code, reason) => {
			this.push({
				kind: "close",
				code,
				reason: reason.toString(),
			});
		});

		socket.on("error", (error) => {
			this.push({
				kind: "error",
				error: error instanceof Error ? error : new Error(String(error)),
			});
		});
	}

	sendJson(payload: unknown): void {
		assert(
			this.socket.readyState === WebSocket.OPEN,
			"Expected WebSocket to be open before sending JSON",
			this.socket.readyState,
		);
		this.socket.send(JSON.stringify(payload));
	}

	sendRaw(text: string): void {
		assert(
			this.socket.readyState === WebSocket.OPEN,
			"Expected WebSocket to be open before sending raw text",
			this.socket.readyState,
		);
		this.socket.send(text);
	}

	sendBinary(chunk: Buffer): void {
		assert(
			this.socket.readyState === WebSocket.OPEN,
			"Expected WebSocket to be open before sending binary data",
			this.socket.readyState,
		);
		this.socket.send(chunk, { binary: true });
	}

	isOpen(): boolean {
		return this.socket.readyState === WebSocket.OPEN;
	}

	async nextEvent(timeoutMs: number): Promise<SocketEvent> {
		if (this.queue.length > 0) {
			return this.queue.shift()!;
		}

		return await new Promise<SocketEvent>((resolve, reject) => {
			const timer = setTimeout(() => {
				const index = this.waiters.indexOf(onEvent);
				if (index >= 0) {
					this.waiters.splice(index, 1);
				}
				reject(new AssertionError(`Timed out waiting for socket event after ${timeoutMs}ms`));
			}, timeoutMs);

			const onEvent = (event: SocketEvent) => {
				clearTimeout(timer);
				resolve(event);
			};

			this.waiters.push(onEvent);
		});
	}

	clearQueue(): void {
		this.queue.length = 0;
	}

	close(): void {
		if (
			this.socket.readyState === WebSocket.OPEN ||
			this.socket.readyState === WebSocket.CONNECTING
		) {
			this.socket.close();
		}
	}

	private push(event: SocketEvent): void {
		const waiter = this.waiters.shift();
		if (waiter) {
			waiter(event);
			return;
		}
		this.queue.push(event);
	}
}

const config = {
	httpBase: process.env.POOCHO_URL ?? "http://localhost:8787",
	wsBase: process.env.POOCHO_WS_URL ?? "ws://localhost:8787",
	videoPath: resolveAssetPath(process.env.TEST_VIDEO ?? "./test-assets/sample.mp4"),
	audioPath: resolveAssetPath(
		process.env.TEST_AUDIO ?? "./test-assets/sample-question.wav",
	),
};

const results: StepResult[] = [];
const startedAt = performance.now();

async function main(): Promise<void> {
	logInfo(`Poocho URL: ${config.httpBase}`);
	logInfo(`WebSocket URL: ${config.wsBase}`);
	logInfo(`Video asset: ${config.videoPath}`);
	logInfo(`Audio asset: ${config.audioPath}`);

	let socketHarness: SocketHarness | null = null;

	try {
		await ensureRequiredConfiguration();
		await ensureFile(config.videoPath, "TEST_VIDEO");
		await ensureFile(config.audioPath, "TEST_AUDIO");

		const videoStat = await stat(config.videoPath);
		await runStep("Step 1 — Health", stepHealth);
		const uploadResult = await runStep("Step 2 — Direct Upload Proxy", () =>
			stepDirectUploadProxy(videoStat.size),
		);
		await runStep("Step 3 — Poll for transcription", () =>
			stepPollForReady(uploadResult.videoId),
		);
		await runOptionalStep("Step 4 — Fetch transcript directly from R2", () =>
			stepFetchTranscriptFromR2(uploadResult.videoId),
		);
		await runStep("Step 5 — Video stream redirect", () =>
			stepVideoRedirect(uploadResult.videoId),
		);
		socketHarness = await runStep("Step 6 — Open WebSocket session", () =>
			stepOpenSocket(uploadResult.videoId),
		);
		await runStep("Step 7 — Position update", () =>
			stepPositionUpdate(socketHarness!),
		);
		await runStep("Step 8 — Full turn round-trip", () =>
			stepFullTurn(socketHarness!),
		);
		await runStep("Step 9 — Interruption / barge-in", () =>
			stepInterrupt(socketHarness!),
		);
		await runWarnStep("Step 10 — Bad JSON resilience", () =>
			stepBadJson(socketHarness!),
		);
	} catch (error) {
		if (error instanceof StepFailure) {
			printFailure(error);
		} else {
			printFailure(
				new StepFailure("Fatal", getErrorMessage(error), error),
			);
		}
		if (socketHarness) {
			socketHarness.close();
		}
		printSummary();
		process.exit(1);
	}

	if (socketHarness) {
		socketHarness.close();
	}

	printSummary();
}

async function stepHealth(): Promise<void> {
	const started = performance.now();
	const response = await fetch(new URL("/health", config.httpBase));
	const durationMs = performance.now() - started;

	assert(
		response.ok,
		"Expected Worker health endpoint to return 2xx",
		{ status: response.status, body: await response.text() },
	);

	console.log(pc.dim(`Response time: ${durationMs.toFixed(1)}ms`));
}

async function stepDirectUploadProxy(
	videoSize: number,
): Promise<{ videoId: string; status: string }> {
	const videoBuffer = await readFile(config.videoPath);
	const started = performance.now();
	const response = await fetch(new URL("/upload", config.httpBase), {
		method: "POST",
		headers: {
			"content-type": "video/mp4",
			"content-length": String(videoSize),
			"x-filename": encodeURIComponent(path.basename(config.videoPath)),
		},
		body: videoBuffer,
	});
	const durationMs = performance.now() - started;

	const payload = await expectJson(response, "upload response");
	assert(isUuid(payload.videoId), "Expected upload to return a UUID videoId", payload);
	assert(
		payload.status === "processing",
		"Expected upload to return status=processing",
		payload,
	);

	const mb = videoBuffer.byteLength / (1024 * 1024);
	const seconds = durationMs / 1000;
	console.log(
		pc.dim(
			`Uploaded ${mb.toFixed(2)} MB in ${durationMs.toFixed(1)}ms (${(
				mb / Math.max(seconds, 0.001)
			).toFixed(2)} MB/s)`,
		),
	);

	return {
		videoId: payload.videoId,
		status: payload.status,
	};
}

async function stepPollForReady(videoId: string): Promise<void> {
	const started = performance.now();
	const deadline = started + 3 * 60_000;

	while (performance.now() < deadline) {
		const response = await fetch(new URL(`/video/${videoId}`, config.httpBase));
		const payload = await expectJson(response, "video status response");
		process.stdout.write(pc.dim("."));

		if (payload.status === "ready") {
			process.stdout.write("\n");
			console.log(
				pc.dim(`Transcription ready in ${(performance.now() - started).toFixed(1)}ms`),
			);
			return;
		}

		if (payload.status === "failed") {
			process.stdout.write("\n");
			throw new AssertionError(
				"Expected video status to become ready, but backend marked it failed",
				payload,
			);
		}

		await delay(5_000);
	}

	process.stdout.write("\n");
	throw new AssertionError("Timed out waiting for transcription to become ready");
}

async function stepFetchTranscriptFromR2(videoId: string): Promise<void> {
	const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ACCOUNT_ID } = process.env;

	if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ACCOUNT_ID) {
		throw new SkipStep(
			"R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, or R2_ACCOUNT_ID is missing",
		);
	}

	const client = new AwsClient({
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY,
		service: "s3",
		region: "auto",
	});

	const key = `videos/${videoId}/transcript.json`;
	const url = new URL(
		`https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/poocho/${key}`,
	);
	url.searchParams.set("X-Amz-Expires", "300");
	const signedRequest = await client.sign(url.toString(), {
		method: "GET",
		aws: {
			signQuery: true,
		},
	});

	const response = await fetch(signedRequest);
	const payload = (await expectJson(response, "R2 transcript fetch")) as TranscriptSegment[];
	assert(Array.isArray(payload), "Expected transcript payload to be an array", payload);
	console.log(pc.dim(`Transcript segments: ${payload.length}`));
}

async function stepVideoRedirect(videoId: string): Promise<void> {
	const response = await fetch(new URL(`/stream/${videoId}`, config.httpBase), {
		redirect: "manual",
	});

	assert(
		response.status === 302,
		"Expected /stream/:id to return a 302 redirect",
		{ status: response.status, headers: Object.fromEntries(response.headers.entries()) },
	);

	const location = response.headers.get("location");
	assert(
		typeof location === "string" &&
			/\.r2\.cloudflarestorage\.com/i.test(location),
		"Expected redirect Location header to point at R2",
		location,
	);

	console.log(pc.dim(`Redirect: ${location}`));
}

async function stepOpenSocket(videoId: string): Promise<SocketHarness> {
	const socket = new WebSocket(`${config.wsBase}/session/${videoId}`);

	await new Promise<void>((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(new AssertionError("Timed out opening WebSocket after 5000ms"));
		}, 5000);

		socket.once("open", () => {
			clearTimeout(timer);
			resolve();
		});

		socket.once("error", (error) => {
			clearTimeout(timer);
			reject(error);
		});
	});

	const harness = new SocketHarness(socket);
	harness.sendJson({ type: "init", videoId });
	const event = await harness.nextEvent(5000);

	assert(event.kind === "json", "Expected a JSON ready message after init", event);
	assert(
		event.data.type === "ready",
		"Expected WebSocket init to return { type: 'ready' }",
		event.data,
	);

	return harness;
}

async function stepPositionUpdate(harness: SocketHarness): Promise<void> {
	harness.clearQueue();
	harness.sendJson({ type: "position", seconds: 10 });
	await delay(250);
	assert(harness.isOpen(), "Expected WebSocket to remain open after position update");
}

async function stepFullTurn(harness: SocketHarness): Promise<void> {
	harness.clearQueue();
	const audio = await readFile(config.audioPath);
	const endTurnSentAt = await sendTurnAudio(harness, audio);

	let transcriptAt: number | null = null;
	let firstAudioAt: number | null = null;
	let turnCompleteAt: number | null = null;
	let transcriptText = "";
	let jumpSeconds: number | null = null;
	let finalAnswer = "";
	let ttsBytes = 0;

	const deadline = performance.now() + 30_000;

	while (performance.now() < deadline) {
		const event = await harness.nextEvent(Math.max(1, deadline - performance.now()));

		if (event.kind === "close") {
			throw new AssertionError("WebSocket closed during full turn", event);
		}

		if (event.kind === "error") {
			throw event.error;
		}

		if (event.kind === "binary") {
			ttsBytes += event.data.byteLength;
			firstAudioAt ??= performance.now();
			continue;
		}

		switch (event.data.type) {
			case "transcript":
				transcriptAt ??= performance.now();
				transcriptText = event.data.text;
				assert(
					event.data.text.trim().length > 0,
					"Expected transcript text to be non-empty",
					event.data,
				);
				break;
			case "jump":
				jumpSeconds = event.data.seconds;
				break;
			case "turn_complete":
				turnCompleteAt = performance.now();
				finalAnswer = event.data.turn.answer;
				assert(
					finalAnswer.trim().length > 0,
					"Expected final turn answer to be non-empty",
					event.data.turn,
				);
				assert(
					ttsBytes > 0,
					"Expected at least one binary TTS frame before turn_complete",
					{ ttsBytes },
				);
				assert(
					transcriptText.trim().length > 0,
					"Expected transcript event before turn_complete",
					event.data,
				);
				printTurnMetrics({
					transcriptText,
					finalAnswer,
					jumpSeconds,
					ttsBytes,
					endTurnSentAt,
					transcriptAt,
					firstAudioAt,
					turnCompleteAt,
				});
				return;
			case "error":
				throw new AssertionError("Server returned a WebSocket error during full turn", event.data);
			case "interrupted":
				throw new AssertionError("Received interrupted during full turn unexpectedly", event.data);
			case "ready":
				break;
		}
	}

	throw new AssertionError("Timed out waiting for turn_complete after 30000ms");
}

async function stepInterrupt(harness: SocketHarness): Promise<void> {
	harness.clearQueue();
	const audio = await readFile(config.audioPath);
	await sendTurnAudio(harness, audio);

	let firstAudioSeen = false;
	let interruptedSeen = false;
	let interruptDeadline = 0;
	const deadline = performance.now() + 30_000;

	while (performance.now() < deadline) {
		const event = await harness.nextEvent(Math.max(1, deadline - performance.now()));

		if (event.kind === "close") {
			throw new AssertionError("WebSocket closed during interruption test", event);
		}

		if (event.kind === "error") {
			throw event.error;
		}

		if (event.kind === "binary") {
			if (!firstAudioSeen) {
				firstAudioSeen = true;
				harness.sendJson({ type: "interrupt" });
				interruptDeadline = performance.now() + 2_000;
				continue;
			}
			throw new AssertionError(
				"Expected no further audio bytes after interrupt",
				{ bytes: event.data.byteLength },
			);
		}

		if (event.data.type === "interrupted") {
			assert(
				performance.now() <= interruptDeadline,
				"Expected interruption acknowledgement within 2000ms",
				{ elapsedMs: performance.now() - (interruptDeadline - 2_000) },
			);
			interruptedSeen = true;
			break;
		}

		if (event.data.type === "error") {
			throw new AssertionError("Server returned a WebSocket error during interruption test", event.data);
		}
	}

	assert(firstAudioSeen, "Expected to receive at least one audio frame before interrupt");
	assert(interruptedSeen, "Expected server to confirm interruption within 30 seconds");

	const quietDeadline = performance.now() + 2_000;
	while (performance.now() < quietDeadline) {
		try {
			const event = await harness.nextEvent(250);
			if (event.kind === "binary") {
				throw new AssertionError("Received extra audio after interruption", {
					bytes: event.data.byteLength,
				});
			}
			if (event.kind === "json" && event.data.type === "turn_complete") {
				throw new AssertionError(
					"Received turn_complete after interruption; expected cancellation",
					event.data,
				);
			}
		} catch (error) {
			if (error instanceof AssertionError && /Timed out waiting/.test(error.message)) {
				return;
			}
			throw error;
		}
	}
}

async function stepBadJson(harness: SocketHarness): Promise<void> {
	harness.clearQueue();
	harness.sendRaw("this is not valid json");
	await delay(500);
	assert(
		harness.isOpen(),
		"Expected WebSocket to stay open after malformed JSON",
	);
}

async function sendTurnAudio(harness: SocketHarness, audio: Buffer): Promise<number> {
	harness.sendJson({ type: "start_turn" });

	for (let offset = 0; offset < audio.byteLength; offset += 8 * 1024) {
		harness.sendBinary(audio.subarray(offset, offset + 8 * 1024));
		await delay(50);
	}

	harness.sendJson({ type: "end_turn" });
	return performance.now();
}

function printTurnMetrics(input: {
	transcriptText: string;
	finalAnswer: string;
	jumpSeconds: number | null;
	ttsBytes: number;
	endTurnSentAt: number;
	transcriptAt: number | null;
	firstAudioAt: number | null;
	turnCompleteAt: number | null;
}): void {
	assert(input.transcriptAt !== null, "Expected transcript timestamp to be captured");
	assert(input.firstAudioAt !== null, "Expected first audio timestamp to be captured");
	assert(input.turnCompleteAt !== null, "Expected turn_complete timestamp to be captured");

	console.log(pc.dim(`Transcript: ${input.transcriptText}`));
	console.log(pc.dim(`Answer: ${input.finalAnswer}`));
	console.log(pc.dim(`Jump target: ${input.jumpSeconds ?? "none"}`));
	console.log(pc.dim(`TTS bytes: ${input.ttsBytes}`));
	console.log(
		pc.dim(
			`Latency mic-release → transcript: ${(input.transcriptAt - input.endTurnSentAt).toFixed(1)}ms`,
		),
	);
	console.log(
		pc.dim(
			`Latency transcript → first audio byte: ${(input.firstAudioAt - input.transcriptAt).toFixed(1)}ms`,
		),
	);
	console.log(
		pc.dim(
			`Latency first audio byte → turn_complete: ${(input.turnCompleteAt - input.firstAudioAt).toFixed(1)}ms`,
		),
	);
	console.log(
		pc.dim(
			`Total round-trip: ${(input.turnCompleteAt - input.endTurnSentAt).toFixed(1)}ms`,
		),
	);
}

async function runStep<T>(name: string, fn: () => Promise<T>): Promise<T> {
	printHeading(name);
	const started = performance.now();

	try {
		const value = await fn();
		const durationMs = performance.now() - started;
		results.push({ name, status: "PASS", durationMs });
		console.log(pc.green(`PASS ${name} (${durationMs.toFixed(1)}ms)`));
		return value;
	} catch (error) {
		const durationMs = performance.now() - started;
		results.push({
			name,
			status: "FAIL",
			durationMs,
			details: getErrorMessage(error),
		});
		throw new StepFailure(name, getErrorMessage(error), extractActual(error));
	}
}

async function runOptionalStep(name: string, fn: () => Promise<void>): Promise<void> {
	printHeading(name);
	const started = performance.now();

	try {
		await fn();
		const durationMs = performance.now() - started;
		results.push({ name, status: "PASS", durationMs });
		console.log(pc.green(`PASS ${name} (${durationMs.toFixed(1)}ms)`));
	} catch (error) {
		const durationMs = performance.now() - started;
		if (error instanceof SkipStep) {
			results.push({ name, status: "SKIP", durationMs, details: error.message });
			console.log(pc.yellow(`SKIP ${name}: ${error.message}`));
			return;
		}
		results.push({
			name,
			status: "FAIL",
			durationMs,
			details: getErrorMessage(error),
		});
		throw new StepFailure(name, getErrorMessage(error), extractActual(error));
	}
}

async function runWarnStep(name: string, fn: () => Promise<void>): Promise<void> {
	printHeading(name);
	const started = performance.now();

	try {
		await fn();
		const durationMs = performance.now() - started;
		results.push({ name, status: "PASS", durationMs });
		console.log(pc.green(`PASS ${name} (${durationMs.toFixed(1)}ms)`));
	} catch (error) {
		const durationMs = performance.now() - started;
		results.push({
			name,
			status: "WARN",
			durationMs,
			details: getErrorMessage(error),
		});
		console.log(pc.yellow(`WARN ${name}: ${getErrorMessage(error)}`));
	}
}

class SkipStep extends Error {}

function printHeading(title: string): void {
	console.log("");
	console.log(pc.cyan(title));
}

function printFailure(error: StepFailure): void {
	console.error("");
	console.error(pc.red(`FAIL ${error.stepName}`));
	console.error(pc.red(error.message));
	if (error.actual !== undefined) {
		console.error(pc.dim(`Received: ${safeStringify(error.actual)}`));
	}
}

function printSummary(): void {
	console.log("");
	console.log(pc.bold("Summary"));

	const nameWidth = Math.max(...results.map((result) => result.name.length), 10);
	const statusWidth = 6;

	console.log(
		`${"Step".padEnd(nameWidth)}  ${"Status".padEnd(statusWidth)}  Duration   Details`,
	);
	console.log(
		`${"-".repeat(nameWidth)}  ${"-".repeat(statusWidth)}  --------   -------`,
	);

	for (const result of results) {
		const statusText = colorStatus(result.status).padEnd(statusWidth + 10);
		const durationText = `${result.durationMs.toFixed(1)}ms`.padEnd(10);
		console.log(
			`${result.name.padEnd(nameWidth)}  ${statusText}  ${durationText} ${result.details ?? ""}`,
		);
	}

	console.log("");
	console.log(pc.bold(`Total elapsed: ${(performance.now() - startedAt).toFixed(1)}ms`));
}

function colorStatus(status: StepStatus): string {
	switch (status) {
		case "PASS":
			return pc.green(status);
		case "FAIL":
			return pc.red(status);
		case "WARN":
			return pc.yellow(status);
		case "SKIP":
			return pc.dim(status);
	}
}

async function expectJson(response: Response, label: string): Promise<any> {
	assert(
		response.ok,
		`Expected ${label} to return 2xx`,
		{ status: response.status, body: await response.text() },
	);

	try {
		return await response.json();
	} catch (error) {
		throw new AssertionError(`Expected ${label} to return JSON`, getErrorMessage(error));
	}
}

function assert(
	condition: unknown,
	message: string,
	actual?: unknown,
): asserts condition {
	if (!condition) {
		throw new AssertionError(message, actual);
	}
}

function isUuid(value: unknown): value is string {
	return (
		typeof value === "string" &&
		/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
			value,
		)
	);
}

async function ensureFile(filePath: string, envName: string): Promise<void> {
	try {
		await stat(filePath);
	} catch {
		throw new StepFailure(
			"Bootstrap",
			`Expected ${envName} file to exist at ${filePath}. Run npm run prepare:test-assets first.`,
		);
	}
}

async function ensureRequiredConfiguration(): Promise<void> {
	const missing = ["SARVAM_API_KEY", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_ACCOUNT_ID"].filter(
		(name) => !process.env[name],
	);
	const devVars = await readDevVars();
	const unresolved = missing.filter((name) => !devVars.has(name));

	if (unresolved.length > 0) {
		throw new StepFailure(
			"Bootstrap",
			`Missing Worker environment variable(s): ${unresolved.join(", ")}. Set them in .dev.vars or export them before starting wrangler dev.`,
		);
	}
}

async function readDevVars(): Promise<Set<string>> {
	try {
		const contents = await readFile(path.resolve(process.cwd(), ".dev.vars"), "utf8");
		return new Set(
			contents
				.split("\n")
				.map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*.+$/)?.[1])
				.filter((name): name is string => Boolean(name)),
		);
	} catch {
		return new Set();
	}
}

function resolveAssetPath(input: string): string {
	return path.resolve(process.cwd(), input);
}

function logInfo(message: string): void {
	console.log(pc.dim(message));
}

function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	return String(error);
}

function extractActual(error: unknown): unknown {
	if (error instanceof AssertionError) {
		return error.actual;
	}
	if (error instanceof StepFailure) {
		return error.actual;
	}
	return undefined;
}

function safeStringify(value: unknown): string {
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}

void main();
