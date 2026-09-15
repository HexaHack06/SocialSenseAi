import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, MessageCircle, TrendingUp, Users,
  Share2, Bell, FileText, Settings, Menu, X
} from 'lucide-react';

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

// Bottom nav shows only the 5 most important items on mobile
const mobileNavItems = [
  { path: '/overview',  label: 'Overview',  Icon: LayoutDashboard },
  { path: '/sentiment', label: 'Sentiment', Icon: MessageCircle },
  { path: '/trends',    label: 'Trends',    Icon: TrendingUp },
  { path: '/alerts',    label: 'Alerts',    Icon: Bell },
  { path: '/settings',  label: 'Settings',  Icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── Mobile top bar ─────────────────────────── */}
      <div className="mobile-topbar">
        <button
          className="hamburger-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>
        <div className="logo-mark">
          <div className="logo-icon" style={{ width: 30, height: 30, fontSize: 14 }}>SS</div>
          <div className="logo-text">
            <h2 style={{ fontSize: 12 }}>SocialSense AI</h2>
          </div>
        </div>
        <div style={{ width: 38 }} /> {/* spacer for centering */}
      </div>

      {/* ── Overlay backdrop ───────────────────────── */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────── */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">SS</div>
            <div className="logo-text">
              <h2>SocialSense AI</h2>
              <span>Social Intelligence Platform</span>
            </div>
          </div>
          {/* Close button (mobile only) */}
          <button
            className="sidebar-close-btn"
            onClick={() => setMobileOpen(false)}
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
          <div className="demo-badge">
            <div className="demo-dot" />
            <span>Demo Mode</span>
          </div>
          <div className="connected-badge">
            <div className="connected-dot" />
            <span>Connected</span>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom nav ──────────────────────── */}
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
