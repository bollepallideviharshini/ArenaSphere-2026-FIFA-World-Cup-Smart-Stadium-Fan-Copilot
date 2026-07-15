import React from 'react';
import { Persona } from '../types/stadium';
import { Shield, Users, Activity, Eye } from 'lucide-react';

interface NavbarProps {
  currentRole: Persona;
  onRoleChange: (role: Persona) => void;
  accessibilityMode: boolean;
  onToggleAccessibility: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  accessibilityMode,
  onToggleAccessibility,
}) => {
  return (
    <header className="navbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.85rem 1.5rem',
      background: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-green))',
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#050811',
          fontSize: '1.25rem',
        }}>
          A
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            ArenaSphere <span style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', background: 'rgba(0,240,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>2026</span>
          </h1>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '-2px' }}>
            FIFA World Cup Smart Stadium Operations
          </span>
        </div>
      </div>

      {/* Live Match HUD */}
      <div className="live-match-hud" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'rgba(0,0,0,0.3)',
        padding: '0.4rem 0.85rem',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.05)',
        fontSize: '0.8rem',
      }}>
        <span className="pulse-glow-green" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }} />
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>⚽ USA vs. ENG (Group B)</span>
        <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>54'</span>
        <span style={{ color: 'var(--text-muted)' }}>|</span>
        <span style={{ color: 'var(--text-secondary)' }}>Score: 1 - 0</span>
      </div>

      {/* Control Actions & Persona Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        
        {/* Persona Switch Buttons */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
        }}>
          {(['fan', 'staff', 'volunteer'] as Persona[]).map((role) => (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              style={{
                background: currentRole === role ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                border: 'none',
                color: currentRole === role ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}
            >
              {role === 'fan' && <Users size={12} />}
              {role === 'staff' && <Shield size={12} />}
              {role === 'volunteer' && <Activity size={12} />}
              {role}
            </button>
          ))}
        </div>

        {/* Accessibility Mode Trigger */}
        <button
          onClick={onToggleAccessibility}
          style={{
            background: accessibilityMode ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
            border: `1px solid ${accessibilityMode ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
            color: accessibilityMode ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            padding: '0.45rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s',
          }}
          title="Toggle Screen Reader & Contrast Mode"
        >
          <Eye size={13} />
          ♿ {accessibilityMode ? 'Accessibility ON' : 'Accessibility Mode'}
        </button>
      </div>
    </header>
  );
};
