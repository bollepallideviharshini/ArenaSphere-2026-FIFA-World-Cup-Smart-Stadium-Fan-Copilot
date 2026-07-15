import React from 'react';
import { StadiumMetrics, Incident, AIRecommendation } from '../types/stadium';
import { getAIRecommendations } from '../utils/recommendationEngine';
import { Cpu, ArrowUpRight, Sparkles, AlertTriangle } from 'lucide-react';

interface AIInsightsPanelProps {
  metrics: StadiumMetrics;
  activeIncidents: Incident[];
  onTriggerMitigation: (recommendation: AIRecommendation) => void;
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  metrics,
  activeIncidents,
  onTriggerMitigation,
}) => {
  const recommendations = getAIRecommendations(metrics, activeIncidents);

  // Parse global issues to flag on the ops board
  const getActiveAlertsCount = () => {
    let count = 0;
    if (metrics.crowdDensity > 85) count++;
    if (Object.values(metrics.gateCongestion).some(status => status === 'congested')) count++;
    if (metrics.transitStatus.metro !== 'on-time') count++;
    if (metrics.avgWaitTimeMin > 20) count++;
    return count;
  };

  const alertCount = getActiveAlertsCount();

  return (
    <div className="glass-card" style={{
      background: 'linear-gradient(135deg, rgba(13,20,35,0.7), rgba(0,240,255,0.02))',
      borderLeft: '4px solid var(--accent-cyan)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem',
      height: '100%',
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
            <Cpu size={16} style={{ color: 'var(--accent-cyan)' }} /> AI Live Operations Insights
          </h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Real-time automated neural decision support</span>
        </div>

        {alertCount > 0 && (
          <span style={{
            fontSize: '0.6rem',
            background: 'rgba(239, 68, 68, 0.15)',
            color: 'var(--status-emergency)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
          }}>
            <AlertTriangle size={10} /> {alertCount} Alerts
          </span>
        )}
      </div>

      {/* Live AI Recommendations List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, overflowY: 'auto' }}>
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            style={{
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.65rem 0.8rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              position: 'relative',
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
          >
            {/* Top Indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{
                fontSize: '0.55rem',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                color: 'var(--accent-cyan)',
                background: 'rgba(0,240,255,0.06)',
                padding: '1px 5px',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
              }}>
                <Sparkles size={8} /> Recommendation
              </span>
              <span style={{ fontSize: '0.6rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                {rec.impact}
              </span>
            </div>

            {/* Recommendation Text */}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
              {rec.text}
            </p>

            {/* Trigger Button if actionable */}
            {rec.actionable && rec.actionText && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
                <button
                  onClick={() => onTriggerMitigation(rec)}
                  style={{
                    background: 'rgba(0, 240, 255, 0.1)',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    color: 'var(--accent-cyan)',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 240, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)';
                  }}
                >
                  <ArrowUpRight size={10} /> {rec.actionText}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Safety Score Metrics / Operations HUD */}
      <div style={{
        marginTop: 'auto',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '8px',
        padding: '0.6rem 0.8rem',
        border: '1px solid var(--border-color)',
        fontSize: '0.7rem',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--text-muted)' }}>AI Predictive Congestion Index</span>
          <strong style={{ fontSize: '0.85rem', color: metrics.crowdDensity > 85 ? 'var(--status-congested)' : 'var(--text-primary)' }}>
            {metrics.crowdDensity > 85 ? 'CRITICAL SAFETY LOCK' : 'OPTIMAL CROWD FLOW'}
          </strong>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ color: 'var(--text-muted)' }}>Response SLAs</span>
          <strong style={{ fontSize: '0.85rem', color: 'var(--accent-green)' }}>98.4% On Time</strong>
        </div>
      </div>

    </div>
  );
};
export default AIInsightsPanel;
