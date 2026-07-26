import React from 'react';
import { Watermark, Badge, ProgressBar, ProcessingStatus, Button } from '../ds.js';
import { getApiBase } from '../../lib/api.ts';
import { useVoiceStore } from '../../store/voiceStore.ts';

const PROCESSING_TIMEOUT_MS = 12 * 60 * 1000;

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function Processing({ file, onComplete, onRetry, data }) {
  const [phase, setPhase] = React.useState('uploading');
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState(null);

  const xhrRef = React.useRef(null);
  const pollTimerRef = React.useRef(null);
  const setVideoId = useVoiceStore((state) => state.setVideoId);

  React.useEffect(() => {
    if (!file) {
      setPhase('failed');
      setError('No video selected. Please choose a video and try again.');
      return undefined;
    }

    // Real upload flow using XMLHttpRequest for reliable progress tracking
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = (e.loaded / e.total) * 100;
        setProgress(pct);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (typeof res.videoId !== 'string' || !res.videoId) {
            throw new Error('Upload response did not include a videoId');
          }
          setVideoId(res.videoId);
          setPhase('processing');
          startPolling(res.videoId);
        } catch (err) {
          setPhase('failed');
          setError('Failed to parse upload response');
        }
      } else {
        setPhase('failed');
        setError(`Upload failed with status ${xhr.status}: ${xhr.statusText || 'Unknown error'}`);
      }
    };

    xhr.onerror = () => {
      setPhase('failed');
      setError('Network error occurred during upload');
    };

    const uploadStartedAt = performance.now();
    const baseUrl = getApiBase();
    xhr.open('POST', `${baseUrl}/upload`);
    xhr.setRequestHeader('X-Filename', encodeURIComponent(file.name));
    xhr.setRequestHeader('Content-Type', file.type || 'video/mp4');
    xhr.send(file);

    function startPolling(vid) {
      const poll = async () => {
        if (performance.now() - uploadStartedAt >= PROCESSING_TIMEOUT_MS) {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          setPhase('failed');
          setError('Processing timed out after 12 minutes. Please try another video.');
          return;
        }
        try {
          const response = await fetch(`${baseUrl}/video/${vid}`);
          if (!response.ok) {
            return;
          }
          const meta = await response.json();
          if (meta.status === 'ready') {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            if (onComplete) {
              onComplete(meta);
            }
          } else if (meta.status === 'failed') {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            setPhase('failed');
            setError(meta.error || 'Video transcription/processing failed.');
          }
        } catch (err) {
          if (import.meta.env.DEV) {
            console.error('Polling error:', err);
          }
        }
      };

      pollTimerRef.current = setInterval(poll, 3000);
      void poll();
    }

    return () => {
      if (xhrRef.current) xhrRef.current.abort();
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [file, onComplete, setVideoId]);

  const uploading = phase === 'uploading';

  return (
    <div style={{ position: 'relative', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <Watermark size={560} opacity={0.035} color="var(--primary)" />
      <div style={{ position: 'relative', width: '100%', maxWidth: 460, display: 'grid', gap: 30, justifyItems: 'center' }}>
        {phase === 'failed' ? (
          <Badge tone="danger" dot uppercase>Failed</Badge>
        ) : (
          <Badge tone={uploading ? 'neutral' : 'primary'} dot uppercase>{uploading ? 'Uploading' : 'Transcribing'}</Badge>
        )}

        <div style={{ position: 'relative', width: 208, aspectRatio: '16 / 9', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--line-soft)', boxShadow: 'var(--shadow-md)', background: 'linear-gradient(150deg,#16302C,#0C1817)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(242,239,233,.5)' }}>
          <Watermark size={208 * 0.62} opacity={0.12} color="#EFB363" />
          <span style={{ position: 'relative', fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase' }}>16:9 poster frame</span>
        </div>

        {phase === 'failed' ? (
          <div style={{ width: '100%', display: 'grid', gap: 18, justifyItems: 'center', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--state-error, #ff6b6b)', letterSpacing: 'var(--ls-tight)' }}>Upload or Processing Failed</p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{error || 'An unexpected error occurred.'}</p>
            <Button onClick={onRetry}>Try Another Video</Button>
          </div>
        ) : uploading ? (
          <div style={{ width: '100%', display: 'grid', gap: 18, justifyItems: 'center' }}>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-strong)', letterSpacing: 'var(--ls-tight)' }}>Sending your video to Poocho…</p>
            <ProgressBar
              style={{ width: '100%' }}
              value={progress}
              label={file ? file.name : data.video.name}
              meta={Math.round(progress) + '% · ' + (file ? formatBytes(file.size) : data.video.size)}
            />
          </div>
        ) : (
          <ProcessingStatus
            message="Teaching Poocho to understand your video…"
            sub="This takes about a minute. You can keep this tab open."
            filename={file ? file.name : data.video.name}
            duration={file ? "" : "31:04"}
            style={{ gap: 20 }}
          />
        )}
      </div>
    </div>
  );
}
