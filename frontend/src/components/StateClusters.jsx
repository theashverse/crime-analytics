// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { getClusters } from '../services/api';

// export default function StateClusters() {
//   const [clusters, setClusters] = useState([]);
//   const [selectedCluster, setSelectedCluster] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getClusters()
//       .then(r => { setClusters(r.data); setLoading(false); })
//       .catch(() => setLoading(false));
//   }, []);

//   const clusterGroups = clusters.reduce((acc, s) => {
//     if (!acc[s.cluster]) acc[s.cluster] = {
//       name: s.clusterName,
//       color: s.clusterColor,
//       states: []
//     };
//     acc[s.cluster].states.push(s);
//     return acc;
//   }, {});

//   const clusterIcons = {
//     'High Crime': '🔴',
//     'Medium-High Crime': '🟡',
//     'Medium-Low Crime': '🟢',
//     'Low Crime': '🔵'
//   };

//   if (loading) return (
//     <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: '#555A7A' }}>
//       Training K-Means clustering model...
//     </div>
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="glass-card"
//       style={{ padding: '24px' }}
//     >
//       {/* Header */}
//       <div style={{ marginBottom: '20px' }}>
//         <h3 style={{ color: '#CCCCCC', fontSize: '14px', fontWeight: '600' }}>
//           🤖 State Crime Clusters
//         </h3>
//         <p style={{ color: '#555A7A', fontSize: '11px', marginTop: '4px' }}>
//           K-Means ML algorithm grouped 35 states into 4 clusters based on crime patterns
//         </p>
//       </div>

//       {/* Cluster tabs */}
//       <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
//         {Object.entries(clusterGroups).map(([id, group]) => (
//           <button
//             key={id}
//             onClick={() => setSelectedCluster(selectedCluster === id ? null : id)}
//             style={{
//               padding: '6px 14px',
//               borderRadius: '20px',
//               border: `1px solid ${group.color}40`,
//               background: selectedCluster === id
//                 ? `${group.color}25`
//                 : 'rgba(255,255,255,0.03)',
//               color: selectedCluster === id ? group.color : '#555A7A',
//               fontSize: '12px',
//               cursor: 'pointer',
//               transition: 'all 0.2s'
//             }}
//           >
//             {clusterIcons[group.name]} {group.name}
//             <span style={{
//               marginLeft: '6px',
//               background: `${group.color}30`,
//               color: group.color,
//               padding: '1px 6px',
//               borderRadius: '10px',
//               fontSize: '10px'
//             }}>
//               {group.states.length}
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* Cluster cards */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(2, 1fr)',
//         gap: '12px'
//       }}>
//         {Object.entries(clusterGroups)
//           .filter(([id]) => !selectedCluster || selectedCluster === id)
//           .map(([id, group]) => (
//             <motion.div
//               key={id}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               style={{
//                 background: `${group.color}08`,
//                 border: `1px solid ${group.color}25`,
//                 borderRadius: '12px',
//                 padding: '16px'
//               }}
//             >
//               <div style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 marginBottom: '12px'
//               }}>
//                 <span style={{ fontSize: '13px', fontWeight: '600', color: group.color }}>
//                   {clusterIcons[group.name]} {group.name}
//                 </span>
//                 <span style={{
//                   fontSize: '10px', color: '#555A7A',
//                   background: 'rgba(255,255,255,0.05)',
//                   padding: '2px 8px', borderRadius: '10px'
//                 }}>
//                   {group.states.length} states
//                 </span>
//               </div>

//               {/* State pills */}
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
//                 {group.states.map((s, i) => (
//                   <span key={i} style={{
//                     fontSize: '11px',
//                     padding: '3px 10px',
//                     borderRadius: '20px',
//                     background: `${group.color}15`,
//                     border: `1px solid ${group.color}30`,
//                     color: '#CCCCCC'
//                   }}>
//                     {s.state}
//                   </span>
//                 ))}
//               </div>

