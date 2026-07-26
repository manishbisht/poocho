/* @generated — Poocho design-system bundle, imported from claude.ai/design.
   Source of truth is the design project; do not hand-edit. */
/* eslint-disable */
import React from 'react';

/* @ds-bundle: {"format":4,"namespace":"PoochoDesignSystem_14960d","components":[{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Watermark","sourcePath":"components/brand/Watermark.jsx"},{"name":"ChatBubble","sourcePath":"components/chat/ChatBubble.jsx"},{"name":"LanguageDivider","sourcePath":"components/chat/LanguageDivider.jsx"},{"name":"TimestampChip","sourcePath":"components/chat/TimestampChip.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"ICONS","sourcePath":"components/core/Icon.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"PlayerControls","sourcePath":"components/player/PlayerControls.jsx"},{"name":"VideoTimeline","sourcePath":"components/player/VideoTimeline.jsx"},{"name":"DropZone","sourcePath":"components/upload/DropZone.jsx"},{"name":"ProcessingStatus","sourcePath":"components/upload/ProcessingStatus.jsx"},{"name":"ProgressBar","sourcePath":"components/upload/ProgressBar.jsx"},{"name":"LanguageIndicator","sourcePath":"components/voice/LanguageIndicator.jsx"},{"name":"MicButton","sourcePath":"components/voice/MicButton.jsx"},{"name":"Waveform","sourcePath":"components/voice/Waveform.jsx"}],"sourceHashes":{"components/brand/Logo.jsx":"b0b73803846d","components/brand/Watermark.jsx":"540625b21f97","components/chat/ChatBubble.jsx":"656b03b87719","components/chat/LanguageDivider.jsx":"d1a57cd371c2","components/chat/TimestampChip.jsx":"012886739bbe","components/core/Badge.jsx":"2b799446a633","components/core/Button.jsx":"810cadb2a9ad","components/core/Card.jsx":"770ce3ff165d","components/core/Icon.jsx":"ad0a58c8eb8b","components/core/IconButton.jsx":"0757bd8f2273","components/player/PlayerControls.jsx":"231c6ce35454","components/player/VideoTimeline.jsx":"6e00d2bb7cf9","components/upload/DropZone.jsx":"bc93d316edbc","components/upload/ProcessingStatus.jsx":"d4b30139d606","components/upload/ProgressBar.jsx":"5de2edc4f289","components/voice/LanguageIndicator.jsx":"b918512a7c15","components/voice/MicButton.jsx":"4eea9d66f2ed","components/voice/Waveform.jsx":"73b090641274","ui_kits/poocho-app/ChatSidebar.jsx":"79676328f5a9","ui_kits/poocho-app/Landing.jsx":"425d478be15c","ui_kits/poocho-app/Processing.jsx":"a45ebd95cec3","ui_kits/poocho-app/VideoStage.jsx":"b6fcba6a0b02","ui_kits/poocho-app/Watch.jsx":"52d257b0ef8a","ui_kits/poocho-app/app.jsx":"e84fa9f8b798","ui_kits/poocho-app/data.js":"8e41807bb060"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PoochoDesignSystem_14960d = window.PoochoDesignSystem_14960d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* No logo file was supplied by the source repo, so the mark IS the wordmark:
   the Devanagari पूछो set in Tiro Devanagari Hindi, optionally followed by
   the latin name in Instrument Serif. */
