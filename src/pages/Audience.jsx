import { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
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

export default function Audience() {
  const { platform, setPlatform, setDateRange } = useApp();
  const [startDate, setStartDate] = useState('2022-12-31');
  const [endDate, setEndDate] = useState('2023-05-15');

  const [audienceData, setAudienceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    const fetchAudience = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          platform: platform || 'all',
          startDate,
          endDate,
        });
        const res = await fetch(`${getApiBaseUrl()}/api/audience?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`);
        }
        const result = await res.json();
        if (isMounted) {
          if (result.success && result.data) {
            setAudienceData(result.data);
          } else {
            setAudienceData(null);
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error('Failed to fetch audience data:', err);
          setError(err.message);
          setAudienceData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAudience();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [platform, startDate, endDate]);

  const handleResetDates = () => {
    setStartDate('2022-12-31');
    setEndDate('2023-05-15');
  };

  const ageGroups = audienceData?.ageGroups || [];
  const gender = audienceData?.gender || [];
  const locations = audienceData?.locations || [];
  const platforms = audienceData?.platforms || [];
  const interests = audienceData?.interests || [];
  const engagementLevels = audienceData?.engagementLevels || [];

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Audience Intelligence</h1>
          <p>Deep demographic and behavioural insights from dataset</p>
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
              <label htmlFor="aud-from-date" className="date-label">From</label>
              <input
                id="aud-from-date"
                type="date"
                className="date-input"
                value={startDate}
                max={endDate || undefined}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <span className="date-separator">–</span>
            <div className="date-field">
              <label htmlFor="aud-to-date" className="date-label">To</label>
              <input
                id="aud-to-date"
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
            <span>Unable to load audience data: {error}</span>
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
            <span>Updating audience data...</span>
          </div>
        )}

        {/* Age + Gender */}
        <div className="dashboard-grid grid-2col" style={{ marginBottom: 20 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Age Distribution</div>
            </div>
            <div className="card-body">
              {ageGroups.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={ageGroups}
                      cx="50%" cy="50%"
                      innerRadius={55} outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={true}
                    >
                      {ageGroups.map((e, i) => (
                        <Cell key={i} fill={e.color || `hsl(${220 + i * 25}, 70%, 55%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={v => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  {loading ? 'Loading...' : 'Demographic data unavailable in dataset'}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Gender Distribution</div>
            </div>
            <div className="card-body">
              {gender.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={gender}
                      cx="50%" cy="50%"
                      innerRadius={55} outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {gender.map((e, i) => (
                        <Cell key={i} fill={e.color || (i === 0 ? '#3b82f6' : i === 1 ? '#ec4899' : '#22d3ee')} />
                      ))}
                    </Pie>
                    <Tooltip formatter={v => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  {loading ? 'Loading...' : 'Gender demographic data unavailable in dataset'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location + Platform */}
        <div className="dashboard-grid grid-6040" style={{ marginBottom: 20 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Top Locations</div>
            </div>
            <div className="card-body">
              {locations.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={locations}
                    layout="vertical"
                    margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis type="category" dataKey="city" tick={{ fontSize: 12, fill: '#475569' }} width={80} />
                    <Tooltip formatter={v => [Number(v).toLocaleString(), 'Users']} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {locations.map((_, i) => (
                        <Cell key={i} fill={`hsl(${220 + i * 12}, 70%, ${60 - i * 3}%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  {loading ? 'Loading locations...' : 'Location data unavailable in dataset'}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Platform Distribution</div>
            </div>
            <div className="card-body">
              {platforms.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={platforms}
                      cx="50%" cy="50%"
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {platforms.map((e, i) => (
                        <Cell key={i} fill={e.color || `hsl(${200 + i * 40}, 80%, 55%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={v => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  {loading ? 'Loading platforms...' : 'Platform distribution unavailable'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interests + Engagement */}
        <div className="dashboard-grid grid-2col">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Top Interests</div>
            </div>
            <div className="card-body">
              {interests.length > 0 ? (
                interests.map((item, i) => (
                  <div key={i} className="progress-bar-row">
                    <span className="progress-label">{item.topic}</span>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${item.pct || item.value || 0}%`,
                          background: `hsl(${220 + i * 20}, 70%, 55%)`
                        }}
                      />
                    </div>
                    <span className="progress-value">{item.pct || item.value || 0}%</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  {loading ? 'Loading interests...' : 'Interest categories unavailable'}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Engagement Levels</div>
            </div>
            <div className="card-body">
              {engagementLevels.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={engagementLevels} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="level" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                    <Tooltip formatter={v => [`${v}%`, 'Users']} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {engagementLevels.map((_, i) => (
                        <Cell key={i} fill={['#6366f1', '#3b82f6', '#22d3ee', '#94a3b8'][i % 4]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  {loading ? 'Loading engagement...' : 'Engagement level metrics unavailable in dataset'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
