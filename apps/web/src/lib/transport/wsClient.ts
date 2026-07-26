import type { ClientMessage, ServerMessage } from "../../types/protocol";

type SocketState = "idle" | "connecting" | "open" | "closed";
type SocketEventType = ServerMessage["type"] | "audio" | "close";
type SocketEventDetail = ServerMessage | ArrayBuffer | CloseEvent | Error;

class PoochoSocketEvent<T> extends Event {
	readonly detail: T;

	constructor(type: SocketEventType, detail: T) {
		super(type);
		this.detail = detail;
	}
}

export class PoochoSocket extends EventTarget {
	private readonly url: string;
	private readonly videoId: string;
	private socket: WebSocket | null = null;
	private readonly pending: Array<ClientMessage | ArrayBuffer> = [];
	private manuallyClosed = false;
	private reconnectAttempts = 0;
	private connectPromise: Promise<void> | null = null;
	private resolveConnect: (() => void) | null = null;
	private rejectConnect: ((reason: Error) => void) | null = null;
	private reconnectTimer: number | null = null;
	private state: SocketState = "idle";

	constructor(url: string, videoId: string) {
		super();
		this.url = url;
		this.videoId = videoId;
	}

	get readyState(): SocketState {
		return this.state;
	}

	connect(): Promise<void> {
		if (this.state === "open") {
			return Promise.resolve();
		}
		if (this.connectPromise) {
			return this.connectPromise;
		}
		this.manuallyClosed = false;
		this.connectPromise = new Promise<void>((resolve, reject) => {
			this.resolveConnect = resolve;
			this.rejectConnect = reject;
			this.open();
		});
		return this.connectPromise;
	}

	send(message: ClientMessage): void {
		this.sendOrQueue(message);
	}

	sendBinary(chunk: ArrayBuffer): void {
		this.sendOrQueue(chunk);
	}

	close(): void {
		this.manuallyClosed = true;
		this.state = "closed";
		if (this.reconnectTimer !== null) {
			window.clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}
		this.socket?.close();
		this.socket = null;
		this.pending.length = 0;
		this.connectPromise = null;
	}

	on<T extends SocketEventDetail>(type: SocketEventType, listener: (detail: T) => void): () => void {
		const handler = (event: Event) => listener((event as PoochoSocketEvent<T>).detail);
		this.addEventListener(type, handler);
		return () => this.removeEventListener(type, handler);
	}

	private open(): void {
		this.state = "connecting";
		try {
			this.socket = new WebSocket(`${this.url.replace(/\/$/, "")}/session/${encodeURIComponent(this.videoId)}`);
			this.socket.binaryType = "arraybuffer";
			this.socket.addEventListener("open", this.handleOpen);
			this.socket.addEventListener("message", this.handleMessage);
			this.socket.addEventListener("error", this.handleError);
			this.socket.addEventListener("close", this.handleClose);
		} catch (error) {
			this.handleFailure(error);
		}
	}

	private handleOpen = (): void => {
		try {
			this.socket?.send(JSON.stringify({ type: "init", videoId: this.videoId } satisfies ClientMessage));
		} catch (error) {
			this.emit("error", this.toError(error));
		}
	};

	private handleMessage = (event: MessageEvent<string | ArrayBuffer>): void => {
		try {
			if (event.data instanceof ArrayBuffer) {
				this.emit("audio", event.data);
				return;
			}
			const message = JSON.parse(event.data) as ServerMessage;
			if (message.type === "ready") {
				this.state = "open";
				this.reconnectAttempts = 0;
				this.resolveConnect?.();
				this.clearConnectPromise();
				this.flush();
			}
			this.emit(message.type, message);
		} catch (error) {
			this.emit("error", this.toError(error));
		}
	};

	private handleError = (): void => {
		this.emit("error", new Error("WebSocket transport error"));
	};

	private handleClose = (event: CloseEvent): void => {
		this.socket = null;
		this.emit("close", event);
		if (this.manuallyClosed) {
			return;
		}
		this.scheduleReconnect();
	};

	private scheduleReconnect(): void {
		if (this.reconnectAttempts >= 5) {
			this.state = "closed";
			this.handleFailure(new Error("WebSocket reconnection failed after 5 attempts"));
			return;
		}
		const delay = Math.min(500 * 2 ** this.reconnectAttempts, 4_000);
		this.reconnectAttempts += 1;
		this.state = "connecting";
		this.reconnectTimer = window.setTimeout(() => {
			this.reconnectTimer = null;
			this.open();
		}, delay);
	}

	private sendOrQueue(payload: ClientMessage | ArrayBuffer): void {
		if (this.state !== "open" || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
			this.pending.push(payload);
			return;
		}
		try {
			this.socket.send(payload instanceof ArrayBuffer ? payload : JSON.stringify(payload));
		} catch (error) {
			this.emit("error", this.toError(error));
		}
	}

	private flush(): void {
		const queued = this.pending.splice(0);
		queued.forEach((message) => this.sendOrQueue(message));
	}

	private handleFailure(error: unknown): void {
		const normalized = this.toError(error);
		this.emit("error", normalized);
		this.rejectConnect?.(normalized);
		this.clearConnectPromise();
	}

	private clearConnectPromise(): void {
		this.connectPromise = null;
		this.resolveConnect = null;
		this.rejectConnect = null;
	}

	private emit(type: SocketEventType, detail: SocketEventDetail): void {
		this.dispatchEvent(new PoochoSocketEvent(type, detail));
	}

	private toError(error: unknown): Error {
		return error instanceof Error ? error : new Error(String(error));
	}
}
