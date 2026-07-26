import React from 'react';
import { Logo, IconButton } from './ds.js';

// Shared header: wordmark on the left, optional status controls (`right`) and
// the theme toggle on the right.
export default function TopBar({ dark, onToggleTheme, right }) {
  return (
    <header style={{ position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px clamp(20px,4vw,44px)' }}>
      <Logo size={22} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {right}
        <IconButton icon={dark ? 'sun' : 'moon'} label={dark ? 'Light mode' : 'Dark mode'} onClick={onToggleTheme} />
      </div>
    </header>
  );
}
