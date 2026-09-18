import { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { useApp } from '../App';
import {
  getKpiData, getSentimentTimeline, getEmotionData, sentimentPosts, positiveKeywords, negativeKeywords
} from '../data/mockData';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-date">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="tooltip-row">
          <div className="tooltip-dot" style={{ background: p.color }} />
          <span className="tooltip-label">{p.name}</span>
          <span className="tooltip-val">{p.value}%</span>
        </div>
      ))}
    </div>
  );
}

export default function Sentiment() {
  const { platform, setPlatform, dateRange, setDateRange } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const kpis = getKpiData(platform, dateRange);
  const timelineData = getSentimentTimeline(platform, dateRange);
  const currentEmotions = getEmotionData(platform, dateRange);

  const filteredPosts = useMemo(() => {
    return sentimentPosts.filter(p => {
      const matchPlatform = platform === 'all' || p.platform.toLowerCase() === (platform === 'twitter' ? 'twitter' : platform);
      const matchSearch = p.post.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || p.sentiment.toLowerCase() === filter;
      return matchPlatform && matchSearch && matchFilter;
    });
  }, [platform, search, filter]);

  const radarData = currentEmotions.map(e => ({ emotion: e.emotion, value: e.value }));

  const sentDist = [
    { name: 'Positive', value: kpis.positive, color: '#10b981' },
    { name: 'Neutral', value: kpis.neutral, color: '#f59e0b' },
    { name: 'Negative', value: kpis.negative, color: '#ef4444' },
  ];

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Sentiment Analysis</h1>
          <p>AI-powered sentiment and emotion breakdown</p>
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
          <select
            className="select-control"
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
          >
            <option value="May 12, 2026 – May 18, 2026">May 12 – May 18, 2026</option>
            <option value="May 5, 2026 – May 11, 2026">May 5 – May 11, 2026</option>
            <option value="Apr 28 – May 4, 2026">Apr 28 – May 4, 2026</option>
            <option value="Last 30 Days">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="page-body">
        {/* Sentiment Distribution + Emotion Radar */}
        <div className="dashboard-grid grid-2col" style={{ marginBottom: 20 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Sentiment Distribution</div>
            </div>
            <div className="card-body sentiment-dist-body" style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flexShrink: 0, width: 180, minWidth: 140 }}>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={sentDist} innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {sentDist.map((s, i) => <Cell key={i} fill={s.color} />)}
                    </Pie>
                    <Tooltip formatter={v => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                {sentDist.map((s, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13, fontWeight: 600 }}>
                      <span style={{ color: s.color }}>{s.name}</span>
                      <span>{s.value}%</span>
                    </div>
                    <div className="progress-track" style={{ height: 10 }}>
                      <div className="progress-fill" style={{ width: `${s.value}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Emotion Analysis</div>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="emotion" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <PolarRadiusAxis tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <Radar name="Emotion" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sentiment Over Time */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <div className="card-title">Sentiment Over Time</div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={timelineData} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradPos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradNeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradNeu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} />
                <Area type="monotone" dataKey="positive" name="Positive" stroke="#10b981" fill="url(#gradPos)" strokeWidth={2} />
                <Area type="monotone" dataKey="neutral" name="Neutral" stroke="#f59e0b" fill="url(#gradNeu)" strokeWidth={2} />
                <Area type="monotone" dataKey="negative" name="Negative" stroke="#ef4444" fill="url(#gradNeg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Keywords */}
        <div className="dashboard-grid grid-2col" style={{ marginBottom: 20 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Positive Keywords</div>
            </div>
            <div className="card-body">
              <div className="keyword-cloud">
                {positiveKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="keyword-tag keyword-positive"
                    style={{ fontSize: `${Math.max(11, Math.min(16, 10 + kw.count / 300))}px` }}
                  >
                    {kw.word} <strong style={{ opacity: 0.7, fontSize: '0.85em' }}>{(kw.count / 1000).toFixed(1)}K</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Negative Keywords</div>
            </div>
            <div className="card-body">
              <div className="keyword-cloud">
                {negativeKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="keyword-tag keyword-negative"
                    style={{ fontSize: `${Math.max(11, Math.min(16, 10 + kw.count / 250))}px` }}
                  >
                    {kw.word} <strong style={{ opacity: 0.7, fontSize: '0.85em' }}>{(kw.count / 1000).toFixed(1)}K</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Social Media Posts</div>
          </div>
          <div style={{ padding: '12px 22px 0' }}>
            <div className="filter-row">
              <div className="search-bar">
                <span>Search</span>
                <input
                  placeholder="Search posts..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              {['all', 'positive', 'neutral', 'negative'].map(f => (
                <button
                  key={f}
                  className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
              <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                {filteredPosts.length} posts
              </span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Sentiment</th>
                  <th>Emotion</th>
                  <th>Confidence</th>
                  <th>Platform</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map(post => (
                  <tr key={post.id}>
                    <td><div className="post-text">{post.post}</div></td>
                    <td>
                      <span className={`badge badge-${post.sentiment.toLowerCase()}`}>
                        {post.sentiment}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{post.emotion}</td>
                    <td>
                      <div className="confidence-bar">
                        <div className="conf-track">
                          <div className="conf-fill" style={{ width: `${post.confidence}%` }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{post.confidence}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{post.platform}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{post.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