//               {/* Top crime for this cluster */}
//               {group.states[0] && (
//                 <div style={{
//                   marginTop: '12px',
//                   paddingTop: '12px',
//                   borderTop: `1px solid ${group.color}20`
//                 }}>
//                   <p style={{ fontSize: '10px', color: '#555A7A', marginBottom: '6px' }}>
//                     Dominant crime pattern:
//                   </p>
//                   <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
//                     {Object.entries(group.states[0].crimes || {})
//                       .sort((a, b) => b[1] - a[1])
//                       .slice(0, 3)
//                       .map(([crime, count], i) => (
//                         <span key={i} style={{
//                           fontSize: '10px',
//                           padding: '2px 8px',
//                           borderRadius: '6px',
//                           background: 'rgba(255,255,255,0.05)',
//                           color: '#8888AA'
//                         }}>
//                           {crime}
//                         </span>
//                       ))}
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           ))}
//       </div>
//     </motion.div>
//   );
// }

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getClusters } from '../services/api';

export default function StateClusters() {
  // Initialize state as an empty object since backend returns dictionary keys {"0", "1", ...}
  const [clusterGroups, setClusterGroups] = useState({});
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClusters()
      .then(r => { 
        // Accept the already structured dictionary object from Python directly
        setClusterGroups(r.data || {}); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  const clusterIcons = {
    'High Crime': '🔴',
    'Medium-High Crime': '🟡',
    'Medium-Low Crime': '🟢',
    'Low Crime': '🔵'
  };

  if (loading) return (
    <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: '#555A7A' }}>
      Training K-Means clustering model...
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card"
      style={{ padding: '24px' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#CCCCCC', fontSize: '14px', fontWeight: '600' }}>
          🤖 State Crime Clusters
        </h3>
        <p style={{ color: '#555A7A', fontSize: '11px', marginTop: '4px' }}>
          K-Means ML algorithm grouped 35 states into 4 clusters based on crime patterns
        </p>
      </div>

      {/* Cluster tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {Object.entries(clusterGroups).map(([id, group]) => (
          <button
            key={id}
            onClick={() => setSelectedCluster(selectedCluster === id ? null : id)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: `1px solid ${group.color}40`,
              background: selectedCluster === id
                ? `${group.color}25`
                : 'rgba(255,255,255,0.03)',
              color: selectedCluster === id ? group.color : '#555A7A',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {clusterIcons[group.name]} {group.name}
            <span style={{
              marginLeft: '6px',
              background: `${group.color}30`,
              color: group.color,
              padding: '1px 6px',
              borderRadius: '10px',
              fontSize: '10px'
            }}>
              {group.states?.length || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Cluster cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px'
      }}>
        {Object.entries(clusterGroups)
          .filter(([id]) => !selectedCluster || selectedCluster === id)
          .map(([id, group]) => (
            <motion.div
              key={id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: `${group.color}08`,
                border: `1px solid ${group.color}25`,
                borderRadius: '12px',
                padding: '16px'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: group.color }}>
                  {clusterIcons[group.name]} {group.name}
                </span>
                <span style={{
                  fontSize: '10px', color: '#555A7A',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '2px 8px', borderRadius: '10px'
                }}>
                  {group.states?.length || 0} states
                </span>
              </div>

              {/* State pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {group.states?.map((s, i) => (
                  <span key={i} style={{
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    background: `${group.color}15`,
                    border: `1px solid ${group.color}30`,
                    color: '#CCCCCC'
                  }}>
                    {s.state}
                  </span>
                ))}
              </div>

              {/* Top crime for this cluster */}
              {group.states?.[0] && (
                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: `1px solid ${group.color}20`
                }}>
                  <p style={{ fontSize: '10px', color: '#555A7A', marginBottom: '6px' }}>
                    Dominant crime pattern:
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {Object.entries(group.states[0].crimes || {})
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([crime, count], i) => (
                        <span key={i} style={{
                          fontSize: '10px',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255,255,255,0.05)',
                          color: '#8888AA'
                        }}>
                          {crime}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
}