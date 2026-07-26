import React from 'react';
import TopBar from '../TopBar.jsx';
import { Watermark, DropZone, Card, Icon } from '../ds.js';

const WHY = [
  { icon: 'languages', title: 'The lecture is in English', body: 'Almost every good engineering and NEET lecture online is. That is not going to change soon.' },
  { icon: 'message-circle-question-mark', title: 'The student thinks in Hindi', body: 'Or Kannada, or Hinglish. Understanding and asking are two different skills, in two different languages.' },
  { icon: 'sparkles', title: 'The moment of confusion is short', body: 'It lasts about eight seconds before a student scrubs back, gives up, or opens another tab. Poocho fits inside it.' },
];

export default function Landing({ dark, onToggleTheme, onStart }) {
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar dark={dark} onToggleTheme={onToggleTheme} />
      <main style={{ flex: 1, width: '100%', maxWidth: 'var(--page-max)', margin: '0 auto', padding: '0 clamp(20px,4vw,44px) 96px' }}>
        <section style={{ position: 'relative', paddingTop: 'clamp(40px,7vw,88px)', overflow: 'hidden' }}>
          <Watermark size={200} opacity={dark ? 0.08 : 0.05} color="var(--primary)" style={{ top: 120, left: 'auto', right: 8, transform: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 780 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display-1)', lineHeight: 'var(--lh-display)', letterSpacing: 'var(--ls-display)', color: 'var(--text-strong)' }}>
              The video that answers back.
            </h1>
            <p style={{ marginTop: 22, maxWidth: '48ch', fontSize: 'var(--text-lg)', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              Ask any English lecture a question in your own language. Poocho answers in yours.
            </p>
          </div>
          <div style={{ position: 'relative', marginTop: 'clamp(32px,5vw,56px)', maxWidth: 820 }}>
            <DropZone onFiles={onStart} onLink={onStart} />
          </div>
        </section>

        <section style={{ marginTop: 'var(--section-y)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {WHY.map((w) => (
              <Card key={w.title} padding={28} interactive style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', border: '1px solid var(--accent-soft-line)', color: 'var(--accent-text)' }}>
                  <Icon name={w.icon} size={19} />
                </span>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-medium)', letterSpacing: 'var(--ls-tight)' }}>{w.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.65, color: 'var(--text-muted)' }}>{w.body}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <footer style={{ padding: '0 clamp(20px,4vw,44px) 40px', display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 'var(--text-xs)', color: 'var(--text-faint)' }}>
        <span>Poocho · <span className="deva">पूछो</span> — “ask”</span>
        <span>Hindi · Kannada · Hinglish</span>
      </footer>
    </div>
  );
}
