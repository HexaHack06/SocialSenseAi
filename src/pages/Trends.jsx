import { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useApp } from '../App';
import { getApiBaseUrl } from '../config/api';

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

const TOPIC_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#22d3ee', '#8b5cf6'];

function TopicDetailPanel({ topic, originSteps = [], onClose }) {
  if (!topic) return null;

  return (
    <div className="topic-panel-overlay" onClick={onClose}>
      <div className="topic-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <button className="panel-close" onClick={onClose}>✕</button>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--brand-primary)', marginBottom: 4 }}>
            {topic.tag || topic.topic}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Topic Intelligence & Origin Report</div>
        </div>

        <div className="stat-row">
          <div className="stat-mini">
            <div className="stat-mini-value">
              {typeof topic.mentions === 'number'
                ? (topic.mentions >= 1000 ? (topic.mentions / 1000).toFixed(1) + 'K' : topic.mentions)
                : topic.mentions}
            </div>
            <div className="stat-mini-label">Mentions</div>
          </div>
          <div className="stat-mini">
            <div className="stat-mini-value" style={{ color: (topic.growth || '').startsWith('+') ? 'var(--color-positive)' : 'var(--color-negative)' }}>
              {topic.growth || '0%'}
            </div>
            <div className="stat-mini-label">Growth</div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <span className={`badge badge-${(topic.sentiment || 'neutral').toLowerCase()}`}>
            {topic.sentiment || 'Neutral'} Sentiment
          </span>
        </div>

        {/* ── Trend Origin Section in Panel ── */}
        {originSteps.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Trend Origin Propagation
              </div>
              <span style={{ fontSize: 11, color: 'var(--brand-primary)', fontWeight: 600 }}>How did this emerge?</span>
            </div>

            <div style={{ background: '#0a0e1a', borderRadius: 'var(--radius-sm)', padding: '16px 14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              {originSteps.map((step, idx) => (
                <div key={idx} style={{ position: 'relative', paddingLeft: 22, marginBottom: idx === originSteps.length - 1 ? 0 : 16 }}>
                  {idx < originSteps.length - 1 && (
                    <div style={{ position: 'absolute', left: 6, top: 12, bottom: -12, width: 2, background: 'rgba(99,102,241,0.3)' }} />
                  )}
                  <div style={{
                    position: 'absolute', left: 2, top: 4, width: 10, height: 10, borderRadius: '50%',
                    background: step.type === 'detected' ? '#10b981' : step.type === 'influencer' ? '#f59e0b' : '#6366f1',
                    border: '2px solid #0a0e1a'
                  }} />

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>{step.time}</span>
                    <span style={{
                      fontSize: 12,
                      fontWeight: step.type === 'detected' ? 800 : 600,
                      color: step.type === 'detected' ? '#10b981' : '#ffffff'
                    }}>
                      {step.step}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {topic.relatedKeywords && topic.relatedKeywords.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Keywords</div>
            <div className="keyword-cloud">
              {topic.relatedKeywords.map(kw => <span key={kw} className="keyword-tag keyword-positive">{kw}</span>)}
            </div>
          </div>
        )}

        {topic.recentPosts && topic.recentPosts.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Recent Posts</div>
            {topic.recentPosts.map((post, i) => (
              <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 8 }}>
                <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 8 }}>"{post.text}"</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className={`badge badge-${(post.sentiment || 'neutral').toLowerCase()}`}>{post.sentiment || 'Neutral'}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{post.platform} · {post.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Trends() {
  const { platform, setPlatform, setDateRange } = useApp();
  const [startDate, setStartDate] = useState('2022-12-31');
  const [endDate, setEndDate] = useState('2023-05-15');

  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeOriginTag, setActiveOriginTag] = useState('');

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

    const fetchTrends = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          platform: platform || 'all',
          startDate,
          endDate,
        });
        const res = await fetch(`${getApiBaseUrl()}/api/trends?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }
        const result = await res.json();
        if (isMounted) {
          if (result.success && result.data) {
            setTrendsData(result.data);
            const originKeys = Object.keys(result.data.trendOriginData || {});
            if (originKeys.length > 0) {
              setActiveOriginTag(prev => originKeys.includes(prev) ? prev : originKeys[0]);
            } else {
              setActiveOriginTag('');
            }
          } else {
            setTrendsData(null);
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error('Failed to fetch trends data:', err);
          setError(err.message);
          setTrendsData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTrends();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [platform, startDate, endDate]);

  const handleResetDates = () => {
    setStartDate('2022-12-31');
    setEndDate('2023-05-15');
  };

  const trendsTableData = useMemo(() => trendsData?.trendsTableData || [], [trendsData]);
  const trendingTopics = useMemo(() => trendsData?.trendingTopics || [], [trendsData]);
  const trendOriginData = useMemo(() => trendsData?.trendOriginData || {}, [trendsData]);
  const trendActivity = useMemo(() => trendsData?.trendActivity || [], [trendsData]);
  const trendForecast = useMemo(() => trendsData?.trendForecast || [], [trendsData]);

  const originTags = Object.keys(trendOriginData);
  const activeSteps = trendOriginData[activeOriginTag] || (originTags.length > 0 ? trendOriginData[originTags[0]] : []);

  // Filtered leaderboard table
  const filtered = useMemo(() => {
    return trendsTableData.filter(t => {
      const matchSearch = (t.topic || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || (t.status || '').toLowerCase() === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [trendsTableData, search, statusFilter]);

  // Keys present in trendActivity & trendForecast
  const activitySeriesKeys = useMemo(() => {
    if (!trendActivity.length) return [];
    const keys = new Set();
    trendActivity.forEach(row => {
      Object.keys(row).forEach(k => {
        if (k !== 'date' && k !== '_id') keys.add(k);
      });
    });
    return Array.from(keys);
  }, [trendActivity]);

  const forecastSeriesKeys = useMemo(() => {
    if (!trendForecast.length) return [];
    const keys = new Set();
    trendForecast.forEach(row => {
      Object.keys(row).forEach(k => {
        if (k !== 'date' && k !== '_id') keys.add(k);
      });
    });
    return Array.from(keys);
  }, [trendForecast]);

  return (
    <>
      {selectedTopic && (
        <TopicDetailPanel
          topic={selectedTopic}
          originSteps={trendOriginData[selectedTopic.tag] || trendOriginData[`#${selectedTopic.topic}`] || []}
          onClose={() => setSelectedTopic(null)}
        />
      )}

      <div className="page-header">
        <div className="page-header-left">
          <h1>Trends</h1>
          <p>Real-time trending topic detection, origin analysis, and forecasting</p>
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
              <label htmlFor="trends-from-date" className="date-label">From</label>
              <input
                id="trends-from-date"
                type="date"
                className="date-input"
                value={startDate}
                max={endDate || undefined}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <span className="date-separator">–</span>
            <div className="date-field">
              <label htmlFor="trends-to-date" className="date-label">To</label>
              <input
                id="trends-to-date"
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
            <span>Unable to load trends data: {error}</span>
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
            <span>Updating trends data from dataset...</span>
          </div>
        )}

        {/* ── TREND ORIGIN SECTION ── */}
        <div className="card" style={{ marginBottom: 24, border: '1px solid rgba(99,102,241,0.25)', background: 'linear-gradient(180deg, rgba(99,102,241,0.03) 0%, transparent 100%)' }}>
          <div className="card-header trend-origin-header" style={{ alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="card-title" style={{ fontSize: 16, fontWeight: 800 }}>Trend Origin Analysis</div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(99,102,241,0.15)', color: 'var(--brand-primary)' }}>
                  How did this trend emerge?
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Combines <strong>trend velocity + chronological propagation + network influencer spread</strong>
              </p>
            </div>

            {/* Topic selector pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {originTags.map(tag => (
                <button
                  key={tag}
                  className={`btn btn-sm ${activeOriginTag === tag ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveOriginTag(tag)}
                  style={{ fontSize: 12, padding: '4px 10px' }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="card-body" style={{ paddingTop: 8 }}>
            <div className="trend-origin-terminal" style={{
              background: '#090d16',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '24px 28px',
              fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
                    Chronological Origin Cascade {activeOriginTag ? `· ${activeOriginTag}` : ''}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                  Automated Pattern Extraction
                </span>
              </div>

              {activeSteps.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {activeSteps.map((step, idx) => (
                    <div key={idx}>
                      <div className="trend-origin-row" style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 8,
                        background: step.type === 'detected'
                          ? 'rgba(16,185,129,0.12)'
                          : step.type === 'influencer'
                          ? 'rgba(245,158,11,0.08)'
                          : 'rgba(255,255,255,0.03)',
                        border: step.type === 'detected'
                          ? '1px solid rgba(16,185,129,0.3)'
                          : step.type === 'influencer'
                          ? '1px solid rgba(245,158,11,0.2)'
                          : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '12px 16px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 0 }}>
                          <span style={{
                            fontFamily: 'monospace',
                            fontSize: 13,
                            fontWeight: 700,
                            color: step.type === 'detected' ? '#10b981' : '#94a3b8',
                            minWidth: 46,
                            flexShrink: 0,
                            paddingTop: 1,
                          }}>
                            {step.time}
                          </span>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{
                              fontSize: 13,
                              fontWeight: step.type === 'detected' ? 800 : 600,
                              color: step.type === 'detected' ? '#10b981' : '#ffffff',
                              letterSpacing: step.type === 'detected' ? '0.04em' : 'normal',
                              wordBreak: 'break-word',
                            }}>
                              {step.step}
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2, wordBreak: 'break-word', lineHeight: 1.5 }}>
                              {step.desc}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <span style={{
                            fontSize: 11,
                            padding: '3px 8px',
                            borderRadius: 4,
                            background: 'rgba(255,255,255,0.06)',
                            color: '#cbd5e1',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                          }}>
                            {step.platform}
                          </span>
                        </div>
                      </div>

                      {idx < activeSteps.length - 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', color: '#6366f1', fontSize: 13, margin: '2px 0' }}>
                          ↓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: 13 }}>
                  {loading ? 'Analyzing origin steps...' : 'No origin propagation data recorded for this timeframe'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trending table */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <div className="card-title">Trending Topics Leaderboard</div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Click "Explore" to view origin & propagation path</span>
          </div>
          <div style={{ padding: '12px 22px 0' }}>
            <div className="filter-row">
              <div className="search-bar">
                <span>Search</span>
                <input placeholder="Search topics..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              {['all', 'rising', 'stable', 'declining'].map(f => (
                <button key={f} className={`btn btn-sm ${statusFilter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setStatusFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Topic</th>
                  <th>Mentions</th>
                  <th>Growth</th>
                  <th>Status</th>
                  <th>Platform</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((t, i) => {
                    const matchedTopic = trendingTopics.find(tt =>
                      (tt.tag && t.topic && tt.tag.toLowerCase().includes(t.topic.toLowerCase())) ||
                      (tt.topic && t.topic && tt.topic.toLowerCase() === t.topic.toLowerCase())
                    );
                    return (
                      <tr key={i}>
                        <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{t.topic}</td>
                        <td style={{ fontWeight: 700 }}>
                          {typeof t.mentions === 'number' ? t.mentions.toLocaleString() : t.mentions}
                        </td>
                        <td style={{ fontWeight: 700, color: (t.growth || '').startsWith('+') ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                          {t.growth}
                        </td>
                        <td>
                          <span className={`badge badge-${(t.status || 'stable').toLowerCase()}`}>
                            {t.status || 'Stable'}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.platform || 'Cross-Platform'}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => {
                              const topic = matchedTopic || {
                                tag: `#${t.topic.replace(/ /g, '')}`,
                                topic: t.topic,
                                mentions: t.mentions,
                                growth: t.growth,
                                sentiment: 'Neutral',
                                relatedKeywords: [],
                                recentPosts: []
                              };
                              setSelectedTopic(topic);
                            }}
                          >
                            Explore Origin →
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: 13 }}>
                      {loading ? 'Loading topics...' : error ? 'Could not load topics.' : 'No topics match current search or filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trend Activity Chart */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <div className="card-title">Topic Trend Activity</div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Historical activity from dataset</span>
          </div>
          <div className="card-body">
            {trendActivity.length > 0 && activitySeriesKeys.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trendActivity} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip formatter={(v, n) => [Number(v).toLocaleString(), n]} />
                  <Legend iconType="circle" iconSize={8} />
                  {activitySeriesKeys.map((key, i) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={key}
                      stroke={TOPIC_COLORS[i % TOPIC_COLORS.length]}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                {loading ? 'Loading trend activity...' : 'Trend activity timeline unavailable'}
              </div>
            )}
          </div>
        </div>

        {/* Forecast */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Trend Forecast</div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Predictive activity projection</span>
          </div>
          <div style={{ padding: '8px 16px 4px', display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 8, height: 8, background: '#f59e0b', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Powered by dataset pattern model
            </span>
          </div>
          <div className="card-body">
            {trendForecast.length > 0 && forecastSeriesKeys.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={trendForecast} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                  <defs>
                    {forecastSeriesKeys.map((key, i) => (
                      <linearGradient key={`grad_${key}`} id={`grad_${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={TOPIC_COLORS[i % TOPIC_COLORS.length]} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={TOPIC_COLORS[i % TOPIC_COLORS.length]} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip formatter={(v, n) => [Number(v).toLocaleString(), n]} />
                  <Legend iconType="circle" iconSize={8} />
                  {forecastSeriesKeys.map((key, i) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={key}
                      stroke={TOPIC_COLORS[i % TOPIC_COLORS.length]}
                      strokeDasharray="5 3"
                      fill={`url(#grad_${key})`}
                      strokeWidth={2}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                {loading ? 'Calculating trend forecast...' : 'Forecast data unavailable'}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
