import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {CountUp} from 'countup.js';

function AnimatedCard({ label, value, color, icon, delay, isNumber }) {
  const countRef = useRef(null);

  useEffect(() => {
    if (isNumber && countRef.current) {
      const num = parseInt(value?.toString().replace(/,/g, '') || '0');
      if (!isNaN(num)) {
        const countUp = new CountUp(countRef.current, num, {
          duration: 2,
          separator: ','
        });
        countUp.start();
      }
    }
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="glass-card"
      style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px',
        width: '80px', height: '80px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`
      }} />

      <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>

      <p style={{
        fontSize: '11px', color: '#555A7A',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: '6px'
      }}>
        {label}
      </p>

      {isNumber ? (
        <p ref={countRef} style={{
          fontSize: '32px', fontWeight: '700', color,
          fontVariantNumeric: 'tabular-nums'
        }}>0</p>
      ) : (
        <p style={{ fontSize: '24px', fontWeight: '700', color }}>
          {value}
        </p>
      )}
    </motion.div>
  );
}

export default function SummaryCards({ summary, crimes }) {
  const totalCrimes = crimes.reduce((sum, c) => sum + (c.total_cases || 0), 0);

  const cards = [
    { label: 'Total Crimes', value: totalCrimes.toLocaleString(), color: '#AFA9EC', icon: '📊', isNumber: true },
    { label: 'Top State', value: summary?.topState || '...', color: '#1D9E75', icon: '🏆', isNumber: false },
    { label: 'Peak Year', value: summary?.peakYear || '...', color: '#EF9F27', icon: '📅', isNumber: false },
    { label: 'Crime Types', value: '6', color: '#D85A30', icon: '🔍', isNumber: true }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginTop: '20px'
    }}>
      {cards.map((card, i) => (
        <AnimatedCard key={i} {...card} delay={i * 0.1} />
      ))}
    </div>
  );
}