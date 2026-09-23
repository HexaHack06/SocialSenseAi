import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  LayoutDashboard, MessageCircle, TrendingUp, Users,
  Share2, Bell, FileText, Settings, X
} from 'lucide-react';
import { useApp } from '../App';
import { PROD_API_URL } from '../config/api';

const navItems = [
  { path: '/overview',  label: 'Overview',  Icon: LayoutDashboard },
  { path: '/sentiment', label: 'Sentiment', Icon: MessageCircle },
  { path: '/trends',    label: 'Trends',    Icon: TrendingUp },
  { path: '/audience',  label: 'Audience',  Icon: Users },
  { path: '/network',   label: 'Network',   Icon: Share2 },
  { path: '/alerts',    label: 'Alerts',    Icon: Bell },
  { path: '/reports',   label: 'Reports',   Icon: FileText },
  { path: '/settings',  label: 'Settings',  Icon: Settings },
];

const mobileNavItems = [
  { path: '/overview',  label: 'Overview',  Icon: LayoutDashboard },
  { path: '/sentiment', label: 'Sentiment', Icon: MessageCircle },
  { path: '/trends',    label: 'Trends',    Icon: TrendingUp },
  { path: '/alerts',    label: 'Alerts',    Icon: Bell },
  { path: '/settings',  label: 'Settings',  Icon: Settings },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { backendStatus } = useApp();

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleNav = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  // ── Backend status pill helpers ───────────────────────────────
  const isCloud = backendStatus?.serverUrl?.includes('onrender.com') ||
                  backendStatus?.serverUrl === PROD_API_URL;
  const isChecking = backendStatus?.checking || backendStatus?.ok === null;

  let statusColor = '#6b7280'; // grey = unknown
  let statusLabel = 'Connecting...';
  let dotAnim = 'pulse 2s infinite';

  if (!isChecking) {
    if (backendStatus?.ok) {
      statusColor = '#10b981'; // green = connected
      statusLabel = isCloud ? 'Cloud · ' + backendStatus.latencyMs + 'ms'
                            : 'Local · ' + backendStatus.latencyMs + 'ms';
      dotAnim = 'pulse 2s infinite';
    } else {
      statusColor = '#ef4444'; // red = offline
      statusLabel = 'Backend Offline';
      dotAnim = 'none';
    }
  }

  return (
    <>
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">SS</div>
            <div className="logo-text">
              <h2>SocialSense AI</h2>
              <span>Social Intelligence Platform</span>
            </div>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          {navItems.slice(0, 6).map(({ path, label, Icon }) => (
            <button
              key={path}
              className={`nav-item ${pathname === path ? 'active' : ''}`}
              onClick={() => handleNav(path)}
            >
              <Icon size={17} strokeWidth={1.8} className="nav-icon" />
              {label}
            </button>
          ))}

          <div className="nav-section-label" style={{ marginTop: 8 }}>Workspace</div>
          {navItems.slice(6).map(({ path, label, Icon }) => (
            <button
              key={path}
              className={`nav-item ${pathname === path ? 'active' : ''}`}
              onClick={() => handleNav(path)}
            >
              <Icon size={17} strokeWidth={1.8} className="nav-icon" />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {/* Live backend status pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 10px',
            background: backendStatus?.ok ? 'rgba(16,185,129,0.08)' : isChecking ? 'rgba(99,102,241,0.08)' : 'rgba(239,68,68,0.08)',
            border: `1px solid ${statusColor}40`,
            borderRadius: 'var(--radius-full)',
            marginBottom: 6,
            width: '100%',
            boxSizing: 'border-box',
          }}>
            <div style={{
              width: 6, height: 6, background: statusColor,
              borderRadius: '50%', flexShrink: 0,
              animation: dotAnim,
            }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: statusColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {statusLabel}
            </span>
          </div>

          <div className="connected-badge">
            <div className="connected-dot" />
            <span>MongoDB Connected</span>
          </div>
        </div>
      </aside>

      <nav className="mobile-bottom-nav">
        {mobileNavItems.map(({ path, label, Icon }) => (
          <button
            key={path}
            className={`mobile-nav-btn ${pathname === path ? 'active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon size={20} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
