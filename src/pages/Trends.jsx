import { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { trendsTableData, trendForecast, trendingTopics } from '../data/mockData';

// ── Trend Origin Timeline Mock Data ───────────────────────────
const trendOriginData = {
  '#AIRevolution': [
    { time: '09:15', step: 'Initial discussion', desc: '12 early tech researchers post about new multimodal AI models', platform: 'Twitter / X', type: 'initial' },
    { time: '10:00', step: 'Several users discuss topic', desc: 'Discussion expands across AI developer groups & Telegram channels (+180 posts)', platform: 'Twitter & Telegram', type: 'community' },
    { time: '10:45', step: 'Influencer mentions it', desc: '@aarav_tech quotes benchmark results — gains 2,400 reposts in 30 mins', platform: 'Twitter / X', type: 'influencer' },
    { time: '11:30', step: 'Rapid engagement increase', desc: 'Mention velocity spikes by +340% with high positive sentiment', platform: 'Cross-Network', type: 'surge' },
    { time: '12:15', step: 'Cross-platform spread', desc: 'Video explainers and carousels trend on Instagram Explore page', platform: 'Instagram & X', type: 'cross_platform' },
    { time: '13:00', step: 'TREND DETECTED', desc: 'SocialSense AI model flags topic as Tier-1 Rising Trend with 96.4% confidence', platform: 'SocialSense AI', type: 'detected' },
  ],
  '#Election2026': [
    { time: '08:30', step: 'Initial discussion', desc: 'Early voter turnout updates and district reports shared by local handles', platform: 'Twitter / X', type: 'initial' },
    { time: '09:15', step: 'Several users discuss topic', desc: 'Over 450 regional community channels amplify district photos & videos', platform: 'Telegram & X', type: 'community' },
    { time: '10:00', step: 'Influencer mentions it', desc: '@vikram_news and @priya_policy share verified live constituency coverage', platform: 'Twitter / X', type: 'influencer' },
    { time: '10:45', step: 'Rapid engagement increase', desc: 'Share rate surges past 1,800 retweets/minute across national metro nodes', platform: 'Cross-Network', type: 'surge' },
    { time: '11:30', step: 'Cross-platform spread', desc: 'Voting guide Reels and live discussion rooms open on Instagram & Telegram', platform: 'All Platforms', type: 'cross_platform' },
    { time: '12:00', step: 'TREND DETECTED', desc: 'High-Priority Alert triggered: Multi-cluster viral cascade detected', platform: 'SocialSense AI', type: 'detected' },
  ],
  '#DigitalIndia': [
    { time: '10:00', step: 'Initial discussion', desc: 'New digital public infrastructure announcement shared by official accounts', platform: 'Twitter / X', type: 'initial' },
    { time: '10:45', step: 'Several users discuss topic', desc: 'Fintech builders and startup founders discuss transaction growth metrics', platform: 'Telegram & X', type: 'community' },
    { time: '11:30', step: 'Influencer mentions it', desc: '@neha_startups publishes detailed thread analyzing economic impact', platform: 'Twitter / X', type: 'influencer' },
    { time: '12:15', step: 'Rapid engagement increase', desc: 'Grassroots merchants and users share personal adoption stories (+220%)', platform: 'Cross-Network', type: 'surge' },
    { time: '13:00', step: 'Cross-platform spread', desc: 'Infographic carousel on rural UPI trends hits 45K saves on Instagram', platform: 'Instagram & X', type: 'cross_platform' },
    { time: '13:30', step: 'TREND DETECTED', desc: 'System confirms sustained positive trend with 94.8% sentiment stability', platform: 'SocialSense AI', type: 'detected' },
  ],
  '#CreatorEconomy': [
    { time: '11:00', step: 'Initial discussion', desc: 'New monetization and revenue-sharing framework discussed in creator circles', platform: 'Instagram', type: 'initial' },
    { time: '11:45', step: 'Several users discuss topic', desc: '380+ visual creators share reaction clips and portfolio examples', platform: 'Instagram & X', type: 'community' },
    { time: '12:30', step: 'Influencer mentions it', desc: 'Top tier tech creators launch collaborative tutorial series on Reels', platform: 'Instagram', type: 'influencer' },
    { time: '13:15', step: 'Rapid engagement increase', desc: 'Over 92,000 likes and 18,000 saves accumulated within 45 minutes', platform: 'Instagram & X', type: 'surge' },
    { time: '14:00', step: 'Cross-platform spread', desc: 'Debate extends into Twitter discussions and Telegram creator hubs', platform: 'All Platforms', type: 'cross_platform' },
    { time: '14:30', step: 'TREND DETECTED', desc: 'Creator trend verified with high engagement velocity across 3 networks', platform: 'SocialSense AI', type: 'detected' },
  ],
};

function TopicDetailPanel({ topic, onClose }) {
  if (!topic) return null;
  const tagKey = topic.tag.startsWith('#') ? topic.tag : `#${topic.tag.replace(/ /g, '')}`;
  const originSteps = trendOriginData[tagKey] || trendOriginData['#AIRevolution'];

  return (
    <div className="topic-panel-overlay" onClick={onClose}>
      <div className="topic-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <button className="panel-close" onClick={onClose}>x</button>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--brand-primary)', marginBottom: 4 }}>
            {topic.tag}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Topic Intelligence & Origin Report</div>
        </div>

        <div className="stat-row">
          <div className="stat-mini">
            <div className="stat-mini-value">{typeof topic.mentions === 'number' ? (topic.mentions / 1000).toFixed(1) : topic.mentions}K</div>
            <div className="stat-mini-label">Mentions</div>
          </div>
          <div className="stat-mini">
            <div className="stat-mini-value" style={{ color: topic.growth.startsWith('+') ? 'var(--color-positive)' : 'var(--color-negative)' }}>
              {topic.growth}
            </div>
            <div className="stat-mini-label">Growth</div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <span className={`badge badge-${(topic.sentiment || 'Positive').toLowerCase()}`}>
            {topic.sentiment || 'Positive'} Sentiment
          </span>
        </div>

        {/* ── Trend Origin Section in Panel ── */}
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
                {/* Connecting line */}
                {idx < originSteps.length - 1 && (
                  <div style={{ position: 'absolute', left: 6, top: 12, bottom: -12, width: 2, background: 'rgba(99,102,241,0.3)' }} />
                )}
                {/* Node dot */}
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

        {topic.relatedKeywords && (
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
                  <span className={`badge badge-${post.sentiment.toLowerCase()}`}>{post.sentiment}</span>
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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeOriginTag, setActiveOriginTag] = useState('#AIRevolution');

  const filtered = trendsTableData.filter(t => {
    const matchSearch = t.topic.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const originSteps = trendOriginData[activeOriginTag] || trendOriginData['#AIRevolution'];

  return (
    <>
      {selectedTopic && <TopicDetailPanel topic={selectedTopic} onClose={() => setSelectedTopic(null)} />}

      <div className="page-header">
        <div className="page-header-left">
          <h1>Trends</h1>
          <p>Real-time trending topic detection, origin analysis, and forecasting</p>
        </div>
      </div>

      <div className="page-body">

        {/* ── 12. TREND ORIGIN SECTION ── */}
        <div className="card" style={{ marginBottom: 24, border: '1px solid rgba(99,102,241,0.25)', background: 'linear-gradient(180deg, rgba(99,102,241,0.03) 0%, transparent 100%)' }}>
          <div className="card-header">
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
              {Object.keys(trendOriginData).map(tag => (
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
            {/* Terminal / Code-styled Chronological Propagation Container */}
            <div style={{
              background: '#090d16',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '24px 28px',
              fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>Chronological Origin Cascade · {activeOriginTag}</span>
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 4 }}>
                  Automated Pattern Extraction
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {originSteps.map((step, idx) => (
                  <div key={idx}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{
                          fontFamily: 'monospace',
                          fontSize: 13,
                          fontWeight: 700,
                          color: step.type === 'detected' ? '#10b981' : '#94a3b8',
                          minWidth: 46
                        }}>
                          {step.time}
                        </span>
                        <div>
                          <div style={{
                            fontSize: 13,
                            fontWeight: step.type === 'detected' ? 800 : 600,
                            color: step.type === 'detected' ? '#10b981' : '#ffffff',
                            letterSpacing: step.type === 'detected' ? '0.04em' : 'normal'
                          }}>
                            {step.step}
                          </div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
                            {step.desc}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontSize: 11,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: 'rgba(255,255,255,0.06)',
                          color: '#cbd5e1',
                          fontWeight: 500
                        }}>
                          {step.platform}
                        </span>
                      </div>
                    </div>

                    {idx < originSteps.length - 1 && (
                      <div style={{ display: 'flex', justifyContent: 'center', color: '#6366f1', fontSize: 13, margin: '2px 0' }}>
                        ↓
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
                {filtered.map((t, i) => {
                  const matchedTopic = trendingTopics.find(tt => tt.tag.toLowerCase().includes(t.topic.split(' ')[0].toLowerCase()));
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{t.topic}</td>
                      <td style={{ fontWeight: 700 }}>{t.mentions.toLocaleString()}</td>
                      <td style={{ fontWeight: 700, color: t.growth.startsWith('+') ? 'var(--color-positive)' : 'var(--color-negative)' }}>
                        {t.growth}
                      </td>
                      <td>
                        <span className={`badge badge-${t.status.toLowerCase()}`}>
                          {t.status}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.platform}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() => {
                            const topic = matchedTopic || { tag: `#${t.topic.replace(/ /g, '')}`, mentions: t.mentions, growth: t.growth, sentiment: 'Mixed', relatedKeywords: ['trend', 'social', 'media', 'analysis', 'data'], recentPosts: [] };
                            setSelectedTopic(topic);
                          }}
                        >
                          Explore Origin →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <div className="card-title">Topic Trend Activity</div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 7 days</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={[
                  { date: 'May 12', ai: 5900, cyber: 4200, digital: 4800 },
                  { date: 'May 13', ai: 6400, cyber: 4600, digital: 5100 },
                  { date: 'May 14', ai: 7100, cyber: 4900, digital: 5400 },
                  { date: 'May 15', ai: 7600, cyber: 5200, digital: 5600 },
                  { date: 'May 16', ai: 7900, cyber: 5500, digital: 5800 },
                  { date: 'May 17', ai: 8100, cyber: 5800, digital: 5750 },
                  { date: 'May 18', ai: 8420, cyber: 6120, digital: 5890 },
                ]}
                margin={{ top: 4, right: 12, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip formatter={(v, n) => [v.toLocaleString(), n]} />
                <Legend iconType="circle" iconSize={8} />
                <Line type="monotone" dataKey="ai" name="AI & Tech" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="cyber" name="Cybersecurity" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="digital" name="Digital India" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forecast */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Trend Forecast</div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>AI-predicted activity for next 7 days</span>
          </div>
          <div style={{ padding: '8px 16px 4px', display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 8, height: 8, background: '#f59e0b', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Powered by SocialSense AI predictive model · 89.4% confidence
            </span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendForecast} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="fgAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fgCyber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fgDigital" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip formatter={(v, n) => [v.toLocaleString(), n]} />
                <Legend iconType="circle" iconSize={8} />
                <Area type="monotone" dataKey="ai" name="AI & Tech" stroke="#6366f1" strokeDasharray="5 3" fill="url(#fgAI)" strokeWidth={2} />
                <Area type="monotone" dataKey="cyber" name="Cybersecurity" stroke="#ef4444" strokeDasharray="5 3" fill="url(#fgCyber)" strokeWidth={2} />
                <Area type="monotone" dataKey="digital" name="Digital India" stroke="#10b981" strokeDasharray="5 3" fill="url(#fgDigital)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
