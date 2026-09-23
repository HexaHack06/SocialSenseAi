import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../App';
import {
  getApiBaseUrl, checkBackendHealth,
  syncTelegramUpdates, importTwitterDataset,
  PROD_API_URL, DEV_API_URL,
} from '../config/api';

export default function Settings() {
  const { backendStatus, setBackendStatus, pingBackend } = useApp();

  // ── Preferences (persisted to localStorage) ──────────────────
  const [dataSource, setDataSource] = useState(
    () => localStorage.getItem('ss_platform') || 'all'
  );
  const [autoRefresh, setAutoRefresh] = useState(
    () => localStorage.getItem('ss_auto_refresh') !== 'false'
  );
  const [emailAlerts, setEmailAlerts] = useState(
    () => localStorage.getItem('ss_email_alerts') === 'true'
  );
  const [sentimentThreshold, setSentimentThreshold] = useState(
    () => Number(localStorage.getItem('ss_sentiment_threshold') || 25)
  );
  const [alertThreshold, setAlertThreshold] = useState(
    () => Number(localStorage.getItem('ss_alert_threshold') || 40)
  );
  const [analysisPeriod, setAnalysisPeriod] = useState(
    () => localStorage.getItem('ss_analysis_period') || '7'
  );

  // ── Backend switcher ─────────────────────────────────────────
  const [selectedServer, setSelectedServer] = useState(
    () => localStorage.getItem('ss_api_url') || DEV_API_URL
  );
  const [customUrl, setCustomUrl] = useState('');
  const [healthResult, setHealthResult] = useState(null);
  const [healthChecking, setHealthChecking] = useState(false);

  const handleTestConnection = useCallback(async (url) => {
    const target = url || selectedServer;
    setHealthChecking(true);
    setHealthResult(null);
    const result = await checkBackendHealth(target);
    setHealthResult(result);
    setHealthChecking(false);
  }, [selectedServer]);

  const handleApplyServer = () => {
    const url = customUrl.trim() || selectedServer;
    localStorage.setItem('ss_api_url', url);
    setSelectedServer(url);
    setCustomUrl('');
    // Trigger global ping to update sidebar status
    pingBackend();
    alert(`Backend switched to: ${url}\nRefresh the page to fully apply.`);
  };

  // ── Telegram Sync ─────────────────────────────────────────────
  const [telegramStatus, setTelegramStatus] = useState(null);
  const [telegramLoading, setTelegramLoading] = useState(false);

  const handleTelegramSync = useCallback(async () => {
    setTelegramLoading(true);
    setTelegramStatus(null);
    try {
      const data = await syncTelegramUpdates();
      setTelegramStatus({ ok: true, msg: `Sync complete. Messages ingested: ${data?.messagesIngested ?? 'N/A'}` });
    } catch (err) {
      setTelegramStatus({ ok: false, msg: err.message });
    } finally {
      setTelegramLoading(false);
    }
  }, []);

  // ── Dataset Import ────────────────────────────────────────────
  const [importStatus, setImportStatus] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  const handleImportDataset = useCallback(async () => {
    setImportLoading(true);
    setImportStatus(null);
    try {
      const data = await importTwitterDataset();
      setImportStatus({ ok: true, msg: `Import complete. Records imported: ${data?.imported ?? data?.count ?? 'N/A'}` });
    } catch (err) {
      setImportStatus({ ok: false, msg: err.message });
    } finally {
      setImportLoading(false);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('ss_platform', dataSource);
    localStorage.setItem('ss_auto_refresh', autoRefresh);
    localStorage.setItem('ss_email_alerts', emailAlerts);
    localStorage.setItem('ss_sentiment_threshold', sentimentThreshold);
    localStorage.setItem('ss_alert_threshold', alertThreshold);
    localStorage.setItem('ss_analysis_period', analysisPeriod);
    alert('Settings saved successfully!');
  };

  // ── Status helpers ────────────────────────────────────────────
  const isCloud = backendStatus?.serverUrl?.includes('onrender.com');
  const statusDot = backendStatus?.ok == null
    ? '#6b7280'
    : backendStatus.ok ? '#10b981' : '#ef4444';
  const statusText = backendStatus?.ok == null
    ? 'Checking...'
    : backendStatus.ok
      ? `Connected · ${backendStatus.latencyMs}ms (${isCloud ? 'Cloud · Render' : 'Local · localhost'})`
      : `Offline — ${backendStatus.error ?? 'unreachable'}`;

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Settings</h1>
          <p>Configure your SocialSense AI workspace</p>
        </div>
        <div className="header-controls">
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>

      <div className="page-body">
        <div className="dashboard-grid grid-2col">

          {/* ── Data Sources ── */}
          <div className="card">
            <div className="card-header"><div className="card-title">Data Sources</div></div>
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

          {/* ── Analysis Configuration ── */}
          <div className="card">
            <div className="card-header"><div className="card-title">Analysis Configuration</div></div>
            <div className="card-body">
              <div className="settings-section-title">Analysis Period</div>
              <select className="select-control" value={analysisPeriod} onChange={e => setAnalysisPeriod(e.target.value)} style={{ marginBottom: 20, width: '100%' }}>
                <option value="1">Last 24 Hours</option>
                <option value="7">Last 7 Days</option>
                <option value="14">Last 14 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>

              <div className="settings-section-title">Sentiment Alert Threshold</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <input type="range" min="5" max="80" value={sentimentThreshold} className="range-slider" style={{ flex: 1 }} onChange={e => setSentimentThreshold(Number(e.target.value))} />
                <span style={{ fontWeight: 700, fontSize: 14, minWidth: 40, textAlign: 'right' }}>{sentimentThreshold}%</span>
              </div>

              <div className="settings-section-title">Alert Threshold (Trend Growth)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="range" min="10" max="100" value={alertThreshold} className="range-slider" style={{ flex: 1 }} onChange={e => setAlertThreshold(Number(e.target.value))} />
                <span style={{ fontWeight: 700, fontSize: 14, minWidth: 40, textAlign: 'right' }}>{alertThreshold}%</span>
              </div>
            </div>
          </div>

          {/* ── Preferences ── */}
          <div className="card">
            <div className="card-header"><div className="card-title">Preferences</div></div>
            <div className="card-body">
              {[
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

          {/* ── Security & Privacy ── */}
          <div className="card">
            <div className="card-header"><div className="card-title">Security &amp; Privacy</div></div>
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

        {/* ── Backend Connection Monitor ── */}
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <div className="card-title">🔗 Backend Connection Monitor</div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Live server health &amp; switching</span>
          </div>
          <div className="card-body">
            {/* Current status */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
              padding: '12px 16px', background: 'var(--surface-2)',
              borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusDot, animation: backendStatus?.ok ? 'pulse 2s infinite' : 'none', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{statusText}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{backendStatus?.serverUrl}</div>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }} onClick={pingBackend} disabled={backendStatus?.checking}>
                {backendStatus?.checking ? 'Checking...' : 'Refresh'}
              </button>
            </div>

            {/* Server switcher */}
            <div className="settings-section-title">Switch Backend Server</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
              {[
                { label: '🏠 Local (localhost:5000)', url: DEV_API_URL },
                { label: '☁️ Cloud (Render)', url: PROD_API_URL },
              ].map(opt => (
                <label key={opt.url} className={`radio-option ${selectedServer === opt.url ? 'selected' : ''}`}
                  style={{ flex: 1, minWidth: 180, cursor: 'pointer' }}>
                  <input type="radio" name="server" value={opt.url} checked={selectedServer === opt.url} onChange={() => setSelectedServer(opt.url)} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{opt.url}</div>
                  </div>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Or enter custom URL (e.g. http://192.168.1.5:5000)"
                value={customUrl}
                onChange={e => setCustomUrl(e.target.value)}
                style={{
                  flex: 1, minWidth: 220, padding: '8px 12px', fontSize: 12,
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', outline: 'none'
                }}
              />
              <button className="btn btn-secondary" onClick={() => handleTestConnection(customUrl || selectedServer)} disabled={healthChecking}>
                {healthChecking ? 'Testing...' : 'Test Connection'}
              </button>
              <button className="btn btn-primary" onClick={handleApplyServer}>Apply</button>
            </div>
            {healthResult && (
              <div style={{
                padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: 12,
                background: healthResult.ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${healthResult.ok ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                color: healthResult.ok ? '#059669' : '#ef4444',
              }}>
                {healthResult.ok
                  ? `✅ Connected to ${healthResult.serverUrl} — ${healthResult.latencyMs}ms`
                  : `❌ Cannot reach ${healthResult.serverUrl}: ${healthResult.error}`}
              </div>
            )}
          </div>
        </div>

        {/* ── Data Ingestion Actions ── */}
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <div className="card-title">📡 Data Ingestion &amp; Integration</div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Trigger data sync and dataset import operations</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>

              {/* Telegram Sync */}
              <div style={{ flex: 1, minWidth: 260, padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>✈️</span>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Telegram Bot Sync</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                  Fetch latest messages from your configured Telegram bot and store them in MongoDB for analysis.
                  Requires <code>TELEGRAM_BOT_TOKEN</code> in backend .env.
                </div>
                <button
                  id="telegram-sync-btn"
                  className="btn btn-secondary"
                  onClick={handleTelegramSync}
                  disabled={telegramLoading}
                  style={{ width: '100%' }}
                >
                  {telegramLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'currentColor', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                      Syncing...
                    </span>
                  ) : '⚡ Sync Telegram Messages'}
                </button>
                {telegramStatus && (
                  <div style={{
                    marginTop: 10, padding: '8px 10px', borderRadius: 6, fontSize: 12,
                    background: telegramStatus.ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                    color: telegramStatus.ok ? '#059669' : '#ef4444',
                    border: `1px solid ${telegramStatus.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  }}>
                    {telegramStatus.ok ? '✅ ' : '⚠️ '}{telegramStatus.msg}
                  </div>
                )}
              </div>

              {/* Dataset Import */}
              <div style={{ flex: 1, minWidth: 260, padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>🐦</span>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Twitter Dataset Import</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                  Trigger a batch import of Twitter / X data from the CSV dataset file on the backend server into MongoDB.
                </div>
                <button
                  id="dataset-import-btn"
                  className="btn btn-secondary"
                  onClick={handleImportDataset}
                  disabled={importLoading}
                  style={{ width: '100%' }}
                >
                  {importLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'currentColor', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                      Importing...
                    </span>
                  ) : '📥 Import Twitter Dataset'}
                </button>
                {importStatus && (
                  <div style={{
                    marginTop: 10, padding: '8px 10px', borderRadius: 6, fontSize: 12,
                    background: importStatus.ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                    color: importStatus.ok ? '#059669' : '#ef4444',
                    border: `1px solid ${importStatus.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  }}>
                    {importStatus.ok ? '✅ ' : '⚠️ '}{importStatus.msg}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-body settings-about-body" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #6366f1, #22d3ee)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
              SS
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>SocialSense AI</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                "Turning Social Data Into Actionable Intelligence"
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Version 1.0.0 · Smart India Hackathon 2026
              </div>
            </div>
            <div className="settings-about-status" style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px',
                background: backendStatus?.ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${backendStatus?.ok ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.2)'}`,
                borderRadius: 'var(--radius-full)'
              }}>
                <div style={{ width: 6, height: 6, background: statusDot, borderRadius: '50%', animation: backendStatus?.ok ? 'pulse 2s infinite' : 'none' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: backendStatus?.ok ? '#059669' : '#ef4444' }}>
                  {backendStatus?.ok ? 'System Operational' : 'Backend Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
