import React from 'react';
import { Watermark, Waveform, MicButton, Badge, LanguageIndicator, VideoTimeline, PlayerControls } from '../ds.js';
import { VideoPlayer } from '../../components/VideoPlayer.tsx';

// The player surface: a dark placeholder (no footage ships with the design
// system), the mic cluster, and the scrim with timeline + transport controls.
export default function VideoStage({
  videoId, title, duration, position, playing, markers, flashAt, micState, amplitude,
  onSeek, onMarkerClick, onTogglePlay, onSkip, onMicDown, onMicUp, language,
}) {
  return (
    <div style={{ position: 'relative', borderRadius: 'var(--radius-video)', overflow: 'hidden', background: '#0A1413', boxShadow: 'var(--shadow-lg)', aspectRatio: '16 / 9', minHeight: 0 }}>
      <VideoPlayer videoId={videoId} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <Watermark size={300} opacity={0.07} color="#EFB363" />
        <span style={{ position: 'absolute', left: 20, top: 18, fontSize: 'var(--text-xs)', color: 'rgba(242,239,233,.55)', letterSpacing: 'var(--ls-wide)' }}>{title}</span>
      </div>

      {/* mic cluster */}
      <div style={{ position: 'absolute', left: '50%', bottom: 104, transform: 'translateX(-50%)', display: 'grid', justifyItems: 'center', gap: 12, zIndex: 2 }}>
        {micState !== 'idle' ? (
          <Waveform
            amplitude={micState === 'listening' ? amplitude : 0.42}
            height={26}
            color={micState === 'listening' ? 'var(--state-listening)' : 'var(--state-speaking)'}
          />
        ) : null}
        <MicButton state={micState} amplitude={amplitude} size={84} onPress={onMicDown} onRelease={onMicUp} />
        {micState === 'speaking'
          ? <Badge tone="primary" dot>Poocho is speaking</Badge>
          : <LanguageIndicator language={language} detecting={micState === 'listening' && !language} onDark />}
      </div>

      {/* scrim + controls */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '52px 16px 12px', background: 'var(--scrim-video)', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <VideoTimeline duration={duration} position={position} buffered={duration * 0.82} markers={markers} flashAt={flashAt} onSeek={onSeek} onMarkerClick={onMarkerClick} />
          <PlayerControls playing={playing} position={position} duration={duration} onTogglePlay={onTogglePlay} onSkip={onSkip} />
        </div>
      </div>
    </div>
  );
}