function Logo({
  size = 24,
  variant = 'lockup',
  color,
  style,
  ...rest
}) {
  const c = color || 'var(--text-strong)';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: size * 0.42,
      color: c,
      lineHeight: 1,
      ...style
    },
    "aria-label": "Poocho"
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-deva)',
      fontSize: size * 1.16,
      color: variant === 'mono' ? c : 'var(--primary)',
      lineHeight: 1,
      position: 'relative',
      top: size * 0.06
    }
  }, "\u092A\u0942\u091B\u094B"), variant !== 'mark' ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: size,
      letterSpacing: 'var(--ls-tight)',
      lineHeight: 1
    }
  }, "Poocho") : null);
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/Watermark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Watermark({
  text = 'पूछो',
  size = 320,
  opacity = 0.06,
  color,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      pointerEvents: 'none',
      userSelect: 'none',
      fontFamily: 'var(--font-deva)',
      fontSize: size,
      lineHeight: 1,
      color: color || 'currentColor',
      opacity,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), text);
}
Object.assign(__ds_scope, { Watermark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Watermark.jsx", error: String((e && e.message) || e) }); }

// components/chat/LanguageDivider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function LanguageDivider({
  language = 'Hindi',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '4px 0',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      height: 1,
      flex: 1,
      background: 'var(--line-soft)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-micro)',
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-faint)',
      whiteSpace: 'nowrap'
    }
  }, language), /*#__PURE__*/React.createElement("span", {
    style: {
      height: 1,
      flex: 1,
      background: 'var(--line-soft)'
    }
  }));
}
Object.assign(__ds_scope, { LanguageDivider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chat/LanguageDivider.jsx", error: String((e && e.message) || e) }); }

// components/chat/TimestampChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function fmt(s) {
  s = Math.max(0, Math.floor(s || 0));
  const m = Math.floor(s / 60),
    r = s % 60;
  return m + ':' + String(r).padStart(2, '0');
}
function TimestampChip({
  seconds = 0,
  onJump,
  animate = false,
  muted = false,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: () => onJump && onJump(seconds),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    title: 'Jump to ' + fmt(seconds),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: 26,
      padding: '0 11px 0 9px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-micro)',
      letterSpacing: 'var(--ls-wide)',
      cursor: 'pointer',
      background: muted ? 'var(--surface-inset)' : hover ? 'var(--teal-100)' : 'var(--primary-soft)',
      color: muted ? 'var(--text-faint)' : 'var(--primary-text)',
      border: '1px solid ' + (muted ? 'var(--line-soft)' : 'var(--primary-soft-line)'),
      transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
      animation: animate ? 'poocho-chip 620ms var(--ease-tactile) 1' : undefined,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      opacity: .75
    }
  }, "\u2192"), fmt(seconds));
}
Object.assign(__ds_scope, { TimestampChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chat/TimestampChip.jsx", error: String((e && e.message) || e) }); }

// components/chat/ChatBubble.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* A study-journal entry, not a chat app bubble.
   question: compact, low contrast, no fill.
   answer:   card-like, prominent, carries the timestamp chip.        */
function ChatBubble({
  role = 'answer',
  text = '',
  timestamp = null,
  streaming = false,
  interrupted = false,
  chipAnimate = false,
  onJump,
  style,
  ...rest
}) {
  const q = role === 'question';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 10,
      padding: q ? '2px 0 2px 14px' : '16px 18px',
      borderLeft: q ? '2px solid var(--line)' : 'none',
      background: q ? 'transparent' : 'var(--surface-card)',
      border: q ? undefined : '1px solid var(--line-soft)',
      borderRadius: q ? 0 : 'var(--radius-lg)',
      boxShadow: q ? 'none' : 'var(--shadow-xs)',
      opacity: interrupted ? 0.42 : 1,
      filter: interrupted ? 'saturate(.35)' : 'none',
      animation: 'poocho-rise var(--dur-base) var(--ease-out) 1',
      transition: 'opacity var(--dur-slow) var(--ease-calm), filter var(--dur-slow) var(--ease-calm)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: q ? 'var(--text-sm)' : 'var(--text-base)',
      lineHeight: q ? 'var(--lh-sm)' : 'var(--lh-base)',
      fontWeight: 'var(--weight-regular)',
      color: q ? 'var(--text-muted)' : 'var(--text-body)',
      fontStyle: q ? 'normal' : 'normal'
    }
  }, text, streaming ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      width: 2,
      height: '1em',
      marginLeft: 3,
      verticalAlign: '-2px',
      background: 'var(--primary)',
      animation: 'poocho-caret 900ms steps(1) infinite'
    }
  }) : null), timestamp != null && !q ? /*#__PURE__*/React.createElement(__ds_scope.TimestampChip, {
    seconds: timestamp,
    onJump: onJump,
    animate: chipAnimate,
    muted: interrupted
  }) : null);
}
Object.assign(__ds_scope, { ChatBubble });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chat/ChatBubble.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  plain: {
    background: 'var(--surface-card)',
    border: '1px solid var(--line-soft)'
  },
  inset: {
    background: 'var(--surface-inset)',
    border: '1px solid transparent'
  },
  primary: {
    background: 'var(--primary-soft)',
    border: '1px solid var(--primary-soft-line)'
  },
  accent: {
    background: 'var(--accent-soft)',
    border: '1px solid var(--accent-soft-line)'
  }
};
function Card({
  tone = 'plain',
  elevation = 'sm',
  padding = 24,
  interactive = false,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const shadow = {
    none: 'var(--shadow-none)',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)'
  }[elevation];
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      borderRadius: 'var(--radius-card)',
      padding,
      boxShadow: hover ? 'var(--shadow-md)' : shadow,
      transform: hover ? 'translateY(-2px)' : 'none',
      cursor: interactive ? 'pointer' : undefined,
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      ...TONES[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Geometry lifted verbatim from Lucide (ISC) — see assets/icons/*.svg */
const ICONS = {
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'audio-lines': '<path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'circle-stop': '<circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6" rx="1"/>',
  'languages': '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
  'link': '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  'loader-circle': '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
  'maximize': '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
  'message-circle-question-mark': '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  'mic': '<path d="M12 19v3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/>',
  'moon': '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
  'pause': '<rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/>',
  'play': '<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>',
  'rotate-ccw': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  'settings': '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>',
  'skip-back': '<path d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"/><path d="M3 20V4"/>',
  'skip-forward': '<path d="M21 4v16"/><path d="M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/>',
  'sparkles': '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>',
  'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  'upload': '<path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
  'volume-2': '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
  'volume-x': '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
};
function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  className = '',
  style,
  ...rest
}) {
  const body = ICONS[name];
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    className: className,
    style: {
      display: 'block',
      flex: 'none',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: body || ''
    }
  }, rest));
}
Object.assign(__ds_scope, { ICONS, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  neutral: {
    background: 'var(--surface-inset)',
    color: 'var(--text-muted)',
    border: '1px solid var(--line-soft)'
  },
  primary: {
    background: 'var(--primary-soft)',
    color: 'var(--primary-text)',
    border: '1px solid var(--primary-soft-line)'
  },
  accent: {
    background: 'var(--accent-soft)',
    color: 'var(--accent-text)',
    border: '1px solid var(--accent-soft-line)'
  },
  success: {
    background: 'var(--success-soft)',
    color: 'var(--success)',
    border: '1px solid transparent'
  },
  danger: {
    background: 'var(--danger-soft)',
    color: 'var(--danger)',
    border: '1px solid transparent'
  }
};
function Badge({
  tone = 'neutral',
  icon,
  dot = false,
  uppercase = false,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 24,
      padding: '0 10px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-micro)',
      fontWeight: 'var(--weight-medium)',
      letterSpacing: uppercase ? 'var(--ls-caps)' : 'var(--ls-wide)',
      textTransform: uppercase ? 'uppercase' : 'none',
      ...TONES[tone],
      ...style
    }
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor',
      flex: 'none'
    }
  }) : null, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 12,
    strokeWidth: 2
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    height: 34,
    padding: '0 14px',
    fontSize: 'var(--text-sm)',
    gap: 6,
    icon: 16
  },
  md: {
    height: 42,
    padding: '0 18px',
    fontSize: 'var(--text-sm)',
    gap: 8,
    icon: 18
  },
  lg: {
    height: 52,
    padding: '0 26px',
    fontSize: 'var(--text-base)',
    gap: 10,
    icon: 20
  }
};
const VARIANTS = {
  primary: {
    background: 'var(--primary)',
    color: 'var(--text-on-primary)',
    border: '1px solid transparent',
    boxShadow: 'var(--shadow-sm)'
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-strong)',
    border: '1px solid var(--line)',
    boxShadow: 'var(--shadow-xs)'
  },
  soft: {
    background: 'var(--primary-soft)',
    color: 'var(--primary-text)',
    border: '1px solid var(--primary-soft-line)',
    boxShadow: 'none'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-body)',
    border: '1px solid transparent',
    boxShadow: 'none'
  }
};
const HOVER = {
  primary: {
    background: 'var(--primary-hover)'
  },
  secondary: {
    background: 'var(--surface-inset)',
    borderColor: 'var(--line-strong)'
  },
  soft: {
    background: 'var(--teal-100)'
  },
  ghost: {
    background: 'var(--surface-inset)'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconAfter,
  fullWidth = false,
  disabled = false,
  children,
  style,
  onClick,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: fullWidth ? '100%' : undefined,
      height: s.height,
      padding: s.padding,
      gap: s.gap,
      fontFamily: 'var(--font-sans)',
      fontSize: s.fontSize,
      fontWeight: 'var(--weight-medium)',
      letterSpacing: 'var(--ls-tight)',
      borderRadius: 'var(--radius-control)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      whiteSpace: 'nowrap',
      transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-instant) var(--ease-out), border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      transform: press && !disabled ? 'translateY(1px) scale(.985)' : 'none',
      ...v,
      ...(hover && !disabled ? HOVER[variant] : null),
      ...(press && !disabled ? {
        boxShadow: 'var(--shadow-press)'
      } : null),
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.icon
  }) : null, children, iconAfter ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconAfter,
    size: s.icon
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    box: 30,
    icon: 16
  },
  md: {
    box: 38,
    icon: 20
  },
  lg: {
    box: 46,
    icon: 24
  }
};
function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  active = false,
  onDark = false,
  disabled = false,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const base = onDark ? {
    color: '#F2EFE9',
    background: hover ? 'rgba(255,255,255,.14)' : 'transparent'
  } : variant === 'solid' ? {
    color: 'var(--text-on-primary)',
    background: hover ? 'var(--primary-hover)' : 'var(--primary)'
  } : {
    color: active ? 'var(--primary-text)' : 'var(--text-muted)',
    background: hover || active ? 'var(--surface-inset)' : 'transparent'
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: s.box,
      height: s.box,
      border: 'none',
      padding: 0,
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transform: press && !disabled ? 'scale(.92)' : 'none',
      transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-instant) var(--ease-out), color var(--dur-fast) var(--ease-out)',
      ...base,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.icon
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/player/PlayerControls.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function fmt(s) {
  s = Math.max(0, Math.floor(s || 0));
  const m = Math.floor(s / 60),
    r = s % 60;
  return m + ':' + String(r).padStart(2, '0');
}
function PlayerControls({
  playing = false,
  position = 0,
  duration = 0,
  muted = false,
  onTogglePlay,
  onSkip,
  onToggleMute,
  onFullscreen,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      color: '#F2EFE9',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: playing ? 'pause' : 'play',
    label: playing ? 'Pause' : 'Play',
    size: "lg",
    onDark: true,
    onClick: onTogglePlay
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "skip-back",
    label: "Back 10 seconds",
    onDark: true,
    onClick: () => onSkip && onSkip(-10)
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "skip-forward",
    label: "Forward 10 seconds",
    onDark: true,
    onClick: () => onSkip && onSkip(10)
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: '0 10px 0 6px',
      letterSpacing: 'var(--ls-wide)',
      opacity: .9,
      whiteSpace: 'nowrap'
    }
  }, fmt(position), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5
    }
  }, " / ", fmt(duration))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, children), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: muted ? 'volume-x' : 'volume-2',
    label: muted ? 'Unmute' : 'Mute',
    onDark: true,
    onClick: onToggleMute
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "settings",
    label: "Playback settings",
    onDark: true
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "maximize",
    label: "Fullscreen",
    onDark: true,
    onClick: onFullscreen
  }));
}
Object.assign(__ds_scope, { PlayerControls });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/player/PlayerControls.jsx", error: String((e && e.message) || e) }); }

