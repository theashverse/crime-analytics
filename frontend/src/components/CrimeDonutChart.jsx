// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const COLORS = ['#7F77DD', '#1D9E75', '#EF9F27', '#D85A30', '#D4537E', '#378ADD'];

// export default function CrimeDonutChart({ crimes }) {
//   const typeData = crimes.reduce((acc, c) => {
//     const existing = acc.find(a => a.name === c.crime_type);
//     if (existing) existing.value += c.total_cases || 0;
//     else acc.push({ name: c.crime_type, value: c.total_cases || 0 });
//     return acc;
//   }, []);

//   return (
//     <div style={{
//       background: '#0F3460',
//       border: '1px solid #533AB7',
//       borderRadius: '12px',
//       padding: '20px'
//     }}>
//       <h3 style={{ color: '#CCCCCC', fontSize: '13px', marginBottom: '16px' }}>
//         Crime Distribution
//       </h3>
//       <ResponsiveContainer width="100%" height={280}>
//         <PieChart>
//           <Pie
//             data={typeData}
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={90}
//             dataKey="value"
//           >
//             {typeData.map((_, i) => (
//               <Cell key={i} fill={COLORS[i % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip
//             contentStyle={{ background: '#16213E', border: '1px solid #533AB7', borderRadius: '8px' }}
//             itemStyle={{ color: '#AFA9EC' }}
//           />
//           <Legend
//             wrapperStyle={{ fontSize: '11px', color: '#8888AA' }}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCrimeTypeStats } from '../services/api';

const COLORS = ['#7F77DD', '#1D9E75', '#EF9F27', '#D85A30', '#D4537E', '#378ADD'];

export default function CrimeDonutChart({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const params = {};
    if (filters?.state) params.state = filters.state;
    if (filters?.year) params.year = filters.year;

    getCrimeTypeStats(params).then(r => {
      setData(r.data.map(d => ({ name: d._id, value: d.total })));
    }).catch(console.error);
  }, [filters]);

  return (
    <div style={{
      background: 'rgba(15, 52, 96, 0.4)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(127, 119, 221, 0.2)',
      borderRadius: '16px',
      padding: '20px'
    }}>
      <h3 style={{ color: '#CCCCCC', fontSize: '13px', marginBottom: '16px' }}>
        Crime Distribution
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#16213E', border: '1px solid #533AB7', borderRadius: '8px' }}
            itemStyle={{ color: '#AFA9EC' }}
            formatter={(value) => value.toLocaleString()}
          />
          <Legend
            wrapperStyle={{ fontSize: '11px', color: '#8888AA' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}