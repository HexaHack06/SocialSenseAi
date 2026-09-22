import { useState, useEffect } from 'react';
import { useApp } from '../App';
import { API_BASE_URL } from '../config/api';

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  } catch {
    // fallback
  }
  return dateStr;
}

function AlertDetail({ alert, onClose }) {
  if (!alert) return null;
  const details = alert.details && typeof alert.details === 'object' ? Object.entries(alert.details) : [];

  return (
    <div className="topic-panel-overlay" onClick={onClose}>
      <div className="topic-panel" onClick={e => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose}>✕</button>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 12, height: 12, borderRadius: '50%',
              background: alert.severity === 'high' ? '#ef4444' : alert.severity === 'medium' ? '#f59e0b' : '#3b82f6',
              flexShrink: 0
            }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{alert.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{alert.time}</div>
            </div>
          </div>
          <span className={`badge ${alert.severity === 'high' ? 'badge-negative' : alert.severity === 'medium' ? 'badge-neutral' : 'badge-info'}`}>
            {(alert.severity || 'info').toUpperCase()} SEVERITY
          </span>
        </div>

        {alert.description && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Description</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{alert.description}</p>
          </div>
        )}

        {alert.action && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>AI Recommended Action</div>
            <div style={{
              background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 'var(--radius-sm)', padding: '12px 14px',
              fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5
            }}>
              {alert.action}
            </div>
          </div>
        )}

        {details.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Alert Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {details.map(([k, v]) => (
                <div key={k} style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 3 }}>
                    {k.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{String(v)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Alerts() {
  const { platform, setPlatform, setDateRange } = useApp();
  const [startDate, setStartDate] = useState('2022-12-31');
  const [endDate, setEndDate] = useState('2023-05-15');

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const dateError = !startDate || !endDate
    ? 'Please select both From and To dates.'
    : startDate > endDate
      ? 'From date cannot be after To date.'
      : null;

  useEffect(() => {
    if (startDate && endDate && startDate <= endDate && setDateRange) {
      setDateRange(`${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}`);
    }
  }, [startDate, endDate, setDateRange]);

  useEffect(() => {
    if (!startDate || !endDate || startDate > endDate) return;

    let isMounted = true;
    const controller = new AbortController();

    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          platform: platform || 'all',
          startDate,
          endDate,
        });
        const res = await fetch(`${API_BASE_URL}/api/alerts?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }
        const result = await res.json();
        if (isMounted) {
          if (result.success && Array.isArray(result.data)) {
            setAlerts(result.data);
          } else if (Array.isArray(result)) {
            setAlerts(result);
          } else {
            setAlerts([]);
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error('Failed to fetch alerts:', err);
          setError(err.message);
          setAlerts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAlerts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [platform, startDate, endDate]);

  const markRead = (id) => {
    setAlerts(prev => prev.map(a => (a.id === id || a._id === id) ? { ...a, read: true } : a));
  };

  const filtered = alerts.filter(a => {
    if (filter === 'unread') return !a.read;
    if (filter === 'all') return true;
    return a.severity === filter;
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  const handleResetDates = () => {
    setStartDate('2022-12-31');
    setEndDate('2023-05-15');
  };

  return (
    <>
      {selectedAlert && <AlertDetail alert={selectedAlert} onClose={() => setSelectedAlert(null)} />}

      <div className="page-header">
        <div className="page-header-left">
          <h1>Alerts</h1>
          <p>AI-generated real-time intelligence alerts</p>
        </div>
        <div className="header-controls">
          <select
            className="select-control"
            value={platform}
            onChange={e => setPlatform(e.target.value)}
          >
            <option value="all">All Platforms</option>
            <option value="twitter">Twitter / X</option>
            <option value="instagram">Instagram</option>
            <option value="telegram">Telegram</option>
          </select>

          <div className="date-range-picker">
            <div className="date-field">
              <label htmlFor="alerts-from-date" className="date-label">From</label>
              <input
                id="alerts-from-date"
                type="date"
                className="date-input"
                value={startDate}
                max={endDate || undefined}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <span className="date-separator">–</span>
            <div className="date-field">
              <label htmlFor="alerts-to-date" className="date-label">To</label>
              <input
                id="alerts-to-date"
                type="date"
                className="date-input"
                value={endDate}
                min={startDate || undefined}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
            {(startDate !== '2022-12-31' || endDate !== '2023-05-15') && (
              <button
                type="button"
                className="date-reset-btn"
                title="Reset to historical dataset range"
                onClick={handleResetDates}
              >
                Reset
              </button>
            )}
          </div>

          {unreadCount > 0 && (
            <div style={{
              background: '#ef4444', color: '#fff', borderRadius: 'var(--radius-full)',
              padding: '4px 12px', fontSize: 12, fontWeight: 700
            }}>
              {unreadCount} unread
            </div>
          )}
        </div>
      </div>

      <div className="page-body">
        {dateError && (
          <div style={{
            padding: '10px 14px', marginBottom: 16,
            borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444',
            fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8
          }}>
            <span>⚠️</span><span>{dateError}</span>
          </div>
        )}

        {error && (
          <div style={{
            padding: '10px 14px', marginBottom: 16,
            borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444',
            fontSize: 13, display: 'flex', alignItems: 'center', gap: 8
          }}>
            <span>⚠️</span>
            <span>Unable to load alerts: {error}</span>
          </div>
        )}

        {loading && (
          <div style={{
            fontSize: 12, color: 'var(--text-muted)', marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            <span style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: 'var(--brand-primary, #6366f1)'
            }} />
            <span>Updating alerts...</span>
          </div>
        )}

        {/* Summary stats */}
        <div className="alerts-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'Total Alerts', value: alerts.length, color: '#6366f1' },
            { label: 'High Severity', value: alerts.filter(a => a.severity === 'high').length, color: '#ef4444' },
            { label: 'Medium', value: alerts.filter(a => a.severity === 'medium').length, color: '#f59e0b' },
            { label: 'Unread', value: unreadCount, color: '#3b82f6' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '16px 20px', borderLeft: `3px solid ${stat.color}` }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="filter-row" style={{ marginBottom: 16 }}>
          {['all', 'unread', 'high', 'medium', 'info'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Alert list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!loading && filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ fontSize: 40 }}>—</div>
              <div className="empty-state-text">
                {error ? 'No alerts could be loaded.' : 'No alerts found in this category for the selected timeframe.'}
              </div>
            </div>
          ) : (
            filtered.map((alert, idx) => {
              const alertKey = alert.id || alert._id || idx;
              return (
                <div key={alertKey} className={`alert-card ${alert.severity || 'info'} ${alert.read ? 'read' : ''}`}>
                  <div className="alert-icon" style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: alert.severity === 'high' ? '#ef4444' : alert.severity === 'medium' ? '#f59e0b' : '#3b82f6',
                    flexShrink: 0, marginTop: 4
                  }} />
                  <div className="alert-content">
                    <div className="alert-header">
                      <div>
                        <div className="alert-title">{alert.title}</div>
                        {alert.topic && (
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            Topic: <strong>{alert.topic}</strong>
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="alert-time">{alert.time}</div>
                        {!alert.read && (
                          <div style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: '50%', margin: '4px 0 0 auto' }} />
                        )}
                      </div>
                    </div>
                    {alert.description && <div className="alert-description">{alert.description}</div>}
                    {alert.action && <div className="alert-action">{alert.action}</div>}
                    <div className="alert-actions">
                      <button className="btn btn-sm btn-primary" onClick={() => setSelectedAlert(alert)}>
                        View Details
                      </button>
                      {!alert.read && (
                        <button className="btn btn-sm btn-secondary" onClick={() => markRead(alert.id || alert._id)}>
                          Mark as Read
                        </button>
                      )}
                      {alert.read && (
                        <span style={{ fontSize: 12, color: 'var(--color-positive)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          Read
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