// components/player/VideoTimeline.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function fmt(s) {
  s = Math.max(0, Math.floor(s || 0));
  const m = Math.floor(s / 60),
    r = s % 60;
  return m + ':' + String(r).padStart(2, '0');
}

/* Timeline with saffron markers wherever a question was asked.
   flashAt (seconds) triggers the soft grounding flash after a jump. */
function VideoTimeline({
  duration = 600,
  position = 0,
  buffered = 0,
  markers = [],
  flashAt = null,
  onSeek,
  onMarkerClick,
  height = 6,
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  const [hoverX, setHoverX] = React.useState(null);
  const pct = t => duration ? Math.max(0, Math.min(1, t / duration)) * 100 : 0;
  const seek = e => {
    if (!onSeek || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    onSeek((e.clientX - r.left) / r.width * duration);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onClick: seek,
    onMouseMove: e => {
      const r = ref.current.getBoundingClientRect();
      setHoverX(e.clientX - r.left);
    },
    onMouseLeave: () => setHoverX(null),
    style: {
      position: 'relative',
      height: height + 16,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      touchAction: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--timeline-track)',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      width: pct(buffered) + '%',
      background: 'var(--line-strong)',
      opacity: .5,
      borderRadius: 'var(--radius-pill)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      width: pct(position) + '%',
      background: 'var(--timeline-played)',
      borderRadius: 'var(--radius-pill)',
      transition: 'width var(--dur-fast) linear'
    }
  }), markers.map((m, i) => /*#__PURE__*/React.createElement("button", {
    key: m.id != null ? m.id : i,
    type: "button",
    title: (m.label ? m.label + '  ' : '') + fmt(m.time),
    onClick: e => {
      e.stopPropagation();
      onMarkerClick && onMarkerClick(m);
    },
    style: {
      position: 'absolute',
      left: 'calc(' + pct(m.time) + '% - 4px)',
      top: -(14 - height) / 2 - 1,
      width: 8,
      height: 14,
      padding: 0,
      border: '1.5px solid var(--surface-card)',
      borderRadius: 'var(--radius-pill)',
      background: m.color || 'var(--timeline-marker)',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-xs)',
      transition: 'transform var(--dur-fast) var(--ease-tactile)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'scaleY(1.35) scaleX(1.15)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'none';
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 'calc(' + pct(position) + '% - 6px)',
      top: (height - 12) / 2,
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: 'var(--timeline-played)',
      border: '2px solid var(--surface-card)',
      boxShadow: 'var(--shadow-sm)',
      pointerEvents: 'none'
    }
  }), flashAt != null ? /*#__PURE__*/React.createElement("span", {
    key: 'flash-' + flashAt,
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: 'calc(' + pct(flashAt) + '% - 22px)',
      top: -18,
      width: 44,
      height: height + 36,
      borderRadius: 'var(--radius-pill)',
      background: 'radial-gradient(closest-side, var(--timeline-flash), transparent 72%)',
      animation: 'poocho-flash 1100ms var(--ease-out) 1',
      pointerEvents: 'none'
    }
  }) : null)), hoverX != null && ref.current ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -26,
      left: hoverX,
      transform: 'translateX(-50%)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-micro)',
      background: 'var(--surface-inverse)',
      color: 'var(--text-inverse)',
      padding: '3px 7px',
      borderRadius: 'var(--radius-xs)',
      pointerEvents: 'none',
      whiteSpace: 'nowrap'
    }
  }, fmt(hoverX / ref.current.getBoundingClientRect().width * duration)) : null);
}
Object.assign(__ds_scope, { VideoTimeline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/player/VideoTimeline.jsx", error: String((e && e.message) || e) }); }

// components/upload/DropZone.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function DropZone({
  label = 'Drop an MP4 video here, or click to browse',
  hint = 'MP4 only · up to 100 MB',
  onFiles,
  onLink,
  style,
  ...rest
}) {
  const [over, setOver] = React.useState(false);
  const inputRef = React.useRef(null);
  return /*#__PURE__*/React.createElement("div", _extends({
    onDragOver: e => {
      e.preventDefault();
      setOver(true);
    },
    onDragLeave: () => setOver(false),
    onDrop: e => {
      e.preventDefault();
      setOver(false);
      const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'video/mp4' || f.name.endsWith('.mp4'));
      if (files.length > 0) {
        onFiles && onFiles(files);
      } else {
        alert('Please drop an MP4 video file.');
      }
    },
    onClick: () => inputRef.current && inputRef.current.click(),
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18,
      padding: '52px 32px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-xl)',
      border: '1.5px dashed ' + (over ? 'var(--primary)' : 'var(--line)'),
      background: over ? 'var(--primary-soft)' : 'var(--surface-card)',
      boxShadow: over ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      transform: over ? 'scale(1.004)' : 'none',
      transition: 'background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "file",
    accept: "video/mp4",
    hidden: true,
    onChange: e => {
      const files = Array.from(e.target.files).filter(f => f.type === 'video/mp4' || f.name.endsWith('.mp4'));
      if (files.length > 0) {
        onFiles && onFiles(files);
      } else {
        alert('Please select an MP4 video file.');
      }
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--primary-soft)',
      color: 'var(--primary-text)',
      border: '1px solid var(--primary-soft-line)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "upload",
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      display: 'grid',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-strong)',
      letterSpacing: 'var(--ls-tight)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-faint)'
    }
  }, hint)));
}
Object.assign(__ds_scope, { DropZone });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/upload/DropZone.jsx", error: String((e && e.message) || e) }); }

