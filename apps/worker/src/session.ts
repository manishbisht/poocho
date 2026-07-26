import { DurableObject } from "cloudflare:workers";
import { runPipeline } from "./pipeline";
import type { ClientMessage, Env, ServerMessage, Session, SessionAttachment, TranscriptSegment } from "./types";
import { AppError, getErrorMessage, readJsonFromR2 } from "./utils";

function transcriptKey(videoId: string): string {
	return `videos/${videoId}/transcript.json`;
}

export class PoochoSession extends DurableObject<Env> {
	private session: Session = {
		videoId: "",
		transcript: [],
		playbackPosition: 0,
		currentLanguage: "hi-en",
		history: [],
		currentTurnBuffer: [],
	};

	private readonly restorePromise: Promise<void>;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.restorePromise = ctx.blockConcurrencyWhile(async () => {
			await this.restoreFromAttachment();
		});
	}

	async fetch(request: Request): Promise<Response> {
		await this.restorePromise;

		if (request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
			throw new AppError("Expected WebSocket upgrade", 426);
		}

		const url = new URL(request.url);
		const videoId = url.searchParams.get("videoId") ?? this.session.videoId;
		if (!videoId) {
			throw new AppError("Missing videoId", 400);
		}

		const pair = new WebSocketPair();
		const [client, server] = Object.values(pair);
		this.ctx.acceptWebSocket(server);

		this.session.videoId = videoId;
		server.serializeAttachment(this.toAttachment());

		return new Response(null, {
			status: 101,
			webSocket: client,
		});
	}

	async webSocketMessage(
		ws: WebSocket,
		message: string | ArrayBuffer,
	): Promise<void> {
		await this.restorePromise;

		if (typeof message === "string") {
			let clientMessage: ClientMessage;

			try {
				clientMessage = JSON.parse(message) as ClientMessage;
			} catch {
				this.send(ws, {
					type: "error",
					message: "Invalid WebSocket JSON message",
				});
				return;
			}

			await this.handleClientMessage(ws, clientMessage);
			return;
		}

		this.session.currentTurnBuffer.push(new Uint8Array(message));
	}

	webSocketClose(ws: WebSocket, code: number, reason: string): void {
		console.log("PoochoSession closed", { code, reason });
		this.cleanup();
		if (ws.readyState === WebSocket.OPEN) {
			ws.close(code, reason);
		}
	}

	webSocketError(_ws: WebSocket, error: unknown): void {
		console.error("PoochoSession websocket error", getErrorMessage(error));
		this.cleanup();
	}

	private async handleClientMessage(
		ws: WebSocket,
		message: ClientMessage,
	): Promise<void> {
		switch (message.type) {
			case "init": {
				this.session.videoId = message.videoId;
				this.session.transcript = await this.loadTranscript(message.videoId);
				ws.serializeAttachment(this.toAttachment());
				this.send(ws, { type: "ready" });
				return;
			}
			case "position": {
				this.session.playbackPosition = message.seconds;
				ws.serializeAttachment(this.toAttachment());
				return;
			}
			case "start_turn": {
				this.session.abortController?.abort();
				this.session.currentTurnBuffer = [];
				this.session.abortController = new AbortController();
				return;
			}
			case "end_turn": {
				if (!this.session.abortController) {
					this.session.abortController = new AbortController();
				}

				if (this.session.currentTurnBuffer.length === 0) {
					this.send(ws, {
						type: "error",
						message: "No audio received for this turn",
					});
					return;
				}

				// If Sarvam's real-time Conversations API becomes stable for Workers,
				// it should replace this stitched Saaras → 105B → Bulbul path here.
				await runPipeline(ws, this.session, this.env);
				ws.serializeAttachment(this.toAttachment());
				return;
			}
			case "interrupt": {
				this.session.abortController?.abort();
				this.send(ws, { type: "interrupted" });
				return;
			}
		}
	}

	private async restoreFromAttachment(): Promise<void> {
		const [socket] = this.ctx.getWebSockets();

		if (!socket) {
			return;
		}

		const attachment = socket.deserializeAttachment() as SessionAttachment | null;
		if (!attachment) {
			return;
		}

		this.session = {
			...this.session,
			videoId: attachment.videoId,
			playbackPosition: attachment.playbackPosition,
			currentLanguage: attachment.currentLanguage,
			history: attachment.history,
		};

		if (attachment.videoId) {
			this.session.transcript = await this.loadTranscript(attachment.videoId);
		}
	}

	private async loadTranscript(videoId: string): Promise<TranscriptSegment[]> {
		const transcript = await readJsonFromR2<TranscriptSegment[]>(
			this.env,
			transcriptKey(videoId),
		);

		if (!transcript) {
			throw new AppError("Transcript not ready for video", 404);
		}

		return transcript;
	}

	private toAttachment(): SessionAttachment {
		return {
			videoId: this.session.videoId,
			playbackPosition: this.session.playbackPosition,
			currentLanguage: this.session.currentLanguage,
			history: this.session.history,
		};
	}

	private cleanup(): void {
		this.session.abortController?.abort();
		this.session.abortController = undefined;
		this.session.currentTurnBuffer = [];
	}

	private send(ws: WebSocket, message: ServerMessage): void {
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify(message));
		}
	}
}
