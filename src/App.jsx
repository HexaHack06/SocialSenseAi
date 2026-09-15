import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Sentiment from './pages/Sentiment';
import Trends from './pages/Trends';
import Audience from './pages/Audience';
import Network from './pages/Network';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export default function App() {
  const [platform, setPlatform] = useState('all');
  const [dateRange, setDateRange] = useState('May 12, 2026 – May 18, 2026');
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppContext.Provider value={{ platform, setPlatform, dateRange, setDateRange, analyzed, setAnalyzed, analyzing, setAnalyzing }}>
      <div className="app-shell">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="main-content">
          {/* Mobile top bar — inside main-content so it sits above page content correctly */}
          <div className="mobile-topbar">
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(true)}
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
            <div style={{ width: 38 }} />
          </div>

          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/sentiment" element={<Sentiment />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/audience" element={<Audience />} />
            <Route path="/network" element={<Network />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </AppContext.Provider>
  );
}
