import { useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import axios from 'axios';
import config from "../config";

export default function ReportGenerator({ filters, summary, crimes }) {
  const [generating, setGenerating] = useState(false);

  const generateReport = async () => {
    setGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // ── Cover Page ──
      doc.setFillColor(10, 14, 26);
      doc.rect(0, 0, pageWidth, 297, 'F');

      // Title
      doc.setTextColor(175, 169, 236);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('Crime Analytics India', pageWidth / 2, 80, { align: 'center' });

      doc.setTextColor(85, 90, 122);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('NCRB Data Analysis Report', pageWidth / 2, 95, { align: 'center' });

      // Divider
      doc.setDrawColor(127, 119, 221);
      doc.setLineWidth(0.5);
      doc.line(40, 105, pageWidth - 40, 105);

      // Report details
      doc.setTextColor(204, 204, 204);
      doc.setFontSize(11);
      const details = [
        `State: ${filters?.state || 'All States'}`,
        `Crime Type: ${filters?.crime_type || 'All Crime Types'}`,
        `Year: ${filters?.year || 'All Years (2001-2010)'}`,
        `Total Records: ${crimes?.length?.toLocaleString() || 0}`,
        `Generated: ${new Date().toLocaleDateString('en-IN')}`,
        `Data Source: National Crime Records Bureau (NCRB)`
      ];

      details.forEach((d, i) => {
        doc.text(d, pageWidth / 2, 125 + (i * 12), { align: 'center' });
      });

      // Footer
      doc.setTextColor(51, 58, 92);
      doc.setFontSize(9);
      doc.text('Powered by MongoDB · Node.js · Python Prophet · Groq AI', pageWidth / 2, 270, { align: 'center' });
      doc.text('Built as a Full Stack + AI + ML Resume Project', pageWidth / 2, 280, { align: 'center' });

      // ── Page 2 — Executive Summary ──
      doc.addPage();
      doc.setFillColor(10, 14, 26);
      doc.rect(0, 0, pageWidth, 297, 'F');

      doc.setTextColor(175, 169, 236);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary', 20, 30);

      doc.setDrawColor(127, 119, 221);
      doc.line(20, 35, pageWidth - 20, 35);

      // Summary stats
      const totalCrimes = crimes?.reduce((sum, c) => sum + (c.total_cases || 0), 0) || 0;

      const stats = [
        { label: 'Total Crimes Recorded', value: totalCrimes.toLocaleString(), color: [175, 169, 236] },
        { label: 'Top State', value: summary?.topState || 'Maharashtra', color: [29, 158, 117] },
        { label: 'Peak Year', value: summary?.peakYear?.toString() || '2010', color: [239, 159, 39] },
        { label: 'Crime Categories', value: '6', color: [216, 90, 48] }
      ];

      stats.forEach((stat, i) => {
        const x = 20 + (i % 2) * 90;
        const y = 55 + Math.floor(i / 2) * 35;

        doc.setFillColor(15, 52, 96);
        doc.roundedRect(x, y, 80, 28, 3, 3, 'F');

        doc.setTextColor(85, 90, 122);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(stat.label.toUpperCase(), x + 6, y + 9);

        doc.setTextColor(...stat.color);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(stat.value, x + 6, y + 21);
      });

      // Crime breakdown table
      doc.setTextColor(175, 169, 236);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Crime Type Breakdown', 20, 140);

      doc.setDrawColor(127, 119, 221);
      doc.line(20, 145, pageWidth - 20, 145);

      // Group by crime type
      const byType = crimes?.reduce((acc, c) => {
        acc[c.crime_type] = (acc[c.crime_type] || 0) + (c.total_cases || 0);
        return acc;
      }, {}) || {};

      const sortedTypes = Object.entries(byType).sort((a, b) => b[1] - a[1]);

      doc.setFont('helvetica', 'normal');
      sortedTypes.forEach(([type, count], i) => {
        const y = 155 + i * 12;
        const pct = ((count / totalCrimes) * 100).toFixed(1);

        doc.setTextColor(204, 204, 204);
        doc.setFontSize(10);
        doc.text(`${i + 1}. ${type}`, 20, y);
        doc.text(count.toLocaleString(), 120, y);
        doc.text(`${pct}%`, 160, y);

        // Mini bar
        doc.setFillColor(83, 58, 183);
        doc.rect(175, y - 4, (count / sortedTypes[0][1]) * 20, 4, 'F');
      });

      // ── Page 3 — Top States ──
      doc.addPage();
      doc.setFillColor(10, 14, 26);
      doc.rect(0, 0, pageWidth, 297, 'F');

      doc.setTextColor(175, 169, 236);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Top States by Crime Count', 20, 30);

      doc.setDrawColor(127, 119, 221);
      doc.line(20, 35, pageWidth - 20, 35);

      // Group by state
      const byState = crimes?.reduce((acc, c) => {
        acc[c.state] = (acc[c.state] || 0) + (c.total_cases || 0);
        return acc;
      }, {}) || {};

      const sortedStates = Object.entries(byState)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);

      sortedStates.forEach(([state, count], i) => {
        const y = 50 + i * 14;
        const barWidth = (count / sortedStates[0][1]) * 80;

        // Rank
        doc.setTextColor(85, 90, 122);
        doc.setFontSize(9);
        doc.text(`#${i + 1}`, 20, y);

        // State name
        doc.setTextColor(204, 204, 204);
        doc.setFontSize(10);
        doc.text(state, 32, y);

        // Bar
        doc.setFillColor(i === 0 ? 127 : i < 3 ? 83 : 60,
          i === 0 ? 119 : i < 3 ? 58 : 52,
          i === 0 ? 221 : i < 3 ? 183 : 137);
        doc.rect(110, y - 5, barWidth, 6, 'F');

        // Count
        doc.setTextColor(175, 169, 236);
        doc.text(count.toLocaleString(), 195, y);
      });

      // ── Page 4 — Policy Recommendations ──
      if (filters?.state) {
        try {
          const policyRes = await axios.get(
  `${config.API_BASE_URL}/api/policy?state=${filters.state}`
);
          const policy = policyRes.data;

          doc.addPage();
          doc.setFillColor(10, 14, 26);
          doc.rect(0, 0, pageWidth, 297, 'F');

          doc.setTextColor(175, 169, 236);
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          doc.text(`Policy Recommendations: ${filters.state}`, 20, 30);

          doc.setDrawColor(127, 119, 221);
          doc.line(20, 35, pageWidth - 20, 35);

          // Summary
          doc.setTextColor(204, 204, 204);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const summaryLines = doc.splitTextToSize(policy.summary || '', pageWidth - 40);
          doc.text(summaryLines, 20, 48);

          // Recommendations
          policy.recommendations?.forEach((rec, i) => {
            const y = 75 + i * 50;
            const color = rec.priority === 'High' ? [216, 90, 48] :
              rec.priority === 'Medium' ? [239, 159, 39] : [29, 158, 117];

            doc.setFillColor(15, 52, 96);
            doc.roundedRect(20, y, pageWidth - 40, 44, 3, 3, 'F');

            doc.setTextColor(...color);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`${i + 1}. ${rec.title}`, 26, y + 10);

            doc.setTextColor(85, 90, 122);
            doc.setFontSize(8);
            doc.text(`${rec.priority} Priority · ${rec.targetCrime}`, 26, y + 18);

            doc.setTextColor(170, 170, 170);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(rec.description || '', pageWidth - 60);
            doc.text(lines, 26, y + 28);
          });
        } catch (e) {
          console.log('Policy fetch skipped');
        }
      }

      // Save
      const filename = `CrimeReport_${filters?.state || 'India'}_${filters?.year || '2001-2010'}.pdf`;
      doc.save(filename);

    } catch (err) {
      console.error('PDF error:', err);
    }
    setGenerating(false);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={generateReport}
      disabled={generating}
      style={{
        padding: '8px 18px',
        background: generating
          ? 'rgba(29,158,117,0.2)'
          : 'linear-gradient(135deg, rgba(29,158,117,0.3), rgba(29,158,117,0.1))',
        border: '1px solid rgba(29,158,117,0.4)',
        borderRadius: '8px',
        color: '#1D9E75',
        fontSize: '12px',
        fontWeight: '600',
        cursor: generating ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      {generating ? '⏳ Generating...' : '📄 Download Report'}
    </motion.button>
  );
}