import { useEffect, useRef, useState } from 'react';
import { influencers, networkNodes, networkEdges } from '../data/mockData';

const avatarColors = ['#6366f1', '#3b82f6', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6'];

function NetworkCanvas({ selectedId, onSelect }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const nodesRef = useRef(
    networkNodes.map(n => ({
      ...n,
      r: n.size || 18,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      baseX: n.x,
      baseY: n.y,
    }))
  );
  const [hovered, setHovered] = useState(null);

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

      angle += 0.02;
      const nodes = nodesRef.current;

      // Gentle floating motion around base position
      nodes.forEach(n => {
        n.x = n.baseX + Math.sin(angle + n.id) * 3;
        n.y = n.baseY + Math.cos(angle * 0.8 + n.id * 1.5) * 3;
      });

      // Draw edges
      networkEdges.forEach(edge => {
        const src = nodes.find(n => n.id === edge.source);
        const tgt = nodes.find(n => n.id === edge.target);
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
      nodes.forEach(node => {
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
        const initial = node.label.replace('@', '').charAt(0).toUpperCase();
        ctx.fillText(initial, node.x, node.y);

        // Node label pill
        ctx.font = `600 ${isSelected ? 12 : 11}px system-ui, sans-serif`;
        const textWidth = ctx.measureText(node.label).width;
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
        ctx.fillText(node.label, node.x, pillY + 13);
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [selectedId, hovered]);

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
    if (node) onSelect(node.id);
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
  const [selectedId, setSelectedId] = useState(1);
  const selectedInfluencer = influencers.find(inf => inf.id === selectedId) || influencers[0];

  const communities = ['Technology', 'Policy & Gov', 'Media & News', 'Startups', 'Cybersecurity', 'Environment'];
  const commColors = {
    Technology: '#6366f1',
    'Policy & Gov': '#3b82f6',
    'Media & News': '#22d3ee',
    Startups: '#f59e0b',
    Cybersecurity: '#ef4444',
    Environment: '#10b981',
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Network Analysis</h1>
          <p>Social influence mapping and community detection</p>
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          {/* Network graph */}
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-header">
                <div className="card-title">Network Influence Graph</div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Click any node to inspect</span>
              </div>
              <div className="card-body" style={{ padding: 0, overflow: 'hidden', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
                <NetworkCanvas selectedId={selectedId} onSelect={setSelectedId} />
              </div>
            </div>

            {/* Communities */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Communities</div>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {communities.map(c => (
                    <div
                      key={c}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        background: `${commColors[c] || '#6366f1'}18`,
                        border: `1px solid ${commColors[c] || '#6366f1'}40`,
                        fontSize: 12,
                        fontWeight: 600,
                        color: commColors[c] || '#6366f1',
                      }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: commColors[c] || '#6366f1' }} />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Selected user */}
            <div className="card">
              <div style={{ padding: '20px 18px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                  Network Insights
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div
                    className="influencer-avatar"
                    style={{ width: 48, height: 48, fontSize: 18, background: avatarColors[influencers.indexOf(selectedInfluencer) % avatarColors.length] }}
                  >
                    {selectedInfluencer.username[1].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{selectedInfluencer.username}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedInfluencer.name}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                  {selectedInfluencer.bio}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    ['Influence Score', selectedInfluencer.score],
                    ['PageRank', selectedInfluencer.pagerank],
                    ['Connections', selectedInfluencer.connections.toLocaleString()],
                    ['Followers', selectedInfluencer.followers],
                    ['Engagement', selectedInfluencer.engagement],
                    ['Community', selectedInfluencer.community],
                  ].map(([k, v]) => (
                    <div key={k} style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 3 }}>{k}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--brand-primary)' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Influencer leaderboard */}
            <div className="card" style={{ flex: 1 }}>
              <div className="card-header">
                <div className="card-title">Top Influencers</div>
              </div>
              <div style={{ padding: '8px 4px' }}>
                {influencers.map((inf, i) => (
                  <div
                    key={inf.id}
                    className={`influencer-item ${selectedId === inf.id ? 'active' : ''}`}
                    onClick={() => setSelectedId(inf.id)}
                  >
                    <span className="influencer-rank">{i + 1}</span>
                    <div className="influencer-avatar" style={{ width: 32, height: 32, fontSize: 13, background: avatarColors[i % avatarColors.length] }}>
                      {inf.username[1].toUpperCase()}
                    </div>
                    <div className="influencer-info">
                      <div className="influencer-username" style={{ fontSize: 12 }}>{inf.username}</div>
                      <div className="influencer-name">{inf.community}</div>
                    </div>
                    <div>
                      <div className="influencer-score" style={{ fontSize: 12 }}>{inf.score}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'right' }}>{inf.engagement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
