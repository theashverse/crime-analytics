import { motion } from 'framer-motion';

export default function FilterBar({ states, crimeTypes, filters, setFilters }) {
  const selectStyle = {
    background: 'rgba(15, 52, 96, 0.4)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(127, 119, 221, 0.3)',
    borderRadius: '10px',
    color: '#FFFFFF',
    padding: '10px 14px',
    fontSize: '13px',
    cursor: 'pointer',
    outline: 'none',
    width: '100%',
    transition: 'all 0.3s ease',
    appearance: 'none'
  };

  const labelStyle = {
    fontSize: '10px',
    color: '#555A7A',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    display: 'block',
    marginBottom: '6px',
    fontWeight: '500'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        padding: '20px',
        marginBottom: '8px'
      }}
    >
      <div>
        <label style={labelStyle}>🗺️ State</label>
        <select style={selectStyle} value={filters.state}
          onChange={e => setFilters({ ...filters, state: e.target.value })}>
          <option value="">All States</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>🔍 Crime Type</label>
        <select style={selectStyle} value={filters.crime_type}
          onChange={e => setFilters({ ...filters, crime_type: e.target.value })}>
          <option value="">All Crime Types</option>
          {crimeTypes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>📅 Year</label>
        <select style={selectStyle} value={filters.year}
          onChange={e => setFilters({ ...filters, year: e.target.value })}>
          <option value="">All Years</option>
          {[2001,2002,2003,2004,2005,2006,2007,2008,2009,2010].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}