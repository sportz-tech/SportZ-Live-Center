import React, { useState } from 'react';
import Lineups from './Lineups';
import MatchCharts from './MatchCharts';
import Polls from './Polls';
import CommentaryVoice from './CommentaryVoice';

const renderLogo = (logo, fallback = "⚽", style = {}) => {
  if (!logo) return fallback;
  if (typeof logo === 'string' && (logo.startsWith('http') || logo.startsWith('/') || logo.startsWith('.'))) {
    return (
      <img 
        src={logo} 
        alt="logo" 
        style={{ 
          width: '1.5em', 
          height: '1.5em', 
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

export default function MatchDetail({ match, apiHost }) {
  const [activeTab, setActiveTab] = useState('commentary');

  if (!match) {
    return (
      <div 
        className="glass-panel" 
        style={{ 
          padding: '40px', 
          textAlign: 'center', 
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <span style={{ fontSize: '3rem' }}>🏆</span>
        <h2>Welcome to SportZ Live Center</h2>
        <p style={{ maxWidth: '400px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Select a live, upcoming, recent, or historical match from the sidebar to view stats, interactive polling, and listen to AI live voice commentary.
        </p>
      </div>
    );
  }

  const isCricket = match.sport === 'cricket';
  const isLive = match.status === 'live';
  const sportColor = isCricket ? 'var(--color-cricket)' : 'var(--color-football)';
  const sportBg = isCricket ? 'rgba(16, 185, 129, 0.08)' : 'rgba(59, 130, 246, 0.08)';

  // Tabs list
  const tabs = [
    { id: 'commentary', label: '🎙️ Live Voice & log' },
    { id: 'charts', label: '📊 Stats & Charts' },
    { id: 'lineups', label: '📋 Squad Lineups' },
    { id: 'polls', label: '🗳️ Match Poll' },
    { id: 'timeline', label: '⏳ Match Timeline' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header scoreboard */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '24px', 
          borderLeft: `6px solid ${sportColor}`,
          position: 'relative',
          background: 'white'
        }}
      >
        <span style={{ position: 'absolute', top: '16px', left: '24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {match.league} — {match.venue}
        </span>
        
        <div style={{ position: 'absolute', top: '16px', right: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isLive && <div className="live-pulse" />}
          <span className={`badge badge-${match.status}`}>{match.status}</span>
        </div>
 
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '20px',
            gap: '15px'
          }}
        >
          {/* Home team */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', marginBottom: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{renderLogo(match.homeTeam.logo, "⚽")}</span>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
              {match.homeTeam.name}
            </span>
          </div>

          {/* Scores */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1.5, gap: '6px' }}>
            {match.status !== 'upcoming' ? (
              <>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '2px' }}>
                  {isCricket ? (
                    <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                      <div style={{ color: 'var(--text-primary)' }}>{match.score.home}</div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{match.score.away}</div>
                    </div>
                  ) : (
                    `${match.score.home} - ${match.score.away}`
                  )}
                </span>
                <span 
                  style={{ 
                    fontSize: '0.85rem', 
                    color: isLive ? 'var(--color-live)' : 'var(--text-secondary)',
                    fontWeight: 700, 
                    backgroundColor: isLive ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0,0,0,0.04)',
                    padding: '4px 10px',
                    borderRadius: '6px'
                  }}
                >
                  {isLive ? `LIVE ${match.time}` : match.time}
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>MATCH SCHEDULED</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: sportColor, fontFamily: 'var(--font-display)' }}>
                  {match.time}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{match.date}</span>
              </>
            )}
          </div>

          {/* Away team */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', marginBottom: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{renderLogo(match.awayTeam.logo, "⚽")}</span>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
              {match.awayTeam.name}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div 
        className="glass-panel"
        style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '8px', 
          padding: '6px', 
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.3)' 
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="glass-btn"
              style={{
                flex: 1,
                whiteSpace: 'nowrap',
                padding: '10px 14px',
                fontSize: '0.85rem',
                backgroundColor: isActive ? 'white' : 'transparent',
                color: isActive ? sportColor : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(255,255,255,0.8)' : '1px solid transparent',
                borderRadius: '8px',
                boxShadow: isActive ? '0 4px 10px rgba(0,0,0,0.03)' : 'none'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel Content */}
      <div style={{ transition: 'opacity 0.2s' }}>
        
        {activeTab === 'commentary' && (
          <CommentaryVoice match={match} />
        )}
        
        {activeTab === 'charts' && (
          <MatchCharts match={match} />
        )}
        
        {activeTab === 'lineups' && (
          <Lineups match={match} />
        )}
        
        {activeTab === 'polls' && (
          <Polls match={match} apiHost={apiHost} />
        )}

        {activeTab === 'timeline' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '18px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
              Chronological Match Events
            </h3>
            {match.timeline && match.timeline.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', paddingLeft: '20px' }}>
                
                {/* Visual vertical line representing time */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    bottom: '10px', 
                    left: '5px', 
                    width: '2px', 
                    backgroundColor: '#cbd5e1' 
                  }} 
                />

                {match.timeline.map((event) => (
                  <div key={event.id} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', position: 'relative' }}>
                    
                    {/* Circle dot on the timeline */}
                    <div 
                      style={{ 
                        position: 'absolute', 
                        left: '-20px', 
                        top: '4px', 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        backgroundColor: event.type === 'goal' || event.type === 'boundary' 
                          ? sportColor 
                          : event.type === 'wicket' || event.type === 'red' ? 'var(--color-live)' : 'var(--color-gold)',
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }} 
                    />

                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', minWidth: '45px' }}>
                      {isCricket ? `Ov ${event.over}` : `${event.minute}'`}
                    </span>
                    <div className="glass-panel" style={{ padding: '10px 14px', flex: 1, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(0,0,0,0.03)' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize', display: 'block', marginBottom: '2px' }}>
                        {event.type} — {event.player || event.bowler}
                      </span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {event.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No events recorded for this match yet.
              </div>
            )}
          </div>
        )}

      </div>
      
    </div>
  );
}
