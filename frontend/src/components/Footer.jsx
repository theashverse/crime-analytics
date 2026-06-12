export default function Footer() {
  const tech = [
    { name: 'MongoDB', color: '#1D9E75' },
    { name: 'Node.js', color: '#68A063' },
    { name: 'React', color: '#61DAFB' },
    { name: 'Python', color: '#EF9F27' },
    { name: 'Prophet ML', color: '#D85A30' },
    { name: 'Groq AI', color: '#AFA9EC' },
    { name: 'D3.js', color: '#F7941E' },
    { name: 'Power BI', color: '#F2C811' },
  ];

  return (
    <footer style={{
      borderTop: '1px solid rgba(127,119,221,0.1)',
      padding: '32px 40px',
      marginTop: '40px',
      background: 'rgba(10,14,26,0.8)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div>
          <div style={{
            fontSize: '16px', fontWeight: '700',
            background: 'linear-gradient(135deg, #FFFFFF, #AFA9EC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            Crime Analytics India
          </div>
          <p style={{ fontSize: '12px', color: '#555A7A', maxWidth: '300px', lineHeight: '1.6' }}>
            An end-to-end crime analytics platform built on real NCRB data
            with ML forecasting and AI-powered insights.
          </p>
        </div>

        <div>
          <p style={{
            fontSize: '10px', color: '#555A7A',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            marginBottom: '12px'
          }}>
            Built With
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxWidth: '400px' }}>
            {tech.map((t, i) => (
              <span key={i} style={{
                fontSize: '11px', padding: '3px 10px',
                borderRadius: '20px',
                background: `${t.color}15`,
                border: `1px solid ${t.color}40`,
                color: t.color
              }}>
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(127,119,221,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '11px', color: '#333A5C' }}>
          Data Source: NCRB (National Crime Records Bureau) · 2001–2010
        </span>
        <span style={{ fontSize: '11px', color: '#333A5C' }}>
          Built as a Resume Project · Full Stack + AI + ML
        </span>
      </div>
    </footer>
  );
}