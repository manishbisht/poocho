export function getApiBase(): string {
	const wsUrl = import.meta.env.VITE_WS_URL || "wss://poocho.manishbisht.workers.dev";
	return wsUrl.replace(/^ws:/, "http:").replace(/^wss:/, "https:").replace(/\/$/, "");
}