// components/upload/ProcessingStatus.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProcessingStatus({
  message = 'Teaching Poocho to understand your video…',
  sub = 'This takes about a minute. You can keep this tab open.',
  thumbnail,
  filename,
  duration,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 26,
      textAlign: 'center',
      ...style
    }
  }, rest), thumbnail ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 208,
      aspectRatio: '16 / 9',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--line-soft)',
      boxShadow: 'var(--shadow-md)',
      background: 'var(--surface-inset)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: thumbnail,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "loader-circle",
    size: 19,
    style: {
      color: 'var(--primary)',
      animation: 'poocho-spin 1.1s linear infinite'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-lg)',
      color: 'var(--text-strong)',
      letterSpacing: 'var(--ls-tight)'
    }
  }, message)), sub ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-faint)',
      maxWidth: 380
    }
  }, sub) : null, filename || duration ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-micro)',
      color: 'var(--text-faint)',
      letterSpacing: 'var(--ls-wide)'
    }
  }, [filename, duration].filter(Boolean).join('  ·  ')) : null);
}
Object.assign(__ds_scope, { ProcessingStatus });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/upload/ProcessingStatus.jsx", error: String((e && e.message) || e) }); }

// components/upload/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProgressBar({
  value = 0,
  indeterminate = false,
  height = 6,
  label,
  meta,
  style,
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'grid',
      gap: 8,
      ...style
    }
  }, rest), label || meta ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-micro)',
      color: 'var(--text-faint)'
    }
  }, meta)) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-inset)',
      overflow: 'hidden',
      border: '1px solid var(--line-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      width: indeterminate ? '38%' : pct + '%',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--primary)',
      transition: 'width var(--dur-slow) var(--ease-calm)'
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/upload/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/voice/LanguageIndicator.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const NATIVE = {
  Hindi: 'हिन्दी',
  Kannada: 'ಕನ್ನಡ',
  Hinglish: 'Hinglish',
  English: 'English',
  Tamil: 'தமிழ்',
  Telugu: 'తెలుగు',
  Marathi: 'मराठी',
  Bengali: 'বাংলা'
};
function LanguageIndicator({
  language = 'Hindi',
  detecting = false,
  onDark = false,
  showNative = true,
  style,
  ...rest
}) {
  const native = NATIVE[language];
  const fg = onDark ? 'rgba(255,255,255,.82)' : 'var(--text-muted)';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      letterSpacing: 'var(--ls-wide)',
      color: fg,
      opacity: detecting ? 0.6 : 1,
      transition: 'opacity var(--dur-base) var(--ease-out)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "languages",
    size: 14,
    strokeWidth: 1.8,
    style: {
      opacity: 0.8
    }
  }), detecting ? 'Listening for your language…' : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--weight-medium)',
      color: onDark ? '#fff' : 'var(--text-body)'
    }
  }, language), showNative && native && native !== language ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-deva)',
      opacity: 0.72
    }
  }, native) : null));
}
Object.assign(__ds_scope, { LanguageIndicator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/voice/LanguageIndicator.jsx", error: String((e && e.message) || e) }); }

// components/voice/MicButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The emotional centre of Poocho. Three states, three different motions:
   idle      — still, warm shadow
   listening — radial pulse whose halo scales with live amplitude
   speaking  — slow breathing halo, no pulse                            */
function MicButton({
  state = 'idle',
  amplitude = 0,
  size = 84,
  onPress,
  onRelease,
  disabled = false,
  style,
  ...rest
}) {
  const [press, setPress] = React.useState(false);
  const listening = state === 'listening';
  const speaking = state === 'speaking';
  const amp = Math.max(0, Math.min(1, amplitude));
  const ring = listening ? 'var(--state-listening)' : speaking ? 'var(--state-speaking)' : 'transparent';
  const face = listening ? 'var(--state-listening)' : speaking ? 'var(--surface-card)' : 'var(--primary)';
  const fg = listening ? '#3A2405' : speaking ? 'var(--primary-text)' : 'var(--text-on-primary)';
  const glow = listening ? '0 0 0 ' + (8 + amp * 14) + 'px var(--state-listening-glow)' : speaking ? 'var(--glow-speaking)' : 'var(--shadow-lg)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      ...style
    }
  }, listening ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      background: 'var(--state-listening)',
      animation: 'poocho-pulse var(--dur-pulse) var(--ease-out) infinite'
    }
  }) : null, speaking ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: -10,
      borderRadius: '50%',
      background: 'var(--state-speaking)',
      animation: 'poocho-breathe var(--dur-breath) var(--ease-in-out) infinite'
    }
  }) : null, /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    "aria-pressed": listening,
    "aria-label": listening ? 'Listening — release to send' : speaking ? 'Poocho is speaking — tap to interrupt' : 'Hold to ask Poocho',
    onMouseDown: () => {
      setPress(true);
      onPress && onPress();
    },
    onMouseUp: () => {
      setPress(false);
      onRelease && onRelease();
    },
    onMouseLeave: () => setPress(false),
    style: {
      position: 'relative',
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1.5px solid ' + (ring === 'transparent' ? 'rgba(255,255,255,.22)' : ring),
      background: face,
      color: fg,
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: press ? 'var(--shadow-press), 0 1px 2px rgba(0,0,0,.2)' : glow,
      transform: press ? 'translateY(2px) scale(.955)' : 'none',
      transition: 'transform var(--dur-instant) var(--ease-tactile), box-shadow var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)'
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: speaking ? 'audio-lines' : 'mic',
    size: Math.round(size * 0.36),
    strokeWidth: 1.6
  })));
}
Object.assign(__ds_scope, { MicButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/voice/MicButton.jsx", error: String((e && e.message) || e) }); }

// components/voice/Waveform.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Waveform({
  levels,
  bars = 28,
  amplitude = 0.5,
  height = 34,
  color = 'var(--state-listening)',
  active = true,
  style,
  ...rest
}) {
  const data = levels && levels.length ? levels : Array.from({
    length: bars
  }, (_, i) => {
    const shape = Math.sin(i / bars * Math.PI); // taper toward the edges
    return 0.14 + shape * amplitude * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.7)));
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    "aria-hidden": "true",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      height,
      ...style
    }
  }, rest), data.map((v, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 3,
      borderRadius: 'var(--radius-pill)',
      background: color,
      height: Math.max(3, Math.min(1, v) * height),
      opacity: active ? 0.55 + Math.min(1, v) * 0.45 : 0.25,
      transition: 'height var(--dur-instant) var(--ease-out), opacity var(--dur-fast) var(--ease-out)'
    }
  })));
}
Object.assign(__ds_scope, { Waveform });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/voice/Waveform.jsx", error: String((e && e.message) || e) }); }

