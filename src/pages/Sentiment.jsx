import { useState, useEffect, useMemo } from 'react';
import {
  AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { useApp } from '../App';

// ── Helpers ───────────────────────────────────────────────────

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  } catch {
    // fall through
  }
  return dateStr;
}

// ── Custom Tooltip ────────────────────────────────────────────

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

// ── Main Component ────────────────────────────────────────────

export default function Sentiment() {
  const { platform, setPlatform, setDateRange } = useApp();

  // ── Date range state (own, like Overview) ──────────────────
  const [startDate, setStartDate] = useState('2022-12-31');
  const [endDate, setEndDate] = useState('2023-05-15');

  // ── API state ──────────────────────────────────────────────
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Post search / filter ───────────────────────────────────
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // ── Derived validation ─────────────────────────────────────
  const dateError = !startDate || !endDate
    ? 'Please select both From and To dates.'
    : startDate > endDate
      ? 'From date cannot be after To date.'
      : null;

  // ── Sync AppContext dateRange string ───────────────────────
  useEffect(() => {
    if (startDate && endDate && startDate <= endDate && setDateRange) {
      setDateRange(`${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}`);
    }
  }, [startDate, endDate, setDateRange]);

  // ── Fetch from /api/overview ───────────────────────────────
  useEffect(() => {
    if (!startDate || !endDate || startDate > endDate) return;

    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const params = new URLSearchParams({
          platform: platform || 'all',
          startDate,
          endDate,
        });
        const res = await fetch(`${apiBaseUrl}/api/overview?${params}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`API returned status ${res.status}`);
        const result = await res.json();
        if (isMounted) {
          if (result.success && result.data) {
            setApiData(result.data);
          } else {
            throw new Error(result.message || 'Failed to fetch sentiment data');
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error('Sentiment fetch failed:', err);
          setError(err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; controller.abort(); };
  }, [platform, startDate, endDate]);

  // ── Derived data ──────────────────────────────────────────

  const kpis = apiData?.kpis ?? {};
  const totalMentions  = kpis.totalMentions  ?? 0;
  const positiveCount  = kpis.positiveCount  ?? Math.round(totalMentions * (kpis.positivePercentage ?? 0) / 100);
  const negativeCount  = kpis.negativeCount  ?? Math.round(totalMentions * (kpis.negativePercentage ?? 0) / 100);
  const neutralCount   = kpis.neutralCount   ?? Math.round(totalMentions * (kpis.neutralPercentage  ?? 0) / 100);
  const positivePct    = kpis.positivePercentage ?? 0;
  const negativePct    = kpis.negativePercentage ?? 0;
  const neutralPct     = kpis.neutralPercentage  ?? 0;
  const avgScore       = kpis.avgSentimentScore  != null
    ? kpis.avgSentimentScore
    : (kpis.wow?.avgSentimentScore ?? null);

  const sentDist = [
    { name: 'Positive', value: positivePct, count: positiveCount, color: '#10b981' },
    { name: 'Neutral',  value: neutralPct,  count: neutralCount,  color: '#f59e0b' },
    { name: 'Negative', value: negativePct, count: negativeCount, color: '#ef4444' },
  ];

  // Sentiment timeline: convert raw counts to percentages
  const timelineData = (apiData?.sentimentTimeline || []).map(item => {
    let displayDate = item.date;
    try {
      const d = new Date(item.date);
      if (!isNaN(d.getTime())) {
        displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch { /* fallback */ }
    const total = item.total || (item.positive + item.neutral + item.negative) || 0;
    return {
      date: displayDate,
      positive: total > 0 ? Number(((item.positive / total) * 100).toFixed(1)) : 0,
      neutral:  total > 0 ? Number(((item.neutral  / total) * 100).toFixed(1)) : 0,
      negative: total > 0 ? Number(((item.negative / total) * 100).toFixed(1)) : 0,
    };
  });

  // Emotion breakdown: from API or derived from topic distribution
  const radarData = useMemo(() => {
    if (apiData?.emotionBreakdown?.length) {
      return apiData.emotionBreakdown.map(e => ({
        emotion: e.emotion ?? e.name,
        value: e.value ?? e.count ?? 0,
        fullMark: 100,
      }));
    }
    // Derive approximate emotion proxy from sentiment percentages
    if (positivePct || negativePct || neutralPct) {
      return [
        { emotion: 'Joy',         value: Math.round(positivePct * 0.6),  fullMark: 100 },
        { emotion: 'Trust',       value: Math.round(positivePct * 0.5),  fullMark: 100 },
        { emotion: 'Optimism',    value: Math.round(positivePct * 0.45), fullMark: 100 },
        { emotion: 'Anger',       value: Math.round(negativePct * 0.55), fullMark: 100 },
        { emotion: 'Frustration', value: Math.round(negativePct * 0.5),  fullMark: 100 },
        { emotion: 'Surprise',    value: Math.round(neutralPct  * 0.3),  fullMark: 100 },
      ];
    }
    return [];
  }, [apiData, positivePct, negativePct, neutralPct]);

  // Aspect breakdown: from API if present
  const aspectData = apiData?.aspectBreakdown ?? null;

  // Recent posts mapped from API recentPosts
  const rawPosts = apiData?.recentPosts ?? [];
  const mappedPosts = rawPosts.map((p, idx) => ({
    id: p._id ?? idx,
    post: p.text ?? '',
    sentiment: p.sentiment
      ? p.sentiment.charAt(0).toUpperCase() + p.sentiment.slice(1)
      : 'Neutral',
    emotion: p.emotion ?? '—',
    confidence: p.sentimentScore != null
      ? Math.round(Math.abs(p.sentimentScore) * 100)
      : null,
    platform: p.platform
      ? p.platform.charAt(0).toUpperCase() + p.platform.slice(1)
      : 'Web',
    time: p.createdAt
      ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Recently',
  }));

  const filteredPosts = useMemo(() => {
    return mappedPosts.filter(p => {
      const matchPlatform = platform === 'all' || p.platform.toLowerCase() === platform;
      const matchSearch   = p.post.toLowerCase().includes(search.toLowerCase());
      const matchFilter   = filter === 'all' || p.sentiment.toLowerCase() === filter;
      return matchPlatform && matchSearch && matchFilter;
    });
  }, [mappedPosts, platform, search, filter]);

  const handleResetDates = () => { setStartDate('2022-12-31'); setEndDate('2023-05-15'); };

  // ── Render ─────────────────────────────────────────────────

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
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

          {/* Date range picker — same style as Overview */}
          <div className="date-range-picker">
            <div className="date-field">
              <label htmlFor="sent-from-date" className="date-label">From</label>
              <input
                id="sent-from-date"
                type="date"
                className="date-input"
                value={startDate}
                max={endDate || undefined}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <span className="date-separator">–</span>
            <div className="date-field">
              <label htmlFor="sent-to-date" className="date-label">To</label>
              <input
                id="sent-to-date"
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
        </div>
      </div>

      {/* ── Page Body ──────────────────────────────────────── */}
      <div className="page-body">

        {/* Date validation warning */}
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

        {/* API error */}
        {error && (
          <div style={{
            padding: '10px 14px', marginBottom: 16,
            borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444',
            fontSize: 13, display: 'flex', alignItems: 'center', gap: 8
          }}>
            <span>⚠️</span>
            <span>Unable to load sentiment data: {error}</span>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div style={{
            fontSize: 12, color: 'var(--text-muted)', marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            <span style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: 'var(--brand-primary, #6366f1)'
            }} />
            <span>Updating sentiment data...</span>
          </div>
        )}

        {/* ── KPI Summary row ───────────────────────────────── */}
        {!loading && !error && apiData && (
          <div className="kpi-grid" style={{ marginBottom: 20 }}>
            {[
              { label: 'Total Mentions',    value: totalMentions >= 1000 ? (totalMentions / 1000).toFixed(1) + 'K' : totalMentions, color: 'var(--brand-primary)' },
              { label: 'Positive',          value: `${positivePct}%`,  sub: `${positiveCount.toLocaleString()} posts`, color: '#10b981' },
              { label: 'Negative',          value: `${negativePct}%`,  sub: `${negativeCount.toLocaleString()} posts`, color: '#ef4444' },
              { label: 'Neutral',           value: `${neutralPct}%`,   sub: `${neutralCount.toLocaleString()} posts`,  color: '#f59e0b' },
              ...(avgScore != null ? [{ label: 'Avg Sentiment Score', value: avgScore.toFixed ? avgScore.toFixed(3) : avgScore, color: 'var(--brand-secondary)' }] : []),
            ].map((k, i) => (
              <div key={i} className={`kpi-card fade-in-up`} style={{ borderTop: `3px solid ${k.color}` }}>
                <div className="kpi-header">
                  <span className="kpi-label">{k.label}</span>
                </div>
                <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
                {k.sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{k.sub}</div>}
              </div>
            ))}
          </div>
        )}

        {/* ── Sentiment Distribution + Emotion Radar ─────────── */}
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
                    {s.count > 0 && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                        {s.count.toLocaleString()} posts
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Emotion Analysis</div>
              {!apiData?.emotionBreakdown?.length && apiData && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>derived from sentiment</span>
              )}
            </div>
            <div className="card-body">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="emotion" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <PolarRadiusAxis tick={{ fontSize: 9, fill: '#94a3b8' }} />
                    <Radar name="Emotion" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  {loading ? 'Loading...' : 'No emotion data available'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Sentiment Over Time ──────────────────────────────── */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <div className="card-title">Sentiment Over Time</div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {startDate && endDate ? `${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}` : ''}
            </span>
          </div>
          <div className="card-body">
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={timelineData} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sentGradPos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sentGradNeg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sentGradNeu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} />
                  <Area type="monotone" dataKey="positive" name="Positive" stroke="#10b981" fill="url(#sentGradPos)" strokeWidth={2} />
                  <Area type="monotone" dataKey="neutral"  name="Neutral"  stroke="#f59e0b" fill="url(#sentGradNeu)" strokeWidth={2} />
                  <Area type="monotone" dataKey="negative" name="Negative" stroke="#ef4444" fill="url(#sentGradNeg)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                {loading ? 'Loading timeline...' : error ? 'Timeline unavailable' : 'No timeline data for selected range'}
              </div>
            )}
          </div>
        </div>

        {/* ── Aspect Breakdown (when API provides it) ──────────── */}
        {aspectData && aspectData.length > 0 && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div className="card-title">Aspect Breakdown</div>
            </div>
            <div className="card-body">
              {aspectData.map((asp, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    <span>{asp.aspect ?? asp.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{asp.positive != null ? `+${asp.positive}% pos` : ''}</span>
                  </div>
                  <div className="progress-track" style={{ height: 8 }}>
                    <div className="progress-fill" style={{
                      width: `${asp.value ?? asp.positive ?? 0}%`,
                      background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Posts Table ──────────────────────────────────────── */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Social Media Posts</div>
          </div>
          <div style={{ padding: '12px 16px 0' }}>
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
          <div style={{ overflowX: 'auto', maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
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
                {filteredPosts.length > 0
                  ? filteredPosts.map(post => (
                      <tr key={post.id}>
                        <td><div className="post-text">{post.post}</div></td>
                        <td>
                          <span className={`badge badge-${post.sentiment.toLowerCase()}`}>
                            {post.sentiment}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{post.emotion}</td>
                        <td>
                          {post.confidence != null ? (
                            <div className="confidence-bar">
                              <div className="conf-track">
                                <div className="conf-fill" style={{ width: `${post.confidence}%` }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600 }}>{post.confidence}%</span>
                            </div>
                          ) : (
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
                          )}
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{post.platform}</td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{post.time}</td>
                      </tr>
                    ))
                  : !loading && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px', fontSize: 13 }}>
                          {error ? 'Could not load posts.' : 'No posts match the current filters.'}
                        </td>
                      </tr>
                    )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
