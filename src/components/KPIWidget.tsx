import React from 'react';

interface KPIWidgetProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  glowColor?: 'cyan' | 'green' | 'red' | 'yellow';
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({
  title,
  value,
  icon,
  trend,
  trendType = 'neutral',
  glowColor,
}) => {
  const getGlowStyle = () => {
    switch (glowColor) {
      case 'cyan':
        return 'rgba(0, 240, 255, 0.05) 0px 8px 24px';
      case 'green':
        return 'rgba(57, 255, 20, 0.05) 0px 8px 24px';
      case 'red':
        return 'rgba(239, 68, 68, 0.05) 0px 8px 24px';
      case 'yellow':
        return 'rgba(245, 158, 11, 0.05) 0px 8px 24px';
      default:
        return 'var(--glass-shadow)';
    }
  };

  const getTrendColor = () => {
    if (trendType === 'positive') return 'var(--accent-green)';
    if (trendType === 'negative') return 'var(--status-congested)';
    return 'var(--text-muted)';
  };

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        boxShadow: getGlowStyle(),
        borderLeft: glowColor ? `3px solid var(--accent-${glowColor === 'red' ? 'emergency' : glowColor})` : undefined,
        padding: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        <div style={{ color: 'var(--accent-cyan)', opacity: 0.8 }}>
          {icon}
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.2rem' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {value}
        </span>
        {trend && (
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: getTrendColor() }}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
export default KPIWidget;
