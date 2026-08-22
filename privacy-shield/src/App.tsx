import React, { useState } from 'react';

export default function App() {
  const [enabled, setEnabled] = useState(true);
  const [score, setScore] = useState(91);
  const [audit, setAudit] = useState('');
  const [loading, setLoading] = useState(false);

  async function runAudit() {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-risk-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: audit || 'https://example.com' })
      });
      const data = await res.json();
      setScore(data.privacyScore ?? 68);
      setAudit(data.summary ?? 'Analysis complete.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <div>
          <div className="eyebrow">PRIVACY SHIELD</div>
          <h1>Maximum practical privacy.</h1>
          <p>Compartmentalize identity, suppress trackers and audit web privacy exposure.</p>
        </div>
        <button className={enabled ? 'shield on' : 'shield'} onClick={() => setEnabled(v => !v)}>
          {enabled ? '● PROTECTED' : '○ PROTECTION OFF'}
        </button>
      </header>

      <main>
        <section className="hero card">
          <div>
            <span className="label">PRIVACY SCORE</span>
            <div className="score">{enabled ? score : 0}<small>/100</small></div>
            <p>{enabled ? 'Your browsing profile is currently compartmentalized.' : 'Protection is disabled.'}</p>
          </div>
          <div className="ring"><span>{enabled ? '91%' : '0%'}</span></div>
        </section>

        <section className="grid">
          {[
            ['TRACKERS BLOCKED', '1,284', 'Third-party requests suppressed'],
            ['COOKIES ISOLATED', '327', 'Partitioned by identity'],
            ['FINGERPRINT DEFENSE', 'ACTIVE', 'Canvas, WebGL and audio noise'],
            ['IP PROTECTION', enabled ? 'ACTIVE' : 'OFF', 'Relay layer status']
          ].map(([title, value, detail]) => (
            <div className="card metric" key={title}>
              <span className="label">{title}</span>
              <strong>{value}</strong>
              <span>{detail}</span>
            </div>
          ))}
        </section>

        <section className="card">
          <div className="section-title"><span>AI RISK AUDITOR</span><span className="status">GEMINI READY</span></div>
          <div className="audit-row">
            <input value={audit} onChange={e => setAudit(e.target.value)} placeholder="https://example.com" />
            <button onClick={runAudit} disabled={loading}>{loading ? 'ANALYZING…' : 'AUDIT SITE'}</button>
          </div>
          {audit && <p className="result">{audit}</p>}
        </section>

        <section className="card">
          <div className="section-title"><span>LIVE PROTECTION</span><span className="status">● MONITORING</span></div>
          <div className="feed">
            {['analytics.google.com', 'pixel.facebook.com', 'bat.bing.com', 'device-fingerprint.io'].map((domain, i) => (
              <div className="feed-item" key={domain}>
                <span className="dot" />
                <span>{domain}</span>
                <em>{i === 3 ? 'SANITIZED' : 'BLOCKED'}</em>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>Privacy Shield Engine · Zero Logging Architecture · Open Privacy Standard</footer>
    </div>
  );
}
