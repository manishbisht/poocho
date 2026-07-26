import React from 'react';
import { Icon, Badge, LanguageDivider, ChatBubble } from '../ds.js';

// The study journal: question/answer turns grouped by language, an empty
// prompt, and a live streaming turn while Poocho answers.
export default function ChatSidebar({ turns, streaming, animChip, onJump, errorMessage, onClearError }) {
  const scroller = React.useRef(null);
  React.useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns.length, streaming && streaming.a]);

  const rows = [];
  let lastLang = null;
  turns.forEach((t) => {
    if (t.lang !== lastLang) { rows.push({ kind: 'divider', lang: t.lang, key: 'd' + t.id }); lastLang = t.lang; }
    rows.push({ kind: 'turn', turn: t, key: 't' + t.id });
  });

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--surface-card)', border: '1px solid var(--line-soft)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '16px 18px', borderBottom: '1px solid var(--line-soft)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--text-strong)' }}>
          <Icon name="message-circle-question-mark" size={16} style={{ color: 'var(--text-faint)' }} />
          Your questions
        </span>
        <Badge>{turns.length}</Badge>
      </div>

      {errorMessage ? (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          margin: '18px 18px 0',
          padding: '12px 14px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: 'var(--radius-md, 8px)',
          color: '#ef4444',
          fontSize: 'var(--text-sm)',
          position: 'relative',
          animation: 'poocho-rise var(--dur-base) var(--ease-out) 1'
        }}>
          <span style={{ fontSize: 16, lineHeight: 1, marginTop: 1 }}>⚠️</span>
          <div style={{ flex: 1, paddingRight: 20, lineHeight: 1.4 }}>
            <strong style={{ fontWeight: 'var(--weight-semibold, 600)', display: 'block', marginBottom: 2 }}>Error</strong>
            {errorMessage}
          </div>
          <button
            onClick={onClearError}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              opacity: 0.7,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              borderRadius: '50%'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
          >
            <Icon name="x" size={12} />
          </button>
        </div>
      ) : null}

      <div ref={scroller} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'grid', gap: 12, alignContent: 'start' }}>
        {turns.length === 0 && !streaming ? (
          <p style={{ margin: 'auto', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-faint)', maxWidth: '26ch' }}>
            Press the mic and ask Poocho anything.
          </p>
        ) : null}

        {rows.map((r) => r.kind === 'divider'
          ? <LanguageDivider key={r.key} language={r.lang} />
          : (
            <React.Fragment key={r.key}>
              {r.turn.q ? <ChatBubble role="question" text={r.turn.q} interrupted={r.turn.interrupted} /> : null}
              {r.turn.a ? (
                <ChatBubble
                  role="answer" text={r.turn.a} timestamp={r.turn.t}
                  interrupted={r.turn.interrupted}
                  chipAnimate={animChip === r.turn.id}
                  onJump={onJump}
                />
              ) : null}
            </React.Fragment>
          ))}

        {streaming ? (
          <React.Fragment>
            {streaming.showDivider ? <LanguageDivider language={streaming.lang} /> : null}
            <ChatBubble role="question" text={streaming.q} />
            <ChatBubble role="answer" text={streaming.a} streaming />
          </React.Fragment>
        ) : null}
      </div>

      <div style={{ padding: '12px 18px', borderTop: '1px solid var(--line-soft)', fontSize: 'var(--text-micro)', letterSpacing: 'var(--ls-wide)', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: 7 }}>
        <Icon name="mic" size={13} /> Voice only — hold the mic to ask
      </div>
    </aside>
  );
}
