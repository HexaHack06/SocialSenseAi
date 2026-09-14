import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { audienceData } from '../data/mockData';

export default function Audience() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Audience Intelligence</h1>
          <p>Deep demographic and behavioural insights</p>
        </div>
      </div>

      <div className="page-body">
        {/* Age + Gender */}
        <div className="dashboard-grid grid-2col" style={{ marginBottom: 20 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Age Distribution</div>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={audienceData.ageGroups}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={true}
                  >
                    {audienceData.ageGroups.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={v => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Gender Distribution</div>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={audienceData.gender}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {audienceData.gender.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={v => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={audienceData.locations}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="city" tick={{ fontSize: 12, fill: '#475569' }} width={80} />
                  <Tooltip formatter={v => [v.toLocaleString(), 'Users']} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {audienceData.locations.map((_, i) => (
                      <Cell key={i} fill={`hsl(${220 + i * 12}, 70%, ${60 - i * 3}%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Platform Distribution</div>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={audienceData.platforms} cx="50%" cy="50%" outerRadius={75} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                    {audienceData.platforms.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={v => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
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
              {audienceData.interests.map((item, i) => (
                <div key={i} className="progress-bar-row">
                  <span className="progress-label">{item.topic}</span>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${item.pct}%`,
                        background: `hsl(${220 + i * 20}, 70%, 55%)`
                      }}
                    />
                  </div>
                  <span className="progress-value">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Engagement Levels</div>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={audienceData.engagementLevels} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="level" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit="%" />
                  <Tooltip formatter={v => [`${v}%`, 'Users']} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {audienceData.engagementLevels.map((_, i) => (
                      <Cell key={i} fill={['#6366f1', '#3b82f6', '#22d3ee', '#94a3b8'][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
