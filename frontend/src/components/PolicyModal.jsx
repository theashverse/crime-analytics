import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const priorityColors = {
  High: '#D85A30',
  Medium: '#EF9F27',
  Low: '#1D9E75'
};

export default function PolicyModal({ state, onClose }) {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/policy?state=${state}`);
      setPolicy(res.data);
      setGenerated(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: '#0A0E1A',
            border: '1px solid rgba(127,119,221,0.3)',
            borderRadius: '20px',
            padding: '32px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '85vh',
            overflowY: 'auto'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px'
          }}>
            <div>
              <h2 style={{
                fontSize: '20px', fontWeight: '700',
                background: 'linear-gradient(135deg, #FFFFFF, #AFA9EC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Policy Recommendations
              </h2>
              <p style={{ color: '#555A7A', fontSize: '13px', marginTop: '4px' }}>
                AI-generated analysis for {state}
              </p>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#FFFFFF',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '13px'
            }}>✕</button>
          </div>

          {!generated ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏛️</div>
              <p style={{ color: '#CCCCCC', fontSize: '15px', marginBottom: '8px' }}>
                Generate AI Policy Recommendations
              </p>
              <p style={{ color: '#555A7A', fontSize: '13px', marginBottom: '24px' }}>
                Analyzes crime trends for {state} and generates
                actionable policy recommendations using Groq AI
              </p>
              <button
                onClick={generate}
                disabled={loading}
                style={{
                  padding: '12px 32px',
                  background: loading
                    ? 'rgba(127,119,221,0.3)'
                    : 'linear-gradient(135deg, #7F77DD, #533AB7)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '🤖 Analyzing crime data...' : '✨ Generate Recommendations'}
              </button>
            </div>
          ) : (
            <div>
              {/* Summary */}
              <div style={{
                background: 'rgba(127,119,221,0.08)',
                border: '1px solid rgba(127,119,221,0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <p style={{ fontSize: '11px', color: '#7F77DD', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Executive Summary
                </p>
                <p style={{ fontSize: '13px', color: '#CCCCCC', lineHeight: '1.6' }}>
                  {policy?.summary}
                </p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                  <div>
                    <p style={{ fontSize: '10px', color: '#555A7A' }}>Total Cases</p>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#AFA9EC' }}>
                      {policy?.stateTotal?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#555A7A' }}>vs National Avg</p>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: policy?.comparedToAvg === 'above' ? '#D85A30' : '#1D9E75' }}>
                      {policy?.comparedToAvg === 'above' ? '↑ Above' : '↓ Below'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <p style={{ fontSize: '11px', color: '#555A7A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                Recommendations
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {policy?.recommendations?.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      background: `${priorityColors[rec.priority]}08`,
                      border: `1px solid ${priorityColors[rec.priority]}25`,
                      borderRadius: '12px',
                      padding: '16px'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF' }}>
                        {i + 1}. {rec.title}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span style={{
                          fontSize: '10px', padding: '2px 8px',
                          borderRadius: '10px',
                          background: `${priorityColors[rec.priority]}20`,
                          color: priorityColors[rec.priority],
                          border: `1px solid ${priorityColors[rec.priority]}40`
                        }}>
                          {rec.priority} Priority
                        </span>
                        <span style={{
                          fontSize: '10px', padding: '2px 8px',
                          borderRadius: '10px',
                          background: 'rgba(255,255,255,0.05)',
                          color: '#8888AA'
                        }}>
                          {rec.targetCrime}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: '13px', color: '#AAAAAA', lineHeight: '1.6' }}>
                      {rec.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}