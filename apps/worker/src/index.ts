import { PoochoSession } from "./session";
import { TranscriptionJob } from "./transcription-job";
import type { Env } from "./types";
import { handleOptions, json, toErrorResponse } from "./utils";
import {
	getVideoStatus,
	streamVideo,
	uploadVideo,
} from "./upload";

export { PoochoSession, TranscriptionJob };

export default {
	async fetch(request, env, ctx): Promise<Response> {
		try {
			return await routeRequest(request, env, ctx);
		} catch (error) {
			return toErrorResponse(error);
		}
	},
} satisfies ExportedHandler<Env>;

async function routeRequest(
	request: Request,
	env: Env,
	ctx: ExecutionContext,
): Promise<Response> {
	const url = new URL(request.url);

	if (request.method === "OPTIONS") {
		return handleOptions(request);
	}

	if (request.method === "GET" && url.pathname === "/health") {
		return json({ name: "poocho", status: "ok" });
	}

	if (request.method === "POST" && url.pathname === "/upload") {
		return uploadVideo(request, env);
	}

	if (request.method === "GET" && url.pathname.startsWith("/video/")) {
		const videoId = url.pathname.slice("/video/".length);
		return getVideoStatus(videoId, env);
	}

	if (request.method === "GET" && url.pathname.startsWith("/stream/")) {
		const videoId = url.pathname.slice("/stream/".length);
		return streamVideo(request, videoId, env);
	}

	if (request.method === "GET" && url.pathname.startsWith("/session/")) {
		const videoId = url.pathname.slice("/session/".length);
		return handleSessionUpgrade(request, env, videoId);
	}

	return json(
		{
			error: "Not found",
			path: url.pathname,
		},
		404,
	);
}

async function handleSessionUpgrade(
	request: Request,
	env: Env,
	videoId: string,
): Promise<Response> {
	if (!videoId) {
		return json({ error: "Missing video id" }, 400);
	}

	const sessionName = `${videoId}:${crypto.randomUUID()}`;
	const durableObjectId = env.SESSION.idFromName(sessionName);
	const stub = env.SESSION.get(durableObjectId);
	const url = new URL(request.url);
	url.searchParams.set("videoId", videoId);

	return stub.fetch(new Request(url.toString(), request));
}
