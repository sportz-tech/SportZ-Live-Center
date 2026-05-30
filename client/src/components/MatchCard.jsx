import React from 'react';

const renderLogo = (logo, fallback = "⚽", style = {}) => {
  if (!logo) return fallback;
  if (typeof logo === 'string' && (logo.startsWith('http') || logo.startsWith('/') || logo.startsWith('.'))) {
    return (
      <img 
        src={logo} 
        alt="logo" 
        style={{ 
          width: '1.2em', 
          height: '1.2em', 
          objectFit: 'contain', 
          borderRadius: '4px',
          display: 'inline-block',
          verticalAlign: 'middle',
          ...style 
        }} 
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  }
  return logo;
};

export default function MatchCard({ match, isSelected, onClick }) {
  const isLive = match.status === 'live';
  const isCricket = match.sport === 'cricket';
  const accentColor = isCricket ? 'var(--color-cricket)' : 'var(--color-football)';
  const accentBg = isCricket ? 'rgba(16, 185, 129, 0.06)' : 'rgba(59, 130, 246, 0.06)';

  return (
    <div
      onClick={onClick}
      className={`glass-panel glass-panel-hover`}
      style={{
        padding: '20px',
        cursor: 'pointer',
        borderLeft: isSelected 
          ? `6px solid ${accentColor}` 
          : `3px solid ${isSelected ? accentColor : 'transparent'}`,
        background: isSelected ? 'white' : 'var(--glass-bg)',
        boxShadow: isSelected ? '0 10px 25px rgba(0, 0, 0, 0.08)' : 'var(--glass-shadow)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Sport accent glow strip */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: accentColor,
          opacity: 0.8
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {match.league}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isLive && <div className="live-pulse" />}
          <span className={`badge badge-${match.status}`}>
            {match.status}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Home Team */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem', display: 'inline-flex', alignItems: 'center' }}>{renderLogo(match.homeTeam.logo, "⚽")}</span>
            <span style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              {match.homeTeam.name}
            </span>
          </div>
          {match.status !== 'upcoming' && !isCricket && (
            <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {match.score.home}
            </span>
          )}
        </div>

        {/* Away Team */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem', display: 'inline-flex', alignItems: 'center' }}>{renderLogo(match.awayTeam.logo, "⚽")}</span>
            <span style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              {match.awayTeam.name}
            </span>
          </div>
          {match.status !== 'upcoming' && !isCricket && (
            <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {match.score.away}
            </span>
          )}
        </div>
      </div>

      {/* Cricket Score Display */}
      {isCricket && match.status !== 'upcoming' && (
        <div 
          style={{ 
            marginTop: '12px', 
            padding: '10px', 
            borderRadius: '8px', 
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>{match.homeTeam.shortName}:</span>
            <span style={{ fontWeight: 700 }}>{match.score.home}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>{match.awayTeam.shortName}:</span>
            <span style={{ fontWeight: 700 }}>{match.score.away}</span>
          </div>
        </div>
      )}

      {/* Match Footer Status */}
      <div 
        style={{ 
          marginTop: '16px', 
          paddingTop: '12px', 
          borderTop: '1px solid rgba(0,0,0,0.05)', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem'
        }}
      >
        <span style={{ color: isLive ? 'var(--color-live)' : 'var(--text-secondary)', fontWeight: isLive ? 600 : 500 }}>
          {isLive ? (isCricket ? `Live - ${match.time}` : `Live - ${match.time}`) : match.time}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          {match.venue}
        </span>
      </div>
    </div>
  );
}
