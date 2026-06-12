import { motion } from 'framer-motion';
import ReportGenerator from './ReportGenerator';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10, 14, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(127, 119, 221, 0.15)',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px'
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'linear-gradient(135deg, #7F77DD, #533AB7)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px'
        }}>📊</div>
        <span style={{
          fontSize: '16px', fontWeight: '700',
          background: 'linear-gradient(135deg, #FFFFFF, #AFA9EC)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          CrimeAnalytics
        </span>
        <span style={{
          fontSize: '10px', padding: '2px 8px',
          background: 'rgba(127,119,221,0.2)',
          border: '1px solid rgba(127,119,221,0.4)',
          borderRadius: '20px', color: '#AFA9EC'
        }}>India</span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {['Overview', 'State Analysis', 'Trends', 'AI Chat'].map((item, i) => (
          <span key={i} style={{
            fontSize: '13px', color: '#555A7A',
            cursor: 'pointer', transition: 'color 0.2s'
          }}
            onMouseEnter={e => e.target.style.color = '#AFA9EC'}
            onMouseLeave={e => e.target.style.color = '#555A7A'}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '6px', height: '6px',
            borderRadius: '50%', background: '#1D9E75'
          }} />
          <span style={{ fontSize: '11px', color: '#1D9E75' }}>Live</span>
        </div>
        
          <a href="https://github.com"
          target="_blank"
          rel="noreferrer"
          style={{
            padding: '6px 16px',
            background: 'rgba(127,119,221,0.15)',
            border: '1px solid rgba(127,119,221,0.3)',
            borderRadius: '8px',
            color: '#AFA9EC',
            fontSize: '12px',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(127,119,221,0.3)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(127,119,221,0.15)'}
        >
          GitHub →
        </a>
      </div>
    </motion.nav>
  );
}