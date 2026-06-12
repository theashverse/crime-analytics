import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import PolicyModal from './PolicyModal';
import { getTopStates } from '../services/api';

export default function ChoroplethMap({ crimes, onStateClick }) {
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, state: '', value: 0, rank: 0 });
  const [selectedState, setSelectedState] = useState(null);
  const [policyState, setPolicyState] = useState(null);

  useEffect(() => {
    if (!crimes.length) return;

    // const stateTotals = crimes.reduce((acc, c) => {
    //   acc[c.state] = (acc[c.state] || 0) + (c.total_cases || 0);
    //   return acc;
    // }, {});

      getTopStates({}).then(r => {
    const stateTotals = {};
    r.data.forEach(d => { stateTotals[d._id] = d.total; }); 

    const values = Object.values(stateTotals);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    // Ranked states for tooltip
    const ranked = Object.entries(stateTotals)
      .sort((a, b) => b[1] - a[1])
      .map((entry, i) => ({ state: entry[0], rank: i + 1 }));

    // Color scale — dark blue to bright purple to red
    const colorScale = d3.scaleSequential()
      .domain([minValue, maxValue])
      .interpolator(d3.interpolate('#1a1f3a', '#7F77DD'));

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 600;
    const height = 580;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Add glow filter
    const defs = svg.append('defs');

    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');

    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Selected glow filter
    const selectedGlow = defs.append('filter')
      .attr('id', 'selectedGlow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    selectedGlow.append('feGaussianBlur')
      .attr('stdDeviation', '6')
      .attr('result', 'coloredBlur');

    const feMerge2 = selectedGlow.append('feMerge');
    feMerge2.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge2.append('feMergeNode').attr('in', 'SourceGraphic');

    const projection = d3.geoMercator()
      .center([80, 22])
      .scale(width * 0.95)
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    fetch('/india_states.geojson')
      .then(r => r.json())
      .then(geoData => {
        const g = svg.append('g');

        const paths = g.selectAll('path')
          .data(geoData.features)
          .join('path')
          .attr('d', pathGenerator)
          .attr('fill', d => {
            const stateName = d.properties.NAME_1 || d.properties.name || d.properties.STATE;
            const value = stateTotals[stateName] || 0;
            return colorScale(value);
          })
          .attr('stroke', 'rgba(127, 119, 221, 0.3)')
          .attr('stroke-width', 0.8)
          .style('cursor', 'pointer')
          .style('transition', 'all 0.3s ease')
          .attr('opacity', 0);

        // Animate states appearing one by one
        paths.transition()
          .duration(800)
          .delay((d, i) => i * 20)
          .attr('opacity', 1);

        // Hover effects
        paths
          .on('mouseover', function(event, d) {
            const stateName = d.properties.NAME_1 || d.properties.name || d.properties.STATE;
            const value = stateTotals[stateName] || 0;
            const rankObj = ranked.find(r => r.state === stateName);

            d3.select(this)
              .raise()
              .transition().duration(200)
              .attr('stroke', '#AFA9EC')
              .attr('stroke-width', 2)
              .attr('filter', 'url(#glow)')
              .attr('opacity', 1)
              .attr('transform', function() {
                const bounds = pathGenerator.bounds(d);
                const cx = (bounds[0][0] + bounds[1][0]) / 2;
                const cy = (bounds[0][1] + bounds[1][1]) / 2;
                return `translate(${cx}, ${cy}) scale(1.03) translate(${-cx}, ${-cy})`;
              });

            setTooltip({
              show: true,
              x: event.offsetX,
              y: event.offsetY,
              state: stateName,
              value,
              rank: rankObj?.rank || '?'
            });
          })
          .on('mousemove', function(event) {
            setTooltip(prev => ({ ...prev, x: event.offsetX, y: event.offsetY }));
          })
          .on('mouseout', function(event, d) {
            const stateName = d.properties.NAME_1 || d.properties.name || d.properties.STATE;
            const isSelected = stateName === selectedState;

            d3.select(this)
              .transition().duration(200)
              .attr('stroke', isSelected ? '#7F77DD' : 'rgba(127, 119, 221, 0.3)')
              .attr('stroke-width', isSelected ? 2.5 : 0.8)
              .attr('filter', isSelected ? 'url(#selectedGlow)' : null)
              .attr('transform', null);

            setTooltip({ show: false });
          })
          .on('click', function(event, d) {
            const stateName = d.properties.NAME_1 || d.properties.name || d.properties.STATE;

            // Reset all states
            g.selectAll('path')
              .transition().duration(200)
              .attr('stroke', 'rgba(127, 119, 221, 0.3)')
              .attr('stroke-width', 0.8)
              .attr('filter', null)
              .attr('opacity', 0.7);

            // Highlight selected
            d3.select(this)
              .raise()
              .transition().duration(200)
              .attr('stroke', '#7F77DD')
              .attr('stroke-width', 2.5)
              .attr('filter', 'url(#selectedGlow)')
              .attr('opacity', 1);

            setSelectedState(stateName);

            if (onStateClick) {
              onStateClick(stateName);
              toast.success(`Filtered: ${stateName}`, {
                style: {
                  background: '#0F3460',
                  border: '1px solid #533AB7',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  borderRadius: '10px'
                },
                icon: '🗺️',
                duration: 2000
              });
            }
          });

        // Add state name labels for bigger states
        g.selectAll('text')
          .data(geoData.features)
          .join('text')
          .attr('x', d => pathGenerator.centroid(d)[0])
          .attr('y', d => pathGenerator.centroid(d)[1])
          .text(d => {
            const name = d.properties.NAME_1 || '';
            const bounds = pathGenerator.bounds(d);
            const width = bounds[1][0] - bounds[0][0];
            return width > 30 ? name.split(' ')[0] : '';
          })
          .attr('font-size', '7px')
          .attr('fill', 'rgba(255,255,255,0.5)')
          .attr('text-anchor', 'middle')
          .attr('pointer-events', 'none')
          .attr('opacity', 0)
          .transition()
          .duration(1000)
          .delay(800)
          .attr('opacity', 1);
      });
    });
  }, [crimes]);
  

  const getRankColor = (rank) => {
    if (rank <= 3) return '#D85A30';
    if (rank <= 10) return '#EF9F27';
    return '#1D9E75';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'rgba(15, 52, 96, 0.2)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(127, 119, 221, 0.2)',
        borderRadius: '16px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(83,58,183,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div>
          <h3 style={{ color: '#CCCCCC', fontSize: '14px', fontWeight: '600' }}>
            🗺️ India Crime Map
          </h3>
          <p style={{ color: '#555A7A', fontSize: '11px', marginTop: '2px' }}>
            Click any state to filter all charts · Hover for details
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '10px', color: '#555A7A' }}>Low</span>
          <div style={{
            width: '100px', height: '6px', borderRadius: '3px',
            background: 'linear-gradient(to right, #1a1f3a, #534AB7, #7F77DD)',
            boxShadow: '0 0 8px rgba(127,119,221,0.3)'
          }} />
          <span style={{ fontSize: '10px', color: '#555A7A' }}>High</span>
        </div>
      </div>

      {/* Map */}
      <div style={{ position: 'relative' }}>
        <svg ref={svgRef} style={{ width: '100%', height: '580px' }} />

        {/* Tooltip */}
        {tooltip.show && (
          <div style={{
            position: 'absolute',
            left: tooltip.x + 15,
            top: tooltip.y - 10,
            background: 'rgba(10, 14, 26, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(127, 119, 221, 0.4)',
            borderRadius: '12px',
            padding: '12px 16px',
            pointerEvents: 'none',
            zIndex: 10,
            minWidth: '160px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>
                {tooltip.state}
              </span>
              <span style={{
                fontSize: '10px', padding: '2px 6px',
                borderRadius: '6px',
                background: `${getRankColor(tooltip.rank)}20`,
                color: getRankColor(tooltip.rank),
                border: `1px solid ${getRankColor(tooltip.rank)}40`
              }}>
                #{tooltip.rank}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '11px', color: '#555A7A' }}>Total Cases</span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#AFA9EC' }}>
                {tooltip.value.toLocaleString()}
              </span>
            </div>

            {/* Mini progress bar */}
            <div style={{
              marginTop: '8px',
              height: '3px',
              background: 'rgba(127,119,221,0.2)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min((tooltip.rank / 35) * 100, 100)}%`,
                background: 'linear-gradient(to right, #7F77DD, #AFA9EC)',
                borderRadius: '2px',
                transition: 'width 0.3s ease'
              }} />
            </div>

            <p style={{ fontSize: '10px', color: '#333A5C', marginTop: '4px' }}>
              Click to filter all charts
            </p>
          </div>
        )}
      </div>

      {/* Reset button */}
      {selectedState && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setSelectedState(null);
            if (onStateClick) onStateClick('');
            toast('Reset to all states', {
              icon: '🔄',
              style: {
                background: '#0F3460',
                border: '1px solid #533AB7',
                color: '#FFFFFF',
                fontSize: '13px'
              }
            });
          }}
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            padding: '8px 16px',
            background: 'rgba(127,119,221,0.2)',
            border: '1px solid rgba(127,119,221,0.4)',
            borderRadius: '8px',
            color: '#AFA9EC',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Reset: {selectedState} ✕
        </motion.button>
      )}

      {selectedState && (
  <motion.button
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    onClick={() => setPolicyState(selectedState)}
    style={{
      position: 'absolute',
      bottom: '24px',
      left: '24px',
      padding: '8px 16px',
      background: 'rgba(29,158,117,0.2)',
      border: '1px solid rgba(29,158,117,0.4)',
      borderRadius: '8px',
      color: '#1D9E75',
      fontSize: '12px',
      cursor: 'pointer'
    }}
  >
    🏛️ Policy for {selectedState}
  </motion.button>
)}

{policyState && (
  <PolicyModal
    state={policyState}
    onClose={() => setPolicyState(null)}
  />
)}
    </motion.div>
  );
}
  