import { useState } from 'react';

export default function Settings() {
  const [dataSource, setDataSource] = useState('all');
  const [demoMode, setDemoMode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [sentimentThreshold, setSentimentThreshold] = useState(25);
  const [alertThreshold, setAlertThreshold] = useState(40);
  const [analysisPeriod, setAnalysisPeriod] = useState('7');

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Settings</h1>
          <p>Configure your SocialSense AI workspace</p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Settings saved successfully!')}>
          Save Changes
        </button>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* Data Sources */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Data Sources</div>
            </div>
            <div className="card-body">
              <div className="settings-section-title">Platform Selection</div>
              <div className="radio-group">
                {[
                  { value: 'twitter', label: 'Twitter / X', desc: 'Real-time tweets, trends, and network data' },
                  { value: 'instagram', label: 'Instagram', desc: 'Reels, posts, comments, and visual creator insights' },
                  { value: 'telegram', label: 'Telegram', desc: 'Channel posts, group discussions, and messages' },
                  { value: 'all', label: 'All Platforms', desc: 'Combined analysis from all connected sources' },
                ].map(opt => (
                  <label key={opt.value} className={`radio-option ${dataSource === opt.value ? 'selected' : ''}`}>
                    <input type="radio" name="platform" value={opt.value} checked={dataSource === opt.value} onChange={() => setDataSource(opt.value)} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Configuration */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Analysis Configuration</div>
            </div>
            <div className="card-body">
              <div className="settings-section-title">Analysis Period</div>
              <select
                className="select-control"
                value={analysisPeriod}
                onChange={e => setAnalysisPeriod(e.target.value)}
                style={{ marginBottom: 20, width: '100%' }}
              >
                <option value="1">Last 24 Hours</option>
                <option value="7">Last 7 Days</option>
                <option value="14">Last 14 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>

              <div className="settings-section-title">Sentiment Alert Threshold</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <input
                  type="range" min="5" max="80" value={sentimentThreshold}
                  className="range-slider" style={{ flex: 1 }}
                  onChange={e => setSentimentThreshold(Number(e.target.value))}
                />
                <span style={{ fontWeight: 700, fontSize: 14, minWidth: 40, textAlign: 'right' }}>{sentimentThreshold}%</span>
              </div>

              <div className="settings-section-title">Alert Threshold (Trend Growth)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="range" min="10" max="100" value={alertThreshold}
                  className="range-slider" style={{ flex: 1 }}
                  onChange={e => setAlertThreshold(Number(e.target.value))}
                />
                <span style={{ fontWeight: 700, fontSize: 14, minWidth: 40, textAlign: 'right' }}>{alertThreshold}%</span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Preferences</div>
            </div>
            <div className="card-body">
              {[
                { label: 'Demo Mode', desc: 'Use simulated data for presentation', state: demoMode, set: setDemoMode },
                { label: 'Auto-Refresh', desc: 'Automatically refresh data every 5 minutes', state: autoRefresh, set: setAutoRefresh },
                { label: 'Email Alerts', desc: 'Receive critical alerts via email', state: emailAlerts, set: setEmailAlerts },
              ].map((pref, i) => (
                <div key={i} className="settings-row">
                  <div>
                    <div className="settings-label">{pref.label}</div>
                    <div className="settings-desc">{pref.desc}</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={pref.state} onChange={e => pref.set(e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Privacy */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Security & Privacy</div>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                All data processing meets enterprise security standards.
              </div>
              {[
                { label: 'Data Anonymization', desc: 'All PII is automatically removed from analysis' },
                { label: 'Secure Data Processing', desc: 'End-to-end encrypted data pipeline' },
                { label: 'Access Control', desc: 'Role-based access with audit trail' },
                { label: 'Audit Logging', desc: 'Full activity logs with 90-day retention' },
              ].map((item, i) => (
                <div key={i} className="security-check">
                  <span className="security-check-icon" style={{ color: 'var(--color-positive)', fontWeight: 700 }}>+</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* About */}
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #6366f1, #22d3ee)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
              SS
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>SocialSense AI</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                "Turning Social Data Into Actionable Intelligence"
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Version 1.0.0 · Demo Build · Smart India Hackathon 2026
              </div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 'var(--radius-full)' }}>
                <div style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#059669' }}>System Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
