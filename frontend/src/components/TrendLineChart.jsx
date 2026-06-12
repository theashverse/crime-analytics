import { useState, useEffect } from 'react';
import {
  ComposedChart, Line, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
  ReferenceLine, Legend
} from 'recharts';
import { getForecast } from '../services/api';

export default function TrendLineChart({ trends, filters }) {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters?.state) params.state = filters.state;
    if (filters?.crime_type) params.crime_type = filters.crime_type;

    getForecast(params)
      .then(r => {
        setForecastData(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters]);

  const chartData = forecastData.length > 0 ? forecastData : trends;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isForecast = payload[0]?.payload?.isForecast;
      return (
        <div style={{
          background: '#16213E',
          border: `1px solid ${isForecast ? '#EF9F27' : '#533AB7'}`,
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '12px'
        }}>
          <p style={{ color: '#FFFFFF', fontWeight: 600, marginBottom: '4px' }}>
            {label} {isForecast ? '🔮 Forecast' : ''}
          </p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, margin: '2px 0' }}>
              {p.name}: {p.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      background: '#0F3460',
      border: '1px solid #533AB7',
      borderRadius: '12px',
      padding: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ color: '#CCCCCC', fontSize: '13px' }}>
          Crime Trend + ML Forecast
        </h3>
        {loading && (
          <span style={{ fontSize: '11px', color: '#EF9F27' }}>
            Training Prophet model...
          </span>
        )}
        <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
          <span style={{ color: '#7F77DD' }}>── Historical</span>
          <span style={{ color: '#EF9F27' }}>╌╌ Forecast</span>
          <span style={{ color: '#534AB7' }}>░░ Confidence</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2A45" />
          <XAxis
            dataKey="year"
            tick={{ fill: '#8888AA', fontSize: 10 }}
          />
          <YAxis tick={{ fill: '#8888AA', fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />

          {/* Confidence band */}
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="#534AB7"
            fillOpacity={0.15}
            name="Upper bound"
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="#1B1F3B"
            fillOpacity={1}
            name="Lower bound"
          />

          {/* Actual line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#7F77DD"
            strokeWidth={2.5}
            dot={{ fill: '#7F77DD', r: 4 }}
            activeDot={{ r: 6 }}
            name="Actual"
            connectNulls={false}
          />

          {/* Forecast line */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#EF9F27"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={(props) => {
              if (!props.payload.isForecast) return null;
              return <circle key={props.key} cx={props.cx} cy={props.cy} r={4} fill="#EF9F27" />;
            }}
            name="Forecast"
          />

          {/* Divider line between historical and forecast */}
          <ReferenceLine
            x={2010}
            stroke="#EF9F27"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
            label={{ value: 'Forecast →', fill: '#EF9F27', fontSize: 10 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}