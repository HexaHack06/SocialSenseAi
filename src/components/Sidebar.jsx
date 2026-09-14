import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageCircle, TrendingUp, Users,
  Share2, Bell, FileText, Settings
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

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">SS</div>
          <div className="logo-text">
            <h2>SocialSense AI</h2>
            <span>Social Intelligence Platform</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>
        {navItems.slice(0, 6).map(({ path, label, Icon }) => (
          <button
            key={path}
            className={`nav-item ${pathname === path ? 'active' : ''}`}
            onClick={() => navigate(path)}
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
            onClick={() => navigate(path)}
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
  );
}
