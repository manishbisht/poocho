import { useEffect, useRef } from "react";
import { getApiBase } from "../lib/api";
import { useVoiceStore } from "../store/voiceStore";

export type PlayerControls = {
	pause: () => void;
	play: () => void;
	seek: (seconds: number) => void;
	mute?: () => void;
	unmute?: () => void;
};

type VideoPlayerProps = {
	videoId: string;
	onPlayerReady?: (controls: PlayerControls) => void;
};

export function VideoPlayer({ videoId, onPlayerReady }: VideoPlayerProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const lastReportedPosition = useRef(Number.NEGATIVE_INFINITY);
	const setPlayer = useVoiceStore((state) => state.setPlayer);
	const setPosition = useVoiceStore((state) => state.setPosition);
	const streamUrl = `${getApiBase()}/stream/${encodeURIComponent(videoId)}`;

	useEffect(() => {
		const video = videoRef.current;
		if (!video) {
			return;
		}
		lastReportedPosition.current = Number.NEGATIVE_INFINITY;

		const controls: PlayerControls = {
			pause: () => video.pause(),
			play: () => {
				void video.play().catch(() => undefined);
			},
			seek: (seconds) => {
				video.currentTime = seconds;
			},
			mute: () => {
				video.muted = true;
			},
			unmute: () => {
				video.muted = false;
			},
		};
		const reportPosition = (force = false) => {
			if (force || Math.abs(video.currentTime - lastReportedPosition.current) >= 1) {
				lastReportedPosition.current = video.currentTime;
				setPosition(video.currentTime);
			}
		};
		const handleTimeUpdate = () => reportPosition();
		const handleSeeked = () => reportPosition(true);
		// Keep the store's isPlaying in sync with the element's real state so the
		// play/pause button always reflects reality (autoplay may be blocked).
		const handlePlay = () => useVoiceStore.getState().setIsPlaying(true);
		const handlePause = () => useVoiceStore.getState().setIsPlaying(false);
		const handleLoadedMetadata = () => {
			if (video.duration && !isNaN(video.duration)) {
				useVoiceStore.getState().setDuration(video.duration);
			}
			// Attempt to start playback once the media is ready. Browsers may
			// reject autoplay with sound; the pause state above stays honest.
			void video.play().catch(() => undefined);
		};
		const handleError = () => {
			if (import.meta.env.DEV) {
				console.error("Video playback failed", video.error);
			}
		};

		setPlayer(controls);
		onPlayerReady?.(controls);
		video.addEventListener("timeupdate", handleTimeUpdate);
		video.addEventListener("seeked", handleSeeked);
		video.addEventListener("play", handlePlay);
		video.addEventListener("pause", handlePause);
		video.addEventListener("loadedmetadata", handleLoadedMetadata);
		video.addEventListener("error", handleError);

		return () => {
			video.removeEventListener("timeupdate", handleTimeUpdate);
			video.removeEventListener("seeked", handleSeeked);
			video.removeEventListener("play", handlePlay);
			video.removeEventListener("pause", handlePause);
			video.removeEventListener("loadedmetadata", handleLoadedMetadata);
			video.removeEventListener("error", handleError);
			setPlayer(null);
		};
	}, [onPlayerReady, setPlayer, setPosition, videoId]);

	return (
		<video
			ref={videoRef}
			src={streamUrl}
			playsInline
			style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", background: "#0A1413", pointerEvents: "none" }}
		/>
	);
}
