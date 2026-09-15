import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  LayoutDashboard, MessageCircle, TrendingUp, Users,
  Share2, Bell, FileText, Settings, X
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

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleNav = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

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
