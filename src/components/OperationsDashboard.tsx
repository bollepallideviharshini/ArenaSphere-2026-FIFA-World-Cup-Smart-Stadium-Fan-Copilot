import React, { useState } from 'react';
import { StadiumMetrics, Incident } from '../types/stadium';
import { generateAIDailyReport, generateAIEcoScoreDetails } from '../utils/aiEngine';
import { Leaf, Award, FileText, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

interface OperationsDashboardProps {
  metrics: StadiumMetrics;
  incidents: Incident[];
  onResolveIncident: (id: string) => void;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  metrics,
  incidents,
  onResolveIncident,
}) => {
  const [reportModalContent, setReportModalContent] = useState<string | null>(null);
  
  const ecoDetails = generateAIEcoScoreDetails(metrics);
  const carbonReductionPercent = Math.round((metrics.energySolarKw / (metrics.energySolarKw + metrics.energyGridKw)) * 100);

  const handleGenerateReport = () => {
    const report = generateAIDailyReport(metrics, incidents);
    setReportModalContent(report);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* AI ECO SCORE CARD */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(13,20,35,0.7), rgba(57,255,20,0.03))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
              <Leaf size={16} style={{ color: 'var(--accent-green)' }} /> AI Eco-Efficiency Score
            </h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Proactive Carbon-Offset Tracking</span>
          </div>
          <span style={{ fontSize: '0.65rem', background: 'rgba(57,255,20,0.1)', color: 'var(--accent-green)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Award size={10} /> {ecoDetails.rating} Status
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginTop: '0.85rem' }}>
          {/* Radial score gauge */}
          <div style={{ position: 'relative', width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
            <svg width="72" height="72" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="2.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--accent-green)"
                strokeDasharray={`${metrics.ecoScore}, 100`}
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{metrics.ecoScore}</span>
              <span style={{ fontSize: '0.5rem', color: 'var(--text-secondary)', marginTop: '-4px' }}>/100</span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Solar Microgrid Offset: <strong>{carbonReductionPercent}%</strong> ({metrics.energySolarKw} kW)
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              🌿 Saved: <strong>{metrics.waterSavedLitres}L water</strong> | Recycling sorting: <strong>{metrics.recyclingRatePercent}%</strong>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', background: 'rgba(0,240,255,0.06)', padding: '4px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '0.4rem' }}>
              🌱 Proj. Offset: <strong>-{ecoDetails.carbonReductionKg} kg CO2e</strong>
            </div>
          </div>
        </div>

        {/* AI Recommendations List */}
        <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>AI Carbon Savings Opportunities:</span>
          {ecoDetails.suggestions.map((sug, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', padding: '0.2rem 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>• {sug.text}</span>
              <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>{sug.impact}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CONCESSION QUEUES BAR CHART */}
      <div className="glass-card">
        <h3 style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <Clock size={15} style={{ color: 'var(--accent-cyan)' }} /> Halftime Concession Queues
        </h3>

        {/* Custom SVG Bar Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[
            { name: 'Food Court A (North)', current: 22, predicted: 15 },
            { name: 'Food Court B (East)', current: metrics.avgWaitTimeMin > 24 ? 45 : 28, predicted: 20 },
            { name: 'Food Court C (South)', current: 5, predicted: 8 },
            { name: 'Food Court D (West)', current: 14, predicted: 12 },
          ].map((bar, idx) => {
            const maxVal = 50;
            const currentPct = (bar.current / maxVal) * 100;
            const predictedPct = (bar.predicted / maxVal) * 100;

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{bar.name}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    Live: <strong style={{ color: bar.current > 20 ? 'var(--status-congested)' : 'var(--accent-green)' }}>{bar.current}m</strong> | AI Pred: <strong>{bar.predicted}m</strong>
                  </span>
                </div>
                {/* Visual Bars Container */}
                <div style={{ height: '14px', width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                  {/* Current Wait Time Bar */}
                  <div
                    style={{
                      height: '100%',
                      width: `${currentPct}%`,
                      background: bar.current > 20 ? 'linear-gradient(90deg, #ef4444, #f43f5e)' : 'linear-gradient(90deg, #10b981, #34d399)',
                      borderRadius: '3px',
                      transition: 'width 0.4s ease',
                      position: 'absolute',
                      zIndex: 2,
                    }}
                  />
                  {/* AI Predicted Target Line Indicator */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${predictedPct}%`,
                      top: 0,
                      bottom: 0,
                      width: '2px',
                      background: 'var(--accent-cyan)',
                      zIndex: 3,
                      boxShadow: '0 0 4px var(--accent-cyan)',
                    }}
                    title="AI Predicted Wait Time"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OPERATIONS LOGS & INCIDENT MANAGER */}
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '260px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldAlert size={15} style={{ color: 'var(--status-emergency)' }} /> Incident Dispatch Queue ({incidents.filter(i => i.status === 'active').length})
          </h3>

          <button
            onClick={handleGenerateReport}
            className="btn-secondary"
            style={{ fontSize: '0.65rem', padding: '0.3rem 0.6rem', height: '26px', borderRadius: '4px', background: 'rgba(0, 240, 255, 0.08)', color: 'var(--accent-cyan)', border: '1px solid rgba(0, 240, 255, 0.15)' }}
          >
            <FileText size={10} /> Generate Report
          </button>
        </div>

        {/* Logs Table */}
        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '220px' }}>
          {incidents.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)', fontSize: '0.75rem', gap: '0.4rem', padding: '2rem 0' }}>
              <CheckCircle2 size={24} style={{ color: 'var(--accent-green)' }} />
              No active security or operational alerts.
            </div>
          ) : (
            incidents.map((inc) => (
              <div
                key={inc.id}
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: `1px solid ${inc.status === 'active' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'}`,
                  borderRadius: '8px',
                  padding: '0.6rem 0.8rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: inc.status === 'resolved' ? 0.55 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: inc.status === 'resolved' ? 'var(--status-clear)' : (inc.priority === 'high' ? 'var(--status-emergency)' : 'var(--status-moderate)'),
                    }} />
                    <strong style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>{inc.title}</strong>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{inc.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    {inc.locationName} | Volunteer: <strong>{inc.nearestVolunteerName || 'Unassigned'}</strong>
                    {inc.status === 'active' && inc.volunteerEtaSec && (
                      <span> (ETA: {Math.ceil(inc.volunteerEtaSec / 60)}m)</span>
                    )}
                  </div>
                </div>

                <div>
                  {inc.status === 'active' ? (
                    <button
                      onClick={() => onResolveIncident(inc.id)}
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: 'var(--accent-green)',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                      }}
                    >
                      Resolve
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                      <CheckCircle2 size={10} style={{ color: 'var(--status-clear)' }} /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* DAILY OPERATIONS REPORT GENERATOR MODAL */}
      {reportModalContent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1.5rem',
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '620px',
            background: 'var(--bg-sidebar)',
            border: '1px solid var(--accent-cyan)',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            boxShadow: '0 10px 40px rgba(0, 240, 255, 0.25)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={18} style={{ color: 'var(--accent-cyan)' }} /> AI daily Operations Report
              </h3>
              <button
                onClick={() => setReportModalContent(null)}
                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'var(--text-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
            
            {/* Scrollable markdown simulation */}
            <div style={{
              overflowY: 'auto',
              flex: 1,
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.4',
            }}>
              {reportModalContent}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(reportModalContent);
                  alert('Copied report to clipboard!');
                }}
                className="btn-primary"
                style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem' }}
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setReportModalContent(null)}
                className="btn-secondary"
                style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default OperationsDashboard;
