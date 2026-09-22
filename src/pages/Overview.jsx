import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useApp } from '../App';

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  } catch {
    // fallback to original string
  }
  return dateStr;
}

// ── Analyze animation steps ───────────────────────────────────
const STEPS = [
  'Collecting social data...',
  'Cleaning & preprocessing data...',
  'Running AI sentiment analysis...',
  'Detecting trending topics...',
  'Analyzing network connections...',
  'Generating insights...',
];

function AnalyzeOverlay({ onDone }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      setProgress(Math.round((step / STEPS.length) * 100));
      if (step >= STEPS.length) {
        clearInterval(interval);
        setDone(true);
        setTimeout(onDone, 700);
      }
    }, 700);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="analyze-overlay">
      <div className="analyze-modal fade-in-up">
        <div className="analyze-spinner">
          <div className="spinner-ring" />
          <div className="spinner-ring" />
          <div className="spinner-ring" />
        </div>
        <div className="analyze-step">
          {done ? 'Analysis Complete!' : STEPS[Math.min(currentStep, STEPS.length - 1)]}
        </div>
        <div className="analyze-substep">
          {done ? 'Dashboard updated with latest insights.' : 'Processing your social media data with AI...'}
        </div>
        <div className="analyze-progress">
          <div className="analyze-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="analyze-steps-list">
          {STEPS.map((step, i) => (
            <div key={i} className={`step-row ${i < currentStep ? 'done' : i === currentStep ? 'active' : ''}`}>
              <span className="step-check">
                {i < currentStep ? '+' : i === currentStep ? '>' : 'o'}
              </span>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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

// ── KPI Card ──────────────────────────────────────────────────
function KPICard({ type, label, value, delta, suffix }) {
  const isUp = delta >= 0;
  return (
    <div className={`kpi-card ${type} fade-in-up`}>
      <div className="kpi-header">
        <span className="kpi-label">{label}</span>
      </div>
      <div className="kpi-value count-animate">
        {typeof value === 'number' && value >= 1000
          ? (value / 1000).toFixed(1) + 'K'
          : value}{suffix || ''}
      </div>
      <span className={`kpi-delta ${isUp ? 'up' : 'down'}`}>
        {isUp ? '↑' : '↓'} {Math.abs(delta)}%
        <span style={{ fontWeight: 400, marginLeft: 4, opacity: 0.7 }}>vs last week</span>
      </span>
    </div>
  );
}

// ── Topic Detail Panel ────────────────────────────────────────
function TopicPanel({ topic, onClose }) {
  if (!topic) return null;
  return (
    <div className="topic-panel-overlay" onClick={onClose}>
      <div className="topic-panel" onClick={e => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose}>✕</button>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--brand-primary)', marginBottom: 4 }}>
            {topic.tag}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Trending Topic Details</div>
        </div>

        <div className="stat-row">
          <div className="stat-mini">
            <div className="stat-mini-value">
              {typeof topic.mentions === 'number' ? (topic.mentions / 1000).toFixed(1) : topic.mentions}K
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
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Sentiment</div>
          <span className={`badge badge-${(topic.sentiment || 'neutral').toLowerCase()}`}>
            {topic.sentiment || 'Neutral'}
          </span>
        </div>

        {topic.relatedKeywords && topic.relatedKeywords.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Related Keywords</div>
            <div className="keyword-cloud">
              {topic.relatedKeywords.map(kw => (
                <span key={kw} className="keyword-tag keyword-positive">{kw}</span>
              ))}
            </div>
          </div>
        )}

        {topic.recentPosts && topic.recentPosts.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Recent Posts</div>
            {topic.recentPosts.map((post, i) => (
              <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 8 }}>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 8 }}>
                  "{post.text}"
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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

// ── Overview Page ─────────────────────────────────────────────
export default function Overview() {
  const { platform, setPlatform, setDateRange, setAnalyzed } = useApp();
  const [startDate, setStartDate] = useState('2022-12-31');
  const [endDate, setEndDate] = useState('2023-05-15');
  const dateError = !startDate || !endDate
    ? 'Please select both From and To dates.'
    : startDate > endDate
      ? 'From date cannot be after To date.'
      : null;

  const [showAnalyze, setShowAnalyze] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  const [apiData, setApiData] = useState(null);
  const [audienceAgeGroups, setAudienceAgeGroups] = useState([]);
  const [influencersList, setInfluencersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync date range in AppContext for consistency across views
  useEffect(() => {
    if (startDate && endDate && startDate <= endDate && setDateRange) {
      setDateRange(`${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}`);
    }
  }, [startDate, endDate, setDateRange]);

  useEffect(() => {
    if (!startDate || !endDate || startDate > endDate) {
      return;
    }

    let isMounted = true;
    const abortController = new AbortController();

    const fetchOverview = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          platform: platform || 'all',
          startDate,
          endDate
        });

        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        const [overviewRes, audienceRes, networkRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/overview?${params.toString()}`, { signal: abortController.signal }),
          fetch(`${apiBaseUrl}/api/audience?${params.toString()}`, { signal: abortController.signal }).catch(() => null),
          fetch(`${apiBaseUrl}/api/network?${params.toString()}`, { signal: abortController.signal }).catch(() => null),
        ]);

        if (!overviewRes.ok) {
          throw new Error(`API returned status ${overviewRes.status}`);
        }

        const overviewJson = await overviewRes.json();
        const audienceJson = audienceRes && audienceRes.ok ? await audienceRes.json() : null;
        const networkJson = networkRes && networkRes.ok ? await networkRes.json() : null;

        if (isMounted) {
          if (overviewJson.success && overviewJson.data) {
            setApiData(overviewJson.data);
          } else {
            throw new Error(overviewJson.message || 'Failed to fetch overview data');
          }

          if (audienceJson?.success && Array.isArray(audienceJson.data?.ageGroups)) {
            setAudienceAgeGroups(audienceJson.data.ageGroups);
          } else {
            setAudienceAgeGroups([]);
          }

          if (networkJson?.success && Array.isArray(networkJson.data?.influencers)) {
            const infs = networkJson.data.influencers;
            setInfluencersList(infs);
            setSelectedInfluencer(prev => {
              if (prev && infs.some(i => i.id === prev.id)) {
                return infs.find(i => i.id === prev.id);
              }
              return infs[0] || null;
            });
          } else {
            setInfluencersList([]);
            setSelectedInfluencer(null);
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error('Failed to fetch overview data:', err);
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOverview();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [platform, startDate, endDate]);

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);
  const handleResetDates = () => {
    setStartDate('2022-12-31');
    setEndDate('2023-05-15');
  };

  const data = {
    mentions: apiData?.kpis?.totalMentions ?? 0,
    positive: apiData?.kpis?.positivePercentage ?? 0,
    negative: apiData?.kpis?.negativePercentage ?? 0,
    neutral: apiData?.kpis?.neutralPercentage ?? 0,
    mentionsDelta: apiData?.kpis?.wow?.totalMentions ?? 0,
    posDelta: apiData?.kpis?.wow?.positivePercentage ?? 0,
    negDelta: apiData?.kpis?.wow?.negativePercentage ?? 0,
    neuDelta: apiData?.kpis?.wow?.neutralPercentage ?? 0,
  };

  const timelineData = (apiData?.sentimentTimeline || []).map(item => {
    let displayDate = item.date;
    try {
      const d = new Date(item.date);
      if (!isNaN(d.getTime())) {
        displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch {
      // fallback
    }

    const total = item.total || (item.positive + item.neutral + item.negative) || 0;
    return {
      date: displayDate,
      positive: total > 0 ? Number(((item.positive / total) * 100).toFixed(1)) : item.positive,
      neutral: total > 0 ? Number(((item.neutral / total) * 100).toFixed(1)) : item.neutral,
      negative: total > 0 ? Number(((item.negative / total) * 100).toFixed(1)) : item.negative,
      total: item.total
    };
  });

  const currentTrending = (apiData?.topics || []).map((t, idx) => ({
    id: t.topicId || idx,
    tag: t.topicName?.startsWith('#') ? t.topicName : `#${t.topicName || t.topicId}`,
    mentions: t.postCount || t.count || 0,
    growth: '+0%',
    status: 'Active',
    sentiment: 'Neutral',
    relatedKeywords: [],
    recentPosts: (apiData?.recentPosts || [])
      .filter(p => p.topicName === t.topicName || p.topicId === t.topicId)
      .slice(0, 4)
      .map(p => ({
        text: p.text,
        sentiment: p.sentiment ? p.sentiment.charAt(0).toUpperCase() + p.sentiment.slice(1) : 'Neutral',
        platform: p.platform ? p.platform.charAt(0).toUpperCase() + p.platform.slice(1) : 'Web',
        time: p.createdAt ? new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'
      }))
  }));

  const avatarColors = ['#6366f1', '#3b82f6', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6'];

  return (
    <>
      {showAnalyze && (
        <AnalyzeOverlay onDone={() => {
          setShowAnalyze(false);
          setAnalyzed(true);
        }} />
      )}
      {selectedTopic && <TopicPanel topic={selectedTopic} onClose={() => setSelectedTopic(null)} />}

      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Overview</h1>
          <p>Real-time social intelligence dashboard</p>
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
              <label htmlFor="overview-from-date" className="date-label">From</label>
              <input
                id="overview-from-date"
                type="date"
                className="date-input"
                value={startDate}
                max={endDate || undefined}
                onChange={handleStartDateChange}
              />
            </div>
            <span className="date-separator">–</span>
            <div className="date-field">
              <label htmlFor="overview-to-date" className="date-label">To</label>
              <input
                id="overview-to-date"
                type="date"
                className="date-input"
                value={endDate}
                min={startDate || undefined}
                onChange={handleEndDateChange}
              />
            </div>
            {(startDate !== '2022-12-31' || endDate !== '2023-05-15') && (
              <button
                type="button"
                className="date-reset-btn"
                title="Reset to historical dataset range (2022-12-31 to 2023-05-15)"
                onClick={handleResetDates}
              >
                Reset
              </button>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => setShowAnalyze(true)}>
            Analyze Data
          </button>
        </div>
      </div>

      <div className="page-body">
        {dateError && (
          <div style={{
            padding: '10px 14px',
            marginBottom: 16,
            borderRadius: 'var(--radius-sm, 8px)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: 13,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span>⚠️</span>
            <span>{dateError}</span>
          </div>
        )}
        {error && (
          <div style={{
            padding: '10px 14px',
            marginBottom: 16,
            borderRadius: 'var(--radius-sm, 6px)',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span>⚠️</span>
            <span>Unable to load overview data from API: {error}</span>
          </div>
        )}
        {loading && (
          <div style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-primary, #6366f1)' }}></span>
            <span>Updating overview data...</span>
          </div>
        )}

        {/* KPI Cards */}
        <div className="kpi-grid">
          <KPICard type="mentions" label="Total Mentions" value={data.mentions} delta={data.mentionsDelta} />
          <KPICard type="positive" label="Positive" value={data.positive} delta={data.posDelta} suffix="%" />
          <KPICard type="negative" label="Negative" value={data.negative} delta={data.negDelta} suffix="%" />
          <KPICard type="neutral" label="Neutral" value={data.neutral} delta={data.neuDelta} suffix="%" />
        </div>

        {/* Sentiment Over Time + Audience */}
        <div className="dashboard-grid grid-6040" style={{ marginBottom: 20 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Sentiment Over Time</div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {startDate && endDate ? `${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}` : ''}
              </span>
            </div>
            <div className="card-body">
              {timelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={timelineData} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} />
                    <Line type="monotone" dataKey="positive" name="Positive" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="neutral" name="Neutral" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="negative" name="Negative" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  {loading ? 'Loading timeline...' : 'No sentiment timeline available for this range'}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Audience Demographics</div>
            </div>
            <div className="card-body">
              {audienceAgeGroups.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={audienceAgeGroups}
                        cx="50%" cy="50%"
                        innerRadius={45} outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {audienceAgeGroups.map((entry, i) => (
                          <Cell key={i} fill={entry.color || `hsl(${220 + i * 25}, 70%, 55%)`} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                    {audienceAgeGroups.map((g, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: g.color || `hsl(${220 + i * 25}, 70%, 55%)` }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{g.name}</span>
                        <strong>{g.value}%</strong>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  {loading ? 'Loading demographics...' : 'Audience demographic data unavailable in dataset'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trending Topics + Network */}
        <div className="dashboard-grid grid-6040">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Top Trending Topics</div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Click to explore →</span>
            </div>
            <div className="card-body">
              {currentTrending.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={currentTrending}
                    layout="vertical"
                    margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                    onClick={({ activePayload }) => {
                      if (activePayload?.[0]) {
                        const t = currentTrending.find(t => t.tag === activePayload[0].payload.tag);
                        setSelectedTopic(t);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                    <YAxis type="category" dataKey="tag" tick={{ fontSize: 12, fill: '#475569' }} width={100} />
                    <Tooltip formatter={(v) => [`${(v / 1000).toFixed(1)}K mentions`, 'Mentions']} />
                    <Bar dataKey="mentions" radius={[0, 6, 6, 0]} cursor="pointer">
                      {currentTrending.map((_, i) => (
                        <Cell key={i} fill={['#6366f1', '#3b82f6', '#22d3ee', '#a78bfa', '#10b981'][i % 5]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  {loading ? 'Loading trending topics...' : 'No trending topics found'}
                </div>
              )}
            </div>
          </div>

          {/* Network Influence Overview */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Top Influencers</div>
            </div>
            <div className="card-body" style={{ padding: '12px 16px' }}>
              {influencersList.length > 0 ? (
                influencersList.slice(0, 5).map((inf, i) => (
                  <div
                    key={inf.id || i}
                    className={`influencer-item ${selectedInfluencer?.id === inf.id ? 'active' : ''}`}
                    onClick={() => setSelectedInfluencer(inf)}
                  >
                    <span className="influencer-rank">{i + 1}</span>
                    <div className="influencer-avatar" style={{ background: avatarColors[i % avatarColors.length] }}>
                      {(inf.username || '@?')[1]?.toUpperCase() || 'U'}
                    </div>
                    <div className="influencer-info">
                      <div className="influencer-username">{inf.username}</div>
                      <div className="influencer-name">{inf.community}</div>
                    </div>
                    <span className="influencer-score">{inf.score}</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  {loading ? 'Loading influencers...' : 'Influencer data unavailable'}
                </div>
              )}
            </div>
            {selectedInfluencer && (
              <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-2)', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-primary)', marginBottom: 8 }}>{selectedInfluencer.username}</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[
                    ['Influence', selectedInfluencer.score],
                    ['PageRank', selectedInfluencer.pagerank],
                    ['Connections', typeof selectedInfluencer.connections === 'number' ? selectedInfluencer.connections.toLocaleString() : selectedInfluencer.connections],
                  ].map(([k, v]) => (
                    <div key={k} style={{ fontSize: 12 }}>
                      <span style={{ color: 'var(--text-muted)' }}>{k}: </span>
                      <strong>{v ?? '—'}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
