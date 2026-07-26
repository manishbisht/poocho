// Minimal hash router.
//
// The Poocho app is a three-state flow — landing → processing → watch — and we
// drive it entirely off `window.location.hash`, so every state is a real,
// reload-safe, deep-linkable URL (`#/`, `#/processing`, `#/watch`).
import React from 'react';

// Normalise the current hash to a leading-slash path. Empty hash → '/'.
export function currentRoute() {
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw || raw === '/') return '/';
  return raw.startsWith('/') ? raw : '/' + raw;
}

// Subscribe to hash changes and re-render with the active route.
export function useHashRoute() {
  const [route, setRoute] = React.useState(currentRoute);
  React.useEffect(() => {
    const onChange = () => setRoute(currentRoute());
    window.addEventListener('hashchange', onChange);
    // Sync once in case the hash changed between first render and effect.
    onChange();
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

// Programmatic navigation. Assigning to location.hash fires `hashchange`,
// which every mounted useHashRoute() picks up.
export function navigate(to) {
  const path = to.startsWith('/') ? to : '/' + to;
  if (window.location.hash === '#' + path) return;
  window.location.hash = path;
}
