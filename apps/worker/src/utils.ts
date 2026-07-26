import { AwsClient } from "aws4fetch";
import type { Env } from "./types";

const DEFAULT_CORS_HEADERS = {
	"access-control-allow-origin": "*",
	"access-control-allow-methods": "GET,POST,OPTIONS",
	"access-control-allow-headers":
		"Content-Type, X-Filename, Authorization, Upgrade, Sec-WebSocket-Key, Sec-WebSocket-Version, Sec-WebSocket-Protocol",
	"access-control-max-age": "86400",
	"access-control-expose-headers": "Content-Type, Location",
};

export class AppError extends Error {
	constructor(
		message: string,
		public readonly status = 500,
		public readonly details?: unknown,
	) {
		super(message);
		this.name = "AppError";
	}
}

export function corsHeaders(
	request?: Request,
): Record<string, string> {
	const allowHeaders =
		request?.headers.get("access-control-request-headers") ??
		DEFAULT_CORS_HEADERS["access-control-allow-headers"];

	return {
		...DEFAULT_CORS_HEADERS,
		"access-control-allow-headers": allowHeaders,
	};
}

export function json(
	data: unknown,
	status = 200,
	headers?: HeadersInit,
): Response {
	const responseHeaders = new Headers(corsHeaders());
	if (headers) {
		const extraHeaders = new Headers(headers);
		extraHeaders.forEach((value, key) => responseHeaders.set(key, value));
	}
	responseHeaders.set("content-type", "application/json; charset=utf-8");

	return new Response(JSON.stringify(data), {
		status,
		headers: responseHeaders,
	});
}

export function createR2Client(env: Env): AwsClient {
	if (!env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY || !env.R2_ACCOUNT_ID) {
		throw new AppError(
			"R2 signed URL configuration is missing; set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_ACCOUNT_ID",
			500,
		);
	}

	return new AwsClient({
		accessKeyId: env.R2_ACCESS_KEY_ID,
		secretAccessKey: env.R2_SECRET_ACCESS_KEY,
		service: "s3",
		region: "auto",
	});
}

export function handleOptions(request: Request): Response {
	return new Response(null, {
		status: 204,
		headers: corsHeaders(request),
	});
}

export function buildR2ObjectUrl(env: Env, key: string): URL {
	return new URL(
		`https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/poocho/${key}`,
	);
}

export async function presignR2Request(
	env: Env,
	key: string,
	expiresSeconds = 3600,
): Promise<string> {
	const client = createR2Client(env);
	const url = buildR2ObjectUrl(env, key);
	url.searchParams.set("X-Amz-Expires", String(expiresSeconds));

	const signedRequest = await client.sign(url.toString(), {
		method: "GET",
		aws: {
			signQuery: true,
		},
	});

	return signedRequest.url;
}

export async function presignGet(
	env: Env,
	key: string,
	expiresInSeconds = 3600,
): Promise<string> {
	return presignR2Request(env, key, expiresInSeconds);
}

export async function parseJsonBody<T>(request: Request): Promise<T> {
	try {
		return (await request.json()) as T;
	} catch {
		throw new AppError("Invalid JSON body", 400);
	}
}

export async function readJsonFromR2<T>(
	env: Env,
	key: string,
): Promise<T | null> {
	const object = await env.STORAGE.get(key);

	if (!object) {
		return null;
	}

	return (await object.json()) as T;
}

export async function writeJsonToR2(
	env: Env,
	key: string,
	data: unknown,
): Promise<void> {
	await env.STORAGE.put(key, JSON.stringify(data), {
		httpMetadata: {
			contentType: "application/json; charset=utf-8",
		},
	});
}

export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}

	return "Unknown error";
}

export function isAbortError(error: unknown): boolean {
	return (
		error instanceof DOMException && error.name === "AbortError"
	) || (error instanceof Error && error.name === "AbortError");
}

export function throwIfAborted(signal?: AbortSignal): void {
	signal?.throwIfAborted();
}

export async function sleep(
	ms: number,
	signal?: AbortSignal,
): Promise<void> {
	throwIfAborted(signal);

	await new Promise<void>((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			signal?.removeEventListener("abort", onAbort);
			resolve();
		}, ms);

		const onAbort = () => {
			clearTimeout(timeoutId);
			reject(new DOMException("The operation was aborted", "AbortError"));
		};

		signal?.addEventListener("abort", onAbort, { once: true });
	});
}

export async function fetchWithTimeout(
	input: RequestInfo | URL,
	init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
	const { timeoutMs = 25000, signal, ...rest } = init;
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
	const abortSignal = createCombinedSignal(signal ?? undefined, controller.signal);

	try {
		return await fetch(input, {
			...rest,
			signal: abortSignal,
		});
	} finally {
		clearTimeout(timeoutId);
	}
}

function createCombinedSignal(
	primary?: AbortSignal,
	secondary?: AbortSignal,
): AbortSignal | undefined {
	if (!primary) {
		return secondary;
	}

	if (!secondary) {
		return primary;
	}

	if (primary.aborted || secondary.aborted) {
		return AbortSignal.abort();
	}

	const controller = new AbortController();
	const abort = () => controller.abort();
	primary.addEventListener("abort", abort, { once: true });
	secondary.addEventListener("abort", abort, { once: true });
	return controller.signal;
}

export function formatTimestamp(seconds: number): string {
	const safeSeconds = Math.max(0, Math.floor(seconds));
	const minutes = Math.floor(safeSeconds / 60)
		.toString()
		.padStart(2, "0");
	const remainder = (safeSeconds % 60).toString().padStart(2, "0");
	return `${minutes}:${remainder}`;
}

export function sanitizeModelJson(raw: string): string {
	const trimmed = raw.trim();

	if (trimmed.startsWith("```")) {
		return trimmed
			.replace(/^```(?:json)?/i, "")
			.replace(/```$/i, "")
			.trim();
	}

	return trimmed;
}

export function parseModelJson<T>(raw: string): T | null {
	const strictCandidate = sanitizeModelJson(raw);

	try {
		return JSON.parse(strictCandidate) as T;
	} catch {
		const firstBrace = strictCandidate.indexOf("{");
		const lastBrace = strictCandidate.lastIndexOf("}");

		if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
			return null;
		}

		try {
			return JSON.parse(
				strictCandidate.slice(firstBrace, lastBrace + 1),
			) as T;
		} catch {
			return null;
		}
	}
}

export function toErrorResponse(error: unknown): Response {
	if (isAbortError(error)) {
		return json({ error: "Request aborted" }, 499);
	}

	if (error instanceof AppError) {
		return json({
			error: error.message,
			details: error.details ?? null,
		}, error.status);
	}

	console.error(error);

	return json({ error: "Internal server error" }, 500);
}
