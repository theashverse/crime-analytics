import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getSummary, getStates, getCrimeTypes, getTrends, getCrimes } from '../services/api';
import SummaryCards from '../components/SummaryCards';
import FilterBar from '../components/FilterBar';
import CrimeBarChart from '../components/CrimeBarChart';
import TrendLineChart from '../components/TrendLineChart';
import CrimeDonutChart from '../components/CrimeDonutChart';
import ChoroplethMap from '../components/ChoroplethMap';
import StateClusters from '../components/StateClusters';
import ReportGenerator from '../components/ReportGenerator';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [states, setStates] = useState([]);
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [trends, setTrends] = useState([]);
  const [crimes, setCrimes] = useState([]);
  const [filters, setFilters] = useState({ state: '', year: '', crime_type: '' });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSummary().then(r => setSummary(r.data)).catch(console.error);
    getStates().then(r => setStates(r.data)).catch(console.error);
    getCrimeTypes().then(r => setCrimeTypes(r.data)).catch(console.error);
    getTrends({}).then(r => { setTrends(r.data); setLoaded(true); }).catch(console.error);
  }, []);

  // useEffect(() => {
  //   getCrimes(filters).then(r => setCrimes(r.data)).catch(console.error);
  // }, [filters]);
  useEffect(() => {
    const activeFilters = {};
    if (filters.state) activeFilters.state = filters.state;
    if (filters.year) activeFilters.year = filters.year;
    if (filters.crime_type) activeFilters.crime_type = filters.crime_type;
    getCrimes(activeFilters).then(r => setCrimes(r.data)).catch(console.error);
}, [filters]);

  return (
    <div className="bg-grid" style={{
      minHeight: '100vh',
      background: '#0A0E1A',
      padding: '0',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Ambient background blobs */}
      <div style={{
        position: 'fixed', top: '-200px', left: '-200px',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(83,58,183,0.15) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', bottom: '-200px', right: '-200px',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(29,158,117,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '32px 40px' }}>

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '32px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '4px', height: '40px',
              background: 'linear-gradient(to bottom, #7F77DD, #1D9E75)',
              borderRadius: '2px'
            }} />
            <div>
              <h1 className="gradient-text" style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                Crime Analytics India
              </h1>
              <p style={{ color: '#555A7A', fontSize: '13px', marginTop: '2px' }}>
                NCRB Data 2001–2010 · 35 States · 6 Crime Categories · Powered by AI
              </p>
            </div>
          </div>

          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
            <div className="pulse" style={{
              width: '8px', height: '8px',
              borderRadius: '50%', background: '#1D9E75'
            }} />
            <span style={{ fontSize: '11px', color: '#1D9E75' }}>Live Data Connected</span>
            <span style={{ fontSize: '11px', color: '#333A5C', marginLeft: '12px' }}>
              MongoDB · Node.js API · Prophet ML · Groq AI
            </span>
          </div>

          <div style={{ marginTop: '12px' }}>
         <ReportGenerator
         filters={filters}
         summary={summary}
         crimes={crimes}
         />
         </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <FilterBar
            states={states}
            crimeTypes={crimeTypes}
            filters={filters}
            setFilters={setFilters}
          />
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SummaryCards summary={summary} crimes={crimes} />
        </motion.div>

        {/* Map */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ marginTop: '20px' }}
        >
          <ChoroplethMap
            crimes={crimes}
            onStateClick={(state) => setFilters({ ...filters, state })}
          />
        </motion.div>

        {/* Charts Row */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '20px',
            marginTop: '20px'
          }}
        >
          <CrimeBarChart filters={filters} />
          <CrimeDonutChart filters={filters} />
        </motion.div>

        {/* Trend Chart */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ marginTop: '20px', marginBottom: '40px' }}
        >
          <TrendLineChart trends={trends} filters={filters} />
        </motion.div>

      {/* State Clusters */}
       <motion.div
         initial="hidden"
         animate="visible"
         variants={fadeUp}
         transition={{ duration: 0.6, delay: 0.6 }}
         style={{ marginTop: '20px' }}
>
      <StateClusters />
    </motion.div>

      </div>
    </div>
  );
}