import React from 'react';
import './poocho.css';
import { useHashRoute, navigate } from './router.jsx';
import { POOCHO_DATA } from './data.js';
import Landing from './screens/Landing.jsx';
import Processing from './screens/Processing.jsx';
import Watch from './screens/Watch.jsx';
import { useVoiceStore } from '../store/voiceStore.ts';

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// App shell: owns the theme, reads the active hash route, and swaps the screen.
// The three states of the product each map to a route:
//   #/           → Landing
//   #/processing → Processing (uploading → transcribing, then routes to watch)
//   #/watch      → Watch
export default function PoochoApp() {
  const route = useHashRoute();
  const [path, queryParams] = React.useMemo(() => {
    const [p, q] = route.split('?');
    return [p, new URLSearchParams(q || '')];
  }, [route]);

  const routeVideoId = queryParams.get('videoId');
  const [dark, setDark] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [videoMeta, setVideoMeta] = React.useState(null);
  const videoId = useVoiceStore((state) => state.videoId);
  const setVideoId = useVoiceStore((state) => state.setVideoId);
  const clearVideoSession = useVoiceStore((state) => state.clearVideoSession);
  const devVideoId = import.meta.env.VITE_VIDEO_ID;

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleTheme = () => setDark((d) => !d);

  React.useEffect(() => {
    if (routeVideoId && routeVideoId !== videoId) {
      setVideoId(routeVideoId);
    }
  }, [routeVideoId, videoId, setVideoId]);

  React.useEffect(() => {
    if (path === '/') {
      setSelectedFile(null);
      setVideoMeta(null);
      clearVideoSession();
    }
  }, [clearVideoSession, path]);

  React.useEffect(() => {
    if ((path === '/processing' && !selectedFile) || (path === '/watch' && !videoId && !routeVideoId && !devVideoId)) {
      navigate('/');
    }
  }, [devVideoId, path, selectedFile, videoId, routeVideoId]);

  const handleRestart = () => navigate('/');
  const handleProcessingComplete = React.useCallback((meta) => {
    setVideoId(meta.videoId);
    setVideoMeta(meta);
    try {
      localStorage.setItem(`video_meta_${meta.videoId}`, JSON.stringify(meta));
    } catch (e) {
      console.error(e);
    }
    navigate(`/watch?videoId=${encodeURIComponent(meta.videoId)}`);
  }, [setVideoId]);

  let screen;
  if (path === '/processing') {
    screen = (
      <Processing
        file={selectedFile}
        data={POOCHO_DATA}
        onComplete={handleProcessingComplete}
        onRetry={handleRestart}
      />
    );
  } else if (path === '/watch' && (videoId || routeVideoId || devVideoId)) {
    const activeVideoId = videoId || routeVideoId || devVideoId;
    
    // Retrieve persisted metadata from localStorage if missing in local state
    let resolvedMeta = videoMeta;
    if (!resolvedMeta && activeVideoId) {
      try {
        const persisted = localStorage.getItem(`video_meta_${activeVideoId}`);
        if (persisted) {
          resolvedMeta = JSON.parse(persisted);
        }
      } catch (e) {
        console.error(e);
      }
    }

    const watchData = resolvedMeta ? {
      video: {
        id: activeVideoId,
        name: resolvedMeta.filename,
        size: formatBytes(resolvedMeta.size),
        duration: 1864, // Default mock duration for progress syncing / WS loop
        title: resolvedMeta.filename.split('.').slice(0, -1).join('.') || resolvedMeta.filename,
      }
    } : { ...POOCHO_DATA, video: { ...POOCHO_DATA.video, id: activeVideoId } };
    screen = <Watch dark={dark} onToggleTheme={toggleTheme} onRestart={handleRestart} data={watchData} />;
  } else {
    screen = (
      <Landing
        dark={dark}
        onToggleTheme={toggleTheme}
        onStart={(files) => {
          if (files && files.length > 0) {
            const file = files[0];
            const maxBytes = 100 * 1024 * 1024; // 100 MB
            if (file.size > maxBytes) {
              alert('Video file size exceeds the 100 MB limit.');
              return;
            }
            setSelectedFile(file);
          } else {
            setSelectedFile(null);
          }
          navigate('/processing');
        }}
      />
    );
  }

  // Keying on the path re-triggers the `poocho-rise` entrance on screen transitions
  return <div key={path} className="state">{screen}</div>;
}
