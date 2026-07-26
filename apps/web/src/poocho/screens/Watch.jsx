import React from 'react';
import TopBar from '../TopBar.jsx';
import { Badge, Button } from '../ds.js';
import VideoStage from './VideoStage.jsx';
import ChatSidebar from './ChatSidebar.jsx';
import { useVoiceLoop } from '../../hooks/useVoiceLoop.ts';
import { useVoiceStore } from '../../store/voiceStore.ts';

// Composes the player stage and the study-journal sidebar, and drives the
// faked voice session (start_turn → transcript → streamed answer → jump →
// turn_complete), including barge-in when you press the mic mid-answer.
export default function Watch({ dark, onToggleTheme, onRestart, data }) {
  const D = useVoiceStore((state) => state.duration) || data.video.duration;
  const storedVideoId = useVoiceStore((state) => state.videoId);
  const devVideoId = import.meta.env.VITE_VIDEO_ID;
  const videoId = storedVideoId || devVideoId;
  const { voiceState: micState, micLevel: amplitude, currentLanguage, latestTranscript, latestAnswer, errorMessage, clearError, activateMic, releaseMic, interrupt } = useVoiceLoop(videoId);
  const position = useVoiceStore((state) => state.position);
  const playing = useVoiceStore((state) => state.isPlaying);
  const chatTurns = useVoiceStore((state) => state.chatTurns);
  const flashRequest = useVoiceStore((state) => state.videoShouldFlash);
  const seekVideo = useVoiceStore((state) => state.seekVideo);
  const pauseVideo = useVoiceStore((state) => state.pauseVideo);
  const resumeVideo = useVoiceStore((state) => state.resumeVideo);
  const [flashAt, setFlash] = React.useState(null);
  const [animChip, setAnimChip] = React.useState(null);
  const language = languageLabel(currentLanguage);

  React.useEffect(() => {
    if (import.meta.env.DEV && !storedVideoId && devVideoId) {
      console.warn('Using VITE_VIDEO_ID instead of an uploaded video ID.');
    }
  }, [devVideoId, storedVideoId]);

  React.useEffect(() => {
    if (!flashRequest) return;
    setFlash(null);
    const frame = requestAnimationFrame(() => setFlash(flashRequest.seconds));
    const timeout = setTimeout(() => setFlash(null), 1150);
    return () => { cancelAnimationFrame(frame); clearTimeout(timeout); };
  }, [flashRequest]);

  const jumpTo = (seconds, turnId) => {
    seekVideo(seconds);
    useVoiceStore.getState().triggerVideoFlash(seconds);
    setAnimChip(turnId != null ? turnId : (turns.find((t) => t.t === seconds) || {}).id);
  };

  const turns = toDisplayTurns(chatTurns);
  const streaming = latestTranscript && (micState === 'thinking' || micState === 'speaking')
    ? { q: latestTranscript, a: latestAnswer || '', lang: language, showDivider: false }
    : null;

  const markers = turns.concat(streaming && streaming.q ? [] : []).map((t) => ({ id: t.id, time: t.t, label: t.lang }));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <TopBar
        dark={dark} onToggleTheme={onToggleTheme}
        right={<>
          <Badge tone="success" dot>Ready</Badge>
          <Button variant="ghost" size="sm" icon="rotate-ccw" onClick={onRestart}>New video</Button>
        </>}
      />
      <div style={{
        flex: 1, minHeight: 0, display: 'grid',
        gridTemplateColumns: 'minmax(0,var(--watch-main)) minmax(var(--sidebar-min),var(--watch-side))',
        gap: 20, padding: '0 clamp(16px,3vw,32px) clamp(16px,3vw,28px)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <VideoStage
            videoId={videoId} title={data.video.title}
            duration={D} position={position} playing={playing}
            markers={markers} flashAt={flashAt}
            micState={micState} amplitude={amplitude} language={language}
            onSeek={seekVideo}
            onMarkerClick={(m) => jumpTo(m.time, m.id)}
            onTogglePlay={() => playing ? pauseVideo() : resumeVideo()}
            onSkip={(d) => seekVideo(Math.max(0, Math.min(D, position + d)))}
            onMicDown={() => micState === 'speaking' ? interrupt() : activateMic()} onMicUp={releaseMic}
          />
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-faint)' }}>
            Hold the mic to ask. Speak while Poocho answers to interrupt — the greyed turn stays in your journal.
          </p>
        </div>
        <ChatSidebar turns={turns} streaming={streaming} animChip={animChip} onJump={(s) => jumpTo(s)} errorMessage={errorMessage} onClearError={clearError} />
      </div>
    </div>
  );
}

function languageLabel(language) {
  return { hi: 'Hindi', kn: 'Kannada', en: 'English', 'hi-en': 'Hinglish' }[language] || null;
}

function toDisplayTurns(chatTurns) {
  const turns = [];
  for (const turn of chatTurns) {
    if (turn.role === 'user') {
      turns.push({ id: turn.timestamp, lang: languageLabel(turn.language), q: turn.text, a: '', t: null, interrupted: turn.interrupted || false });
    } else {
      const target = turns[turns.length - 1];
      if (target && !target.a) {
        target.a = turn.text;
        target.t = turn.jumpTo;
        if (turn.interrupted) {
          target.interrupted = true;
        }
      } else {
        turns.push({ id: turn.timestamp, lang: languageLabel(turn.language), q: '', a: turn.text, t: turn.jumpTo, interrupted: turn.interrupted || false });
      }
    }
  }
  return turns;
}