// ui_kits/poocho-app/ChatSidebar.jsx
try { (() => {
const {
  ChatBubble,
  LanguageDivider,
  Icon,
  Badge
} = window.PoochoDesignSystem_14960d;
function ChatSidebar({
  turns,
  streaming,
  animChip,
  onJump
}) {
  const scroller = React.useRef(null);
  React.useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns.length, streaming && streaming.a]);
  const rows = [];
  let lastLang = null;
  turns.forEach(t => {
    if (t.lang !== lastLang) {
      rows.push({
        kind: 'divider',
        lang: t.lang,
        key: 'd' + t.id
      });
      lastLang = t.lang;
    }
    rows.push({
      kind: 'turn',
      turn: t,
      key: 't' + t.id
    });
  });
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      background: 'var(--surface-card)',
      border: '1px solid var(--line-soft)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      padding: '16px 18px',
      borderBottom: '1px solid var(--line-soft)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-strong)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-circle-question-mark",
    size: 16,
    style: {
      color: 'var(--text-faint)'
    }
  }), "Your questions"), /*#__PURE__*/React.createElement(Badge, null, turns.length)), /*#__PURE__*/React.createElement("div", {
    ref: scroller,
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      padding: 18,
      display: 'grid',
      gap: 12,
      alignContent: 'start'
    }
  }, turns.length === 0 && !streaming ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'auto',
      textAlign: 'center',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-faint)',
      maxWidth: '26ch'
    }
  }, "Press the mic and ask Poocho anything.") : null, rows.map(r => r.kind === 'divider' ? /*#__PURE__*/React.createElement(LanguageDivider, {
    key: r.key,
    language: r.lang
  }) : /*#__PURE__*/React.createElement(React.Fragment, {
    key: r.key
  }, /*#__PURE__*/React.createElement(ChatBubble, {
    role: "question",
    text: r.turn.q,
    interrupted: r.turn.interrupted
  }), /*#__PURE__*/React.createElement(ChatBubble, {
    role: "answer",
    text: r.turn.a,
    timestamp: r.turn.t,
    interrupted: r.turn.interrupted,
    chipAnimate: animChip === r.turn.id,
    onJump: onJump
  }))), streaming ? /*#__PURE__*/React.createElement(React.Fragment, null, streaming.showDivider ? /*#__PURE__*/React.createElement(LanguageDivider, {
    language: streaming.lang
  }) : null, /*#__PURE__*/React.createElement(ChatBubble, {
    role: "question",
    text: streaming.q
  }), streaming.a ? /*#__PURE__*/React.createElement(ChatBubble, {
    role: "answer",
    text: streaming.a,
    streaming: true
  }) : null) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 18px',
      borderTop: '1px solid var(--line-soft)',
      fontSize: 'var(--text-micro)',
      letterSpacing: 'var(--ls-wide)',
      color: 'var(--text-faint)',
      display: 'flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mic",
    size: 13
  }), " Voice only \u2014 hold the mic to ask"));
}
Object.assign(window, {
  ChatSidebar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/poocho-app/ChatSidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/poocho-app/Landing.jsx
try { (() => {
const {
  Logo,
  Watermark,
  Button,
  Card,
  DropZone,
  Icon,
  IconButton
} = window.PoochoDesignSystem_14960d;
function TopBar({
  dark,
  onToggleTheme,
  right
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'relative',
      zIndex: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '20px clamp(20px,4vw,44px)'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 22
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, right, /*#__PURE__*/React.createElement(IconButton, {
    icon: dark ? 'sun' : 'moon',
    label: dark ? 'Light mode' : 'Dark mode',
    onClick: onToggleTheme
  })));
}
const WHY = [{
  icon: 'languages',
  title: 'The lecture is in English',
  body: 'Almost every good engineering and NEET lecture online is. That is not going to change soon.'
}, {
  icon: 'message-circle-question-mark',
  title: 'The student thinks in Hindi',
  body: 'Or Kannada, or Hinglish. Understanding and asking are two different skills, in two different languages.'
}, {
  icon: 'sparkles',
  title: 'The moment of confusion is short',
  body: 'It lasts about eight seconds before a student scrubs back, gives up, or opens another tab. Poocho fits inside it.'
}];
function Landing({
  dark,
  onToggleTheme,
  onStart
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    dark: dark,
    onToggleTheme: onToggleTheme
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      width: '100%',
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '0 clamp(20px,4vw,44px) 96px'
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      paddingTop: 'clamp(40px,7vw,88px)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Watermark, {
    size: 200,
    opacity: dark ? 0.08 : 0.05,
    color: "var(--primary)",
    style: {
      top: 120,
      left: 'auto',
      right: 8,
      transform: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 780
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-display-1)',
      lineHeight: 'var(--lh-display)',
      letterSpacing: 'var(--ls-display)',
      color: 'var(--text-strong)'
    }
  }, "The video that answers back."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 22,
      maxWidth: '48ch',
      fontSize: 'var(--text-lg)',
      lineHeight: 1.6,
      color: 'var(--text-muted)'
    }
  }, "Ask any English lecture a question in your own language. Poocho answers in yours.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 'clamp(32px,5vw,56px)',
      maxWidth: 820
    }
  }, /*#__PURE__*/React.createElement(DropZone, {
    onFiles: onStart,
    onLink: onStart
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 'var(--section-y)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
      gap: 20
    }
  }, WHY.map(w => /*#__PURE__*/React.createElement(Card, {
    key: w.title,
    padding: 28,
    interactive: true,
    style: {
      display: 'grid',
      gap: 14,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-md)',
      background: 'var(--accent-soft)',
      border: '1px solid var(--accent-soft-line)',
      color: 'var(--accent-text)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: w.icon,
    size: 19
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-medium)',
      letterSpacing: 'var(--ls-tight)'
    }
  }, w.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      lineHeight: 1.65,
      color: 'var(--text-muted)'
    }
  }, w.body)))))), /*#__PURE__*/React.createElement("footer", {
    style: {
      padding: '0 clamp(20px,4vw,44px) 40px',
      display: 'flex',
      justifyContent: 'space-between',
      gap: 16,
      fontSize: 'var(--text-xs)',
      color: 'var(--text-faint)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Poocho \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "deva"
  }, "\u092A\u0942\u091B\u094B"), " \u2014 \u201Cask\u201D"), /*#__PURE__*/React.createElement("span", null, "Hindi \xB7 Kannada \xB7 Hinglish")));
}
Object.assign(window, {
  Landing,
  TopBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/poocho-app/Landing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/poocho-app/Processing.jsx
try { (() => {
const {
  Watermark,
  ProgressBar,
  ProcessingStatus,
  Badge,
  Button
} = window.PoochoDesignSystem_14960d;
function VideoPoster({
  width = 208,
  radius = 'var(--radius-md)',
  label = '16:9 poster frame'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width,
      aspectRatio: '16 / 9',
      borderRadius: radius,
      overflow: 'hidden',
      border: '1px solid var(--line-soft)',
      boxShadow: 'var(--shadow-md)',
      background: 'linear-gradient(150deg,#16302C,#0C1817)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(242,239,233,.5)'
    }
  }, /*#__PURE__*/React.createElement(Watermark, {
    size: width * 0.62,
    opacity: 0.12,
    color: "#EFB363"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      fontSize: 10,
      letterSpacing: '.09em',
      textTransform: 'uppercase'
    }
  }, label));
}
function Processing({
  phase,
  progress,
  data
}) {
  const uploading = phase === 'uploading';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      minHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40
    }
  }, /*#__PURE__*/React.createElement(Watermark, {
    size: 560,
    opacity: 0.035,
    color: "var(--primary)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 460,
      display: 'grid',
      gap: 30,
      justifyItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: uploading ? 'neutral' : 'primary',
    dot: true,
    uppercase: true
  }, uploading ? 'Uploading' : 'Transcribing'), /*#__PURE__*/React.createElement(VideoPoster, null), uploading ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      display: 'grid',
      gap: 18,
      justifyItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-lg)',
      color: 'var(--text-strong)',
      letterSpacing: 'var(--ls-tight)'
    }
  }, "Sending your video to Poocho\u2026"), /*#__PURE__*/React.createElement(ProgressBar, {
    style: {
      width: '100%'
    },
    value: progress,
    label: data.video.name,
    meta: Math.round(progress) + '% · ' + data.video.size
  })) : /*#__PURE__*/React.createElement(ProcessingStatus, {
    message: "Teaching Poocho to understand your video\u2026",
    sub: "This takes about a minute. You can keep this tab open.",
    filename: data.video.name,
    duration: "31:04",
    style: {
      gap: 20
    }
  })));
}
Object.assign(window, {
  Processing,
  VideoPoster
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/poocho-app/Processing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/poocho-app/VideoStage.jsx
try { (() => {
const {
  VideoTimeline,
  PlayerControls,
  MicButton,
  Waveform,
  LanguageIndicator,
  Watermark,
  Badge
} = window.PoochoDesignSystem_14960d;
function VideoStage({
  title,
  duration,
  position,
  playing,
  markers,
  flashAt,
  micState,
  amplitude,
  onSeek,
  onMarkerClick,
  onTogglePlay,
  onSkip,
  onMicDown,
  onMicUp,
  language
}) {
  const [pulse, setPulse] = React.useState(false);
  const tap = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 260);
    onTogglePlay();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-video)',
      overflow: 'hidden',
      background: '#0A1413',
      boxShadow: 'var(--shadow-lg)',
      aspectRatio: '16 / 9',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: tap,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(155deg,#17322D 0%,#0C1817 62%,#0A1413 100%)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Watermark, {
    size: 300,
    opacity: 0.07,
    color: "#EFB363"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 20,
      top: 18,
      fontSize: 'var(--text-xs)',
      color: 'rgba(242,239,233,.55)',
      letterSpacing: 'var(--ls-wide)'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '42%',
      transform: 'translate(-50%,-50%) scale(' + (pulse ? 1.18 : 0.9) + ')',
      opacity: pulse ? 0.9 : 0,
      transition: 'transform var(--dur-base) var(--ease-tactile), opacity var(--dur-base) var(--ease-out)',
      width: 74,
      height: 74,
      borderRadius: '50%',
      background: 'rgba(255,255,255,.14)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: '.1em',
      textTransform: 'uppercase'
    }
  }, playing ? 'Play' : 'Pause'))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      bottom: 104,
      transform: 'translateX(-50%)',
      display: 'grid',
      justifyItems: 'center',
      gap: 12,
      zIndex: 2
    }
  }, micState !== 'idle' ? /*#__PURE__*/React.createElement(Waveform, {
    amplitude: micState === 'listening' ? amplitude : 0.42,
    height: 26,
    color: micState === 'listening' ? 'var(--state-listening)' : 'var(--state-speaking)'
  }) : null, /*#__PURE__*/React.createElement(MicButton, {
    state: micState,
    amplitude: amplitude,
    size: 84,
    onPress: onMicDown,
    onRelease: onMicUp
  }), micState === 'speaking' ? /*#__PURE__*/React.createElement(Badge, {
    tone: "primary",
    dot: true
  }, "Poocho is speaking") : /*#__PURE__*/React.createElement(LanguageIndicator, {
    language: language,
    detecting: micState === 'listening' && !language,
    onDark: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: '52px 16px 12px',
      background: 'var(--scrim-video)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: 'auto'
    }
  }, /*#__PURE__*/React.createElement(VideoTimeline, {
    duration: duration,
    position: position,
    buffered: duration * 0.82,
    markers: markers,
    flashAt: flashAt,
    onSeek: onSeek,
    onMarkerClick: onMarkerClick
  }), /*#__PURE__*/React.createElement(PlayerControls, {
    playing: playing,
    position: position,
    duration: duration,
    onTogglePlay: onTogglePlay,
    onSkip: onSkip
  }))));
}
Object.assign(window, {
  VideoStage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/poocho-app/VideoStage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/poocho-app/Watch.jsx
try { (() => {
const {
  Button,
  Badge
} = window.PoochoDesignSystem_14960d;
function Watch({
  dark,
  onToggleTheme,
  onRestart,
  data
}) {
  const D = data.video.duration;
  const [position, setPosition] = React.useState(742);
  const [playing, setPlaying] = React.useState(true);
  const [turns, setTurns] = React.useState(data.turns.slice(0, 3));
  const [micState, setMic] = React.useState('idle');
  const [amplitude, setAmp] = React.useState(0);
  const [streaming, setStreaming] = React.useState(null);
  const [flashAt, setFlash] = React.useState(null);
  const [animChip, setAnimChip] = React.useState(null);
  const [language, setLanguage] = React.useState('Hindi');
  const timers = React.useRef([]);
  const after = (ms, fn) => {
    timers.current.push(setTimeout(fn, ms));
  };
  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
  React.useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setPosition(p => p + 1 > D ? 0 : p + 1), 1000);
    return () => clearInterval(t);
  }, [playing, D]);
  React.useEffect(() => {
    if (micState !== 'listening') {
      setAmp(0);
      return;
    }
    const t = setInterval(() => setAmp(0.25 + Math.random() * 0.7), 180);
    return () => clearInterval(t);
  }, [micState]);
  const jumpTo = (seconds, turnId) => {
    setPosition(seconds);
    setFlash(seconds);
    setAnimChip(turnId != null ? turnId : (turns.find(t => t.t === seconds) || {}).id);
    after(1150, () => {
      setFlash(null);
      setAnimChip(null);
    });
  };
  const nextTurn = data.turns[turns.length] || data.turns[data.turns.length - 1];
  const startTurn = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (micState === 'speaking') {
      // barge-in: grey out the turn being spoken and begin a new one
      setStreaming(null);
      setTurns(ts => ts.map((t, i) => i === ts.length - 1 ? {
        ...t,
        interrupted: true
      } : t));
    }
    setMic('listening');
    setLanguage(nextTurn.lang);
    setStreaming({
      q: '',
      a: '',
      lang: nextTurn.lang,
      showDivider: nextTurn.lang !== (turns[turns.length - 1] || {}).lang
    });
  };
  const endTurn = () => {
    if (micState !== 'listening') return;
    const turn = nextTurn;
    // transcript arrives
    setStreaming(s => ({
      ...s,
      q: turn.q
    }));
    setMic('speaking');
    // answer streams in word by word
    const words = turn.a.split(' ');
    words.forEach((w, i) => after(90 + i * 55, () => setStreaming(s => s ? {
      ...s,
      a: words.slice(0, i + 1).join(' ')
    } : s)));
    const total = 90 + words.length * 55;
    after(total + 260, () => jumpTo(turn.t, turn.id));
    after(total + 620, () => {
      setStreaming(null);
      setMic('idle');
      setTurns(ts => ts.some(t => t.id === turn.id) ? ts : ts.concat(turn));
    });
  };
  const markers = turns.concat(streaming && streaming.q ? [] : []).map(t => ({
    id: t.id,
    time: t.t,
    label: t.lang
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    dark: dark,
    onToggleTheme: onToggleTheme,
    right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "Ready"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      icon: "rotate-ccw",
      onClick: onRestart
    }, "New video"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: 'grid',
      gridTemplateColumns: 'minmax(0,var(--watch-main)) minmax(var(--sidebar-min),var(--watch-side))',
      gap: 20,
      padding: '0 clamp(16px,3vw,32px) clamp(16px,3vw,28px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(VideoStage, {
    title: data.video.title,
    duration: D,
    position: position,
    playing: playing,
    markers: markers,
    flashAt: flashAt,
    micState: micState,
    amplitude: amplitude,
    language: language,
    onSeek: setPosition,
    onMarkerClick: m => jumpTo(m.time, m.id),
    onTogglePlay: () => setPlaying(p => !p),
    onSkip: d => setPosition(p => Math.max(0, Math.min(D, p + d))),
    onMicDown: startTurn,
    onMicUp: endTurn
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-faint)'
    }
  }, "Hold the mic to ask. Speak while Poocho answers to interrupt \u2014 the greyed turn stays in your journal.")), /*#__PURE__*/React.createElement(ChatSidebar, {
    turns: turns,
    streaming: streaming,
    animChip: animChip,
    onJump: s => jumpTo(s)
  })));
}
Object.assign(window, {
  Watch
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/poocho-app/Watch.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Watermark = __ds_scope.Watermark;

__ds_ns.ChatBubble = __ds_scope.ChatBubble;

__ds_ns.LanguageDivider = __ds_scope.LanguageDivider;

__ds_ns.TimestampChip = __ds_scope.TimestampChip;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.ICONS = __ds_scope.ICONS;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.PlayerControls = __ds_scope.PlayerControls;

__ds_ns.VideoTimeline = __ds_scope.VideoTimeline;

__ds_ns.DropZone = __ds_scope.DropZone;

__ds_ns.ProcessingStatus = __ds_scope.ProcessingStatus;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.LanguageIndicator = __ds_scope.LanguageIndicator;

__ds_ns.MicButton = __ds_scope.MicButton;

__ds_ns.Waveform = __ds_scope.Waveform;

})();


export default window.PoochoDesignSystem_14960d;
