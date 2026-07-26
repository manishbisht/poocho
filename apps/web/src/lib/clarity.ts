// Microsoft Clarity behavioral analytics loader.
//
// This injects the official Clarity tag (https://clarity.microsoft.com). It is a
// no-op unless VITE_CLARITY_PROJECT_ID is set, so local/dev builds stay untracked
// until a real project id is configured.

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] };

let initialized = false;

export function initClarity(projectId: string | undefined): void {
	if (!projectId || initialized || typeof document === "undefined") {
		return;
	}
	initialized = true;

	const w = window as typeof window & { clarity?: ClarityFn };

	if (!w.clarity) {
		const queue: ClarityFn = (...args: unknown[]) => {
			(queue.q = queue.q || []).push(args);
		};
		w.clarity = queue;
	}

	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.clarity.ms/tag/${encodeURIComponent(projectId)}`;

	const firstScript = document.getElementsByTagName("script")[0];
	if (firstScript?.parentNode) {
		firstScript.parentNode.insertBefore(script, firstScript);
	} else {
		document.head.appendChild(script);
	}
}
