import React, { useState } from 'react';
import { STADIUM_ZONES, StadiumZone } from '../data/stadiumData';
import { Incident, StadiumMetrics } from '../types/stadium';
import { Navigation, AlertTriangle } from 'lucide-react';

interface StadiumMapProps {
  metrics: StadiumMetrics;
  activeIncidents: Incident[];
  onSelectZone: (zoneName: string) => void;
}

export const StadiumMap: React.FC<StadiumMapProps> = ({
  metrics,
  activeIncidents,
  onSelectZone,
}) => {
  const [selectedZone, setSelectedZone] = useState<StadiumZone | null>(null);

  // Return background color based on crowd density percentage
  const getHeatmapColor = (zone: StadiumZone) => {
    // Modify congestion colors based on metrics overlays
    let crowd = zone.currentCrowdPercent;
    
    if (zone.id === 'gate_b' && metrics.gateCongestion['Gate B (East)'] === 'congested') {
      crowd = 95;
    }
    
    if (zone.type === 'gate') {
      const congestion = metrics.gateCongestion[zone.name];
      if (congestion === 'congested') return 'rgba(239, 68, 68, 0.85)';
      if (congestion === 'moderate') return 'rgba(245, 158, 11, 0.85)';
      if (congestion === 'closed') return 'rgba(75, 85, 99, 0.85)';
      return 'rgba(16, 185, 129, 0.85)';
    }

    if (crowd >= 90) return 'rgba(239, 68, 68, 0.75)'; // Red
    if (crowd >= 70) return 'rgba(245, 158, 11, 0.7)';  // Orange
    if (crowd >= 40) return 'rgba(59, 130, 246, 0.55)';  // Blue
    return 'rgba(16, 185, 129, 0.45)';                  // Green
  };

  const handleZoneClick = (zone: StadiumZone) => {
    setSelectedZone(zone);
  };

  const askAIAboutZone = (zone: StadiumZone) => {
    let query = '';
    if (zone.type === 'concession') {
      query = `Where is the nearest concession? I want to go to ${zone.name}`;
    } else if (zone.type === 'restroom') {
      query = `Where is the nearest restroom? Is ${zone.name} open?`;
    } else if (zone.type === 'transit') {
      query = `How do I get to the ${zone.name}?`;
    } else {
      query = `Show route to ${zone.name}`;
    }
    onSelectZone(query);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>🏟 Stadium Live Map Blueprint</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Click zones to inspect live crowd telemetry and route via AI</p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.65rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.8)' }} /> Congested (90%+)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.8)' }} /> Moderate
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.6)' }} /> Normal
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.5)' }} /> Clear
          </span>
        </div>
      </div>

      {/* SVG Map Container */}
      <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1rem' }}>
        
        {/* Main Stadium Outer Oval Shape */}
        <svg viewBox="0 0 100 100" style={{ width: '100%', maxHeight: '420px', height: '100%' }}>
          {/* Pitch Grid Center lines */}
          <line x1="50" y1="36" x2="50" y2="64" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          
          {/* Soccer Pitch Center */}
          <rect x="35" y="36" width="30" height="28" fill="rgba(57, 255, 20, 0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" rx="1" />

          {/* Render Stadium Zones */}
          {STADIUM_ZONES.map((zone) => {
            const color = getHeatmapColor(zone);
            const { x, y, r } = zone.mapCoords;

            // Highlight border if selected
            const isSelected = selectedZone?.id === zone.id;

            return (
              <g 
                key={zone.id} 
                onClick={() => handleZoneClick(zone)} 
                style={{ cursor: 'pointer' }}
              >
                {/* Visual Circle for Zone */}
                <circle
                  cx={x}
                  cy={y}
                  r={r || 4}
                  fill={color}
                  stroke={isSelected ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={isSelected ? 1.5 : 0.5}
                  style={{ transition: 'all 0.2s ease' }}
                />
                
                {/* Zone Inner Text / Symbol */}
                <text
                  x={x}
                  y={y + 0.8}
                  textAnchor="middle"
                  fill="white"
                  fontSize="2"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {zone.type === 'gate' ? zone.label : ''}
                </text>
              </g>
            );
          })}

          {/* Render Active Incident Markers overlay */}
          {activeIncidents
            .filter((inc) => inc.status === 'active')
            .map((inc) => (
              <g key={inc.id}>
                {/* Concentric pulsing alert ring */}
                <circle
                  cx={inc.mapCoords.x}
                  cy={inc.mapCoords.y}
                  r="6"
                  fill="none"
                  stroke="var(--status-emergency)"
                  strokeWidth="0.8"
                  className="pulse-glow-red"
                  pointerEvents="none"
                />
                <circle
                  cx={inc.mapCoords.x}
                  cy={inc.mapCoords.y}
                  r="2"
                  fill="var(--status-emergency)"
                  pointerEvents="none"
                />
              </g>
            ))}
        </svg>

        {/* Selected Zone Popover panel */}
        {selectedZone && (
          <div 
            className="glass-card"
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              right: '10px',
              background: 'rgba(9, 14, 26, 0.95)',
              border: '1px solid var(--accent-cyan)',
              boxShadow: '0 4px 20px rgba(0, 240, 255, 0.15)',
              borderRadius: '8px',
              padding: '0.75rem',
              zIndex: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{selectedZone.name}</h4>
                <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '3px', textTransform: 'capitalize' }}>
                  {selectedZone.type}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.2rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                <span>👥 Crowd: <strong>{selectedZone.currentCrowdPercent}%</strong></span>
                {selectedZone.waitTimeMin !== undefined && (
                  <span>⏱ Wait: <strong style={{ color: selectedZone.waitTimeMin > 15 ? 'var(--status-moderate)' : 'var(--accent-green)' }}>{selectedZone.waitTimeMin} mins</strong></span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => askAIAboutZone(selectedZone)}
                className="btn-primary"
                style={{ fontSize: '0.65rem', padding: '0.35rem 0.6rem', borderRadius: '4px' }}
              >
                <Navigation size={10} /> Route via AI
              </button>
              <button
                onClick={() => setSelectedZone(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', padding: '0.35rem', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Incidents Quick-Indicator List */}
      {activeIncidents.filter(i => i.status === 'active').length > 0 && (
        <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.6rem 0.8rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--status-emergency)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <AlertTriangle size={12} /> Active Safety Bottlenecks & Incidents:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.1rem' }}>
            {activeIncidents.filter(i => i.status === 'active').map(inc => (
              <span 
                key={inc.id}
                onClick={() => setSelectedZone(STADIUM_ZONES.find(z => z.name.includes(inc.locationName.split(' ')[0])) || null)}
                style={{ 
                  flexShrink: 0, 
                  background: 'rgba(0,0,0,0.3)', 
                  border: '1px solid rgba(239,68,68,0.15)', 
                  fontSize: '0.65rem', 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                {inc.title} ({inc.locationName})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
