import { useEffect, useRef, useState } from 'react';
import { useApp } from '../App';

const avatarColors = ['#6366f1', '#3b82f6', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6'];

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

function NetworkCanvas({ nodes = [], edges = [], selectedId, onSelect }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const nodesRef = useRef([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    nodesRef.current = nodes.map((n, i) => ({
      ...n,
      id: n.id != null ? n.id : i,
      r: n.size || 18,
      color: n.color || '#6366f1',
      label: n.label || n.username || `@user_${i}`,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      baseX: n.x != null ? n.x : 100 + (i % 5) * 130,
      baseY: n.y != null ? n.y : 80 + Math.floor(i / 5) * 110,
      x: n.x != null ? n.x : 100 + (i % 5) * 130,
      y: n.y != null ? n.y : 80 + Math.floor(i / 5) * 110,
    }));
  }, [nodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let angle = 0;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Deep dark navy canvas background
      ctx.fillStyle = '#0a0e1a';
      ctx.fillRect(0, 0, W, H);

      // Subtle tech background grid
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let x = 20; x < W; x += 32) {
        for (let y = 20; y < H; y += 32) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const currentNodes = nodesRef.current;
      if (!currentNodes.length) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No network nodes available for selected criteria', W / 2, H / 2);
        return;
      }

      angle += 0.02;

      // Gentle floating motion around base position
      currentNodes.forEach(n => {
        n.x = n.baseX + Math.sin(angle + Number(n.id || 0)) * 3;
        n.y = n.baseY + Math.cos(angle * 0.8 + Number(n.id || 0) * 1.5) * 3;
      });

      // Draw edges
      edges.forEach(edge => {
        const src = currentNodes.find(n => n.id === edge.source);
        const tgt = currentNodes.find(n => n.id === edge.target);
        if (!src || !tgt) return;

        const isHighlighted = selectedId && (src.id === selectedId || tgt.id === selectedId);
        const isHoverEdge = hovered && (src.id === hovered || tgt.id === hovered);

        if (isHighlighted || isHoverEdge) {
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 2.2;
          ctx.shadowColor = '#6366f1';
          ctx.shadowBlur = 8;
        } else {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw nodes
      currentNodes.forEach(node => {
        const isSelected = node.id === selectedId;
        const isHovered = node.id === hovered;
        const r = isSelected ? node.r + 6 : isHovered ? node.r + 3 : node.r;

        // Outer glow
        if (isSelected || isHovered) {
          const glowGrad = ctx.createRadialGradient(node.x, node.y, r * 0.5, node.x, node.y, r * 2.2);
          glowGrad.addColorStop(0, `${node.color}66`);
          glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Outer ring
        ctx.strokeStyle = isSelected ? '#ffffff' : isHovered ? '#67e8f9' : `${node.color}88`;
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 2, 0, Math.PI * 2);
        ctx.stroke();

        // Node circle fill with gradient
        const fillGrad = ctx.createRadialGradient(node.x - r * 0.3, node.y - r * 0.3, 2, node.x, node.y, r);
        fillGrad.addColorStop(0, '#ffffff');
        fillGrad.addColorStop(0.3, node.color);
        fillGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = fillGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Inner initial
        ctx.fillStyle = '#ffffff';
        ctx.font = `700 ${Math.max(10, Math.floor(r * 0.75))}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const initial = (node.label || '').replace('@', '').charAt(0).toUpperCase() || 'U';
        ctx.fillText(initial, node.x, node.y);

        // Node label pill
        ctx.font = `600 ${isSelected ? 12 : 11}px system-ui, sans-serif`;
        const textWidth = ctx.measureText(node.label || '').width;
        const pillW = textWidth + 12;
        const pillH = 18;
        const pillX = node.x - pillW / 2;
        const pillY = node.y + r + 8;

        ctx.fillStyle = isSelected ? 'rgba(99, 102, 241, 0.95)' : 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 9);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(node.label || '', node.x, pillY + 13);
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [selectedId, hovered, edges]);

  const getNodeAt = (x, y) => {
    return nodesRef.current.find(n => {
      const r = n.r || n.size || 18;
      return Math.hypot(n.x - x, n.y - y) <= r + 8;
    });
  };

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const scaleX = e.target.width / rect.width;
    const scaleY = e.target.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const node = getNodeAt(x, y);
    if (node && onSelect) onSelect(node.id);
  };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const scaleX = e.target.width / rect.width;
    const scaleY = e.target.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const node = getNodeAt(x, y);
    setHovered(node ? node.id : null);
    e.target.style.cursor = node ? 'pointer' : 'default';
  };

  return (
    <canvas
      ref={canvasRef}
      width={720}
      height={440}
      className="network-canvas"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      style={{ borderRadius: 'var(--radius-lg)', display: 'block', width: '100%', height: 'auto', background: '#0a0e1a' }}
    />
  );
}

export default function Network() {
  const { platform, setPlatform, setDateRange } = useApp();
  const [startDate, setStartDate] = useState('2022-12-31');
  const [endDate, setEndDate] = useState('2023-05-15');

  const [networkData, setNetworkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedId, setSelectedId] = useState(null);

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

    const fetchNetwork = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const params = new URLSearchParams({
          platform: platform || 'all',
          startDate,
          endDate,
        });
        const res = await fetch(`${apiBaseUrl}/api/network?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }
        const result = await res.json();
        if (isMounted) {
          if (result.success && result.data) {
            setNetworkData(result.data);
            if (result.data.influencers && result.data.influencers.length > 0) {
              setSelectedId(result.data.influencers[0].id);
            } else if (result.data.networkNodes && result.data.networkNodes.length > 0) {
              setSelectedId(result.data.networkNodes[0].id);
            }
          } else {
            setNetworkData(null);
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error('Failed to fetch network data:', err);
          setError(err.message);
          setNetworkData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNetwork();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [platform, startDate, endDate]);

  const handleResetDates = () => {
    setStartDate('2022-12-31');
    setEndDate('2023-05-15');
  };

  const influencers = networkData?.influencers || [];
  const networkNodes = networkData?.networkNodes || [];
  const networkEdges = networkData?.networkEdges || [];
  const communities = networkData?.communities || [];
  const commColors = networkData?.commColors || {
    Technology: '#6366f1',
    Business: '#3b82f6',
    Politics: '#f59e0b',
    Entertainment: '#22d3ee',
    Sports: '#10b981',
    General: '#8b5cf6',
  };

  const selectedInfluencer = influencers.find(inf => inf.id === selectedId) || influencers[0] || null;

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Network Analysis</h1>
          <p>Social influence mapping and community detection</p>
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
              <label htmlFor="net-from-date" className="date-label">From</label>
              <input
                id="net-from-date"
                type="date"
                className="date-input"
                value={startDate}
                max={endDate || undefined}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <span className="date-separator">–</span>
            <div className="date-field">
              <label htmlFor="net-to-date" className="date-label">To</label>
              <input
                id="net-to-date"
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
            <span>Unable to load network data: {error}</span>
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
            <span>Updating network analysis...</span>
          </div>
        )}

        <div className="dashboard-grid network-main-grid">
          {/* Network graph */}
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-header">
                <div className="card-title">Network Influence Graph</div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Click any node to inspect</span>
              </div>
              <div className="card-body" style={{ padding: 0, overflow: 'hidden', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
                <NetworkCanvas
                  nodes={networkNodes}
                  edges={networkEdges}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>
            </div>

            {/* Communities */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Communities</div>
              </div>
              <div className="card-body">
                {communities.length > 0 ? (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {communities.map(c => {
                      const color = commColors[c] || '#6366f1';
                      return (
                        <div
                          key={c}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '6px 14px',
                            borderRadius: 'var(--radius-full)',
                            background: `${color}18`,
                            border: `1px solid ${color}40`,
                            fontSize: 12,
                            fontWeight: 600,
                            color: color,
                          }}
                        >
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                          {c}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {loading ? 'Detecting communities...' : 'No communities identified in this subset'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Selected user */}
            {selectedInfluencer ? (
              <div className="card">
                <div style={{ padding: '20px 18px 16px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                    Network Insights
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div
                      className="influencer-avatar"
                      style={{
                        width: 48,
                        height: 48,
                        fontSize: 18,
                        background: avatarColors[influencers.indexOf(selectedInfluencer) % avatarColors.length]
                      }}
                    >
                      {(selectedInfluencer.username || '@?')[1]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>{selectedInfluencer.username}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedInfluencer.name}</div>
                    </div>
                  </div>
                  {selectedInfluencer.bio && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                      {selectedInfluencer.bio}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      ['Influence Score', selectedInfluencer.score],
                      ['PageRank', selectedInfluencer.pagerank],
                      ['Connections', typeof selectedInfluencer.connections === 'number' ? selectedInfluencer.connections.toLocaleString() : selectedInfluencer.connections],
                      ['Followers', selectedInfluencer.followers || '—'],
                      ['Engagement', selectedInfluencer.engagement || '—'],
                      ['Community', selectedInfluencer.community || '—'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '10px 12px' }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 3 }}>{k}</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--brand-primary)' }}>{v ?? '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                {loading ? 'Loading influencer data...' : 'No influencer selected'}
              </div>
            )}

            {/* Influencer leaderboard */}
            <div className="card" style={{ flex: 1 }}>
              <div className="card-header">
                <div className="card-title">Top Influencers</div>
              </div>
              <div style={{ padding: '8px 4px' }}>
                {influencers.length > 0 ? (
                  influencers.map((inf, i) => (
                    <div
                      key={inf.id || i}
                      className={`influencer-item ${selectedId === inf.id ? 'active' : ''}`}
                      onClick={() => setSelectedId(inf.id)}
                    >
                      <span className="influencer-rank">{i + 1}</span>
                      <div className="influencer-avatar" style={{ width: 32, height: 32, fontSize: 13, background: avatarColors[i % avatarColors.length] }}>
                        {(inf.username || '@?')[1]?.toUpperCase() || 'U'}
                      </div>
                      <div className="influencer-info">
                        <div className="influencer-username" style={{ fontSize: 12 }}>{inf.username}</div>
                        <div className="influencer-name">{inf.community}</div>
                      </div>
                      <div>
                        <div className="influencer-score" style={{ fontSize: 12 }}>{inf.score}</div>
                        {inf.engagement && (
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'right' }}>{inf.engagement}</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                    {loading ? 'Loading influencers...' : 'No influencers identified in dataset for this range'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
