// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// export default function CrimeBarChart({ crimes }) {
//   const stateData = crimes.reduce((acc, c) => {
//     const existing = acc.find(a => a.state === c.state);
//     if (existing) existing.total += c.total_cases || 0;
//     else acc.push({ state: c.state, total: c.total_cases || 0 });
//     return acc;
//   }, [])
//   .sort((a, b) => b.total - a.total)
//   .slice(0, 10);

//   return (
//     <div style={{
//       background: '#0F3460',
//       border: '1px solid #533AB7',
//       borderRadius: '12px',
//       padding: '20px'
//     }}>
//       <h3 style={{ color: '#CCCCCC', fontSize: '13px', marginBottom: '16px' }}>
//         Top States by Crime Count
//       </h3>
//       <ResponsiveContainer width="100%" height={280}>
//         <BarChart data={stateData} layout="vertical">
//           <XAxis type="number" tick={{ fill: '#8888AA', fontSize: 10 }} />
//           <YAxis
//             type="category"
//             dataKey="state"
//             tick={{ fill: '#8888AA', fontSize: 10 }}
//             width={110}
//           />
//           <Tooltip
//             contentStyle={{ background: '#16213E', border: '1px solid #533AB7', borderRadius: '8px' }}
//             labelStyle={{ color: '#FFFFFF' }}
//             itemStyle={{ color: '#AFA9EC' }}
//           />
//           <Bar dataKey="total" radius={[0, 4, 4, 0]}>
//             {stateData.map((_, i) => (
//               <Cell
//                 key={i}
//                 fill={i === 0 ? '#7F77DD' : i < 3 ? '#534AB7' : '#3C3489'}
//               />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getTopStates } from '../services/api';

export default function CrimeBarChart({ filters }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const params = {};
    if (filters?.crime_type) params.crime_type = filters.crime_type;
    if (filters?.year) params.year = filters.year;

    getTopStates(params).then(r => {
      setData(r.data.map(d => ({ state: d._id, total: d.total })));
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
        Top 10 States by Crime Count
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" tick={{ fill: '#8888AA', fontSize: 10 }} />
          <YAxis
            type="category"
            dataKey="state"
            tick={{ fill: '#8888AA', fontSize: 10 }}
            width={120}
          />
          <Tooltip
            contentStyle={{ background: '#16213E', border: '1px solid #533AB7', borderRadius: '8px' }}
            labelStyle={{ color: '#FFFFFF' }}
            itemStyle={{ color: '#AFA9EC' }}
          />
          <Bar dataKey="total" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={i === 0 ? '#7F77DD' : i < 3 ? '#534AB7' : '#3C3489'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}