import React from 'react';
import TopBar from '../TopBar.jsx';
import { Watermark, DropZone, Card, Icon } from '../ds.js';

const WHY = [
  {
    icon: 'languages',
    title: 'The lecture is in English',
    rubric: 'Impact · 1.5×',
    body: "Almost every good engineering and NEET lecture online is. That's not going to change soon — 300M+ Indian students learn from content they only half-understand."
  },
  {
    icon: 'mic',
    title: 'The student thinks in Hindi',
    rubric: 'Voice Experience · 2.5×',
    body: 'Or Kannada, or Hinglish. Poocho hears them all — including code-switched sentences and regional accents. Understanding and asking are two different skills, in two different languages.'
  },
  {
    icon: 'sparkles',
    title: 'The moment of confusion is short',
    rubric: 'Delight · 1×',
    body: 'About eight seconds, before a student scrubs back, gives up, or opens another tab. Poocho fits inside that window with a spoken answer — no typing, no reading.'
  },
  {
    icon: 'check',
    title: 'Answers grounded in the video',
    rubric: 'JTBD Completion · 2.5×',
    body: "Poocho only answers from what's actually in the lecture — with a timestamp. Ask about something the video doesn't cover, and Poocho will say so. No hallucinations, no wrong direction."
  },
  {
    icon: 'skip-forward',
    title: 'The video jumps to the answer',
    rubric: 'Creativity · 1.5×',
    body: 'Dubbing translates a monologue. Poocho makes it a dialogue — pause, ask in your language, and the video seeks to the exact moment your answer lives. A learning tool that watches the video with you.'
  },
  {
    icon: 'message-circle-question-mark',
    title: "Bharat doesn't end at the border",
    rubric: 'Memory & Context · 1×',
    body: "An Indian PhD student in Berlin studying quantum physics in German. A software engineer in Toronto watching French tutorials. Poocho works wherever an Indian is learning in a language that isn't theirs — and remembers every question they've asked along the way."
  }
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
            {WHY.map((w) => (
              <Card key={w.title} padding={28} interactive style={{ display: 'grid', gap: 14, alignContent: 'start', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-soft)', border: '1px solid var(--accent-soft-line)', color: 'var(--accent-text)' }}>
                    <Icon name={w.icon} size={19} />
                  </span>
                  <span style={{ fontSize: 'var(--text-xxs, 10px)', fontWeight: 'var(--weight-bold, 600)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-faint)', background: 'var(--bg-muted, rgba(0,0,0,0.04))', padding: '4px 8px', borderRadius: 'var(--radius-sm, 4px)' }}>
                    {w.rubric}
                  </span>
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-medium)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>{w.title}</h3>
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
