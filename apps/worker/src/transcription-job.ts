import { DurableObject } from "cloudflare:workers";
import { processVideo } from "./upload";
import type { Env } from "./types";
import { AppError, json } from "./utils";

const VIDEO_ID_STORAGE_KEY = "videoId";

export class TranscriptionJob extends DurableObject<Env> {
	async fetch(request: Request): Promise<Response> {
		if (request.method !== "POST") {
			throw new AppError("Method not allowed", 405);
		}

		const payload = (await request.json()) as { videoId?: unknown };
		if (typeof payload.videoId !== "string" || payload.videoId.length === 0) {
			throw new AppError("videoId is required", 400);
		}

		await this.ctx.storage.put(VIDEO_ID_STORAGE_KEY, payload.videoId);
		await this.ctx.storage.setAlarm(Date.now());

		return json({ status: "queued" });
	}

	async alarm(): Promise<void> {
		const videoId = await this.ctx.storage.get<string>(VIDEO_ID_STORAGE_KEY);
		if (!videoId) {
			return;
		}

		await processVideo(videoId, this.env);
	}
}
