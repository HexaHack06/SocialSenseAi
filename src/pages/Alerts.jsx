import { useState } from 'react';
import { alertsData } from '../data/mockData';

function AlertDetail({ alert, onClose }) {
  if (!alert) return null;
  return (
    <div className="topic-panel-overlay" onClick={onClose}>
      <div className="topic-panel" onClick={e => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose}>x</button>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: alert.severity === 'high' ? '#ef4444' : alert.severity === 'medium' ? '#f59e0b' : '#3b82f6', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{alert.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{alert.time}</div>
            </div>
          </div>
          <span className={`badge ${alert.severity === 'high' ? 'badge-negative' : alert.severity === 'medium' ? 'badge-neutral' : 'badge-info'}`}>
            {alert.severity.toUpperCase()} SEVERITY
          </span>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Description</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{alert.description}</p>
        </div>

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

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Alert Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {Object.entries(alert.details).map(([k, v]) => (
              <div key={k} style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 3 }}>
                  {k.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Alerts() {
  const [alerts, setAlerts] = useState(alertsData);
  const [filter, setFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const markRead = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const filtered = alerts.filter(a => {
    if (filter === 'unread') return !a.read;
    if (filter === 'all') return true;
    return a.severity === filter;
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <>
      {selectedAlert && <AlertDetail alert={selectedAlert} onClose={() => setSelectedAlert(null)} />}

      <div className="page-header">
        <div className="page-header-left">
          <h1>Alerts</h1>
          <p>AI-generated real-time intelligence alerts</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
        {/* Summary stats */}
        <div className="alerts-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'Total Alerts', value: alerts.length, color: '#6366f1', icon: '' },
            { label: 'High Severity', value: alerts.filter(a => a.severity === 'high').length, color: '#ef4444', icon: '' },
            { label: 'Medium', value: alerts.filter(a => a.severity === 'medium').length, color: '#f59e0b', icon: '' },
            { label: 'Unread', value: unreadCount, color: '#3b82f6', icon: '' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '16px 20px', borderLeft: `3px solid ${stat.color}` }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</div>
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
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ fontSize: 40 }}>—</div>
              <div className="empty-state-text">No alerts in this category</div>
            </div>
          ) : (
            filtered.map(alert => (
              <div key={alert.id} className={`alert-card ${alert.severity} ${alert.read ? 'read' : ''}`}>
                <div className="alert-icon" style={{ width: 14, height: 14, borderRadius: '50%', background: alert.severity === 'high' ? '#ef4444' : alert.severity === 'medium' ? '#f59e0b' : '#3b82f6', flexShrink: 0, marginTop: 4 }} />
                <div className="alert-content">
                  <div className="alert-header">
                    <div>
                      <div className="alert-title">{alert.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                        Topic: <strong>{alert.topic}</strong>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="alert-time">{alert.time}</div>
                      {!alert.read && (
                        <div style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: '50%', margin: '4px 0 0 auto' }} />
                      )}
                    </div>
                  </div>
                  <div className="alert-description">{alert.description}</div>
                  <div className="alert-action">{alert.action}</div>
                  <div className="alert-actions">
                    <button className="btn btn-sm btn-primary" onClick={() => setSelectedAlert(alert)}>
                      View Details
                    </button>
                    {!alert.read && (
                      <button className="btn btn-sm btn-secondary" onClick={() => markRead(alert.id)}>
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
            ))
          )}
        </div>
      </div>
    </>
  );
}
