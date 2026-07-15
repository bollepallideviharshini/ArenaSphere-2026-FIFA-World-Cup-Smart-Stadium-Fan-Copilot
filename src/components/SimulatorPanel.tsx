import React from 'react';
import { SIMULATION_EVENTS } from '../data/incidents';
import { Zap, RefreshCw } from 'lucide-react';

interface SimulatorPanelProps {
  onTriggerEvent: (eventId: string) => void;
  onReset: () => void;
  activeEventId: string | null;
}

export const SimulatorPanel: React.FC<SimulatorPanelProps> = ({
  onTriggerEvent,
  onReset,
  activeEventId,
}) => {
  // Group simulator events by categories
  const categories = {
    Emergency: SIMULATION_EVENTS.filter(e => e.category === 'Emergency'),
    Crowd: SIMULATION_EVENTS.filter(e => e.category === 'Crowd Control'),
    Transit: SIMULATION_EVENTS.filter(e => e.category === 'Transit'),
    Utility: SIMULATION_EVENTS.filter(e => ['Facility', 'Sustainability', 'Multilingual', 'Weather'].includes(e.category)),
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={16} style={{ color: 'var(--accent-cyan)' }} /> Event & Incident Simulator
          </h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Trigger FIFA 2026 match-day scenarios</span>
        </div>

        <button
          onClick={onReset}
          className="btn-secondary"
          style={{
            fontSize: '0.65rem',
            padding: '0.25rem 0.5rem',
            height: '24px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
          title="Reset Simulation Metrics"
        >
          <RefreshCw size={10} /> Reset
        </button>
      </div>

      {/* Simulator Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', overflowY: 'auto', maxHeight: '310px', paddingRight: '0.2rem' }}>
        
        {/* EMERGENCIES GROUP */}
        <div>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--status-emergency)', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
            🚨 Safety & Medical
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            {categories.Emergency.map((event) => (
              <button
                key={event.id}
                onClick={() => onTriggerEvent(event.id)}
                style={{
                  background: activeEventId === event.id ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${activeEventId === event.id ? 'var(--status-emergency)' : 'var(--border-color)'}`,
                  color: activeEventId === event.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '0.45rem',
                  fontSize: '0.65rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: activeEventId === event.id ? 'bold' : 'normal',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={event.description}
              >
                {event.name}
              </button>
            ))}
          </div>
        </div>

        {/* CROWD CONTROL GROUP */}
        <div>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--status-moderate)', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
            🚪 Crowd Management
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            {categories.Crowd.map((event) => (
              <button
                key={event.id}
                onClick={() => onTriggerEvent(event.id)}
                style={{
                  background: activeEventId === event.id ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${activeEventId === event.id ? 'var(--status-moderate)' : 'var(--border-color)'}`,
                  color: activeEventId === event.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '0.45rem',
                  fontSize: '0.65rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: activeEventId === event.id ? 'bold' : 'normal',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={event.description}
              >
                {event.name}
              </button>
            ))}
          </div>
        </div>

        {/* TRANSIT GROUP */}
        <div>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
            🚇 Transportation Hubs
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            {categories.Transit.map((event) => (
              <button
                key={event.id}
                onClick={() => onTriggerEvent(event.id)}
                style={{
                  background: activeEventId === event.id ? 'rgba(0,240,255,0.15)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${activeEventId === event.id ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                  color: activeEventId === event.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '0.45rem',
                  fontSize: '0.65rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: activeEventId === event.id ? 'bold' : 'normal',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={event.description}
              >
                {event.name}
              </button>
            ))}
          </div>
        </div>

        {/* UTILITIES & WEATHER GROUP */}
        <div>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
            🌿 Concessions, Weather & Sustainability
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            {categories.Utility.map((event) => (
              <button
                key={event.id}
                onClick={() => onTriggerEvent(event.id)}
                style={{
                  background: activeEventId === event.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${activeEventId === event.id ? 'rgba(255,255,255,0.3)' : 'var(--border-color)'}`,
                  color: activeEventId === event.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '0.45rem',
                  fontSize: '0.65rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: activeEventId === event.id ? 'bold' : 'normal',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={event.description}
              >
                {event.name}
              </button>
            ))}
          </div>
        </div>

      </div>

      {activeEventId && (
        <div style={{ background: 'rgba(0, 240, 255, 0.04)', border: '1px solid rgba(0, 240, 255, 0.12)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>
            Active Scenario Description
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.1rem', display: 'block' }}>
            {SIMULATION_EVENTS.find(e => e.id === activeEventId)?.description}
          </span>
        </div>
      )}
      
    </div>
  );
};
export default SimulatorPanel;
