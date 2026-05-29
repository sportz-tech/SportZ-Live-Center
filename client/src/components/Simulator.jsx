import React, { useState } from 'react';

export default function Simulator({ match, isOpen, onClose, apiHost = 'http://localhost:5000' }) {
  // Football Simulator States
  const [fbPlayerName, setFbPlayerName] = useState('');
  const [fbMinute, setFbMinute] = useState('');
  const [fbCardType, setFbCardType] = useState('yellow');
  const [fbEventTeam, setFbEventTeam] = useState('home');

  // Cricket Simulator States
  const [crWicketBatsman, setCrWicketBatsman] = useState('');

  // General States
  const [customCommentary, setCustomCommentary] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!match) return null;

  const isCricket = match.sport === 'cricket';
  const sportColor = isCricket ? 'var(--color-cricket)' : 'var(--color-football)';

  const sendEvent = async (type, details) => {
    setLoading(true);
    setStatusMsg('');
    try {
      const res = await fetch(`${apiHost}/api/simulator/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: match.id,
          type,
          details
        })
      });

      if (res.ok) {
        setStatusMsg('Event injected successfully!');
        setTimeout(() => setStatusMsg(''), 3000);
      } else {
        const err = await res.json();
        setStatusMsg(`Failed: ${err.error}`);
      }
    } catch (err) {
      setStatusMsg('Network error. Is server running?');
    } finally {
      setLoading(false);
    }
  };

  // Football handlers
  const handleFootballGoal = (team) => {
    sendEvent('goal', {
      team,
      player: fbPlayerName || 'L. Messi',
      minute: parseInt(fbMinute) || parseInt(match.time) || 75
    });
    setFbPlayerName('');
  };

  const handleFootballCard = () => {
    sendEvent('card', {
      team: fbEventTeam,
      card: fbCardType,
      player: fbPlayerName || 'R. De Paul',
      minute: parseInt(fbMinute) || parseInt(match.time) || 75
    });
    setFbPlayerName('');
  };

  // Cricket handlers
  const handleCricketRuns = (runs) => {
    sendEvent('runs', {
      runs,
      isExtra: false
    });
  };

  const handleCricketWicket = () => {
    sendEvent('wicket', {
      newBatsman: crWicketBatsman || 'MS Dhoni'
    });
    setCrWicketBatsman('');
  };

  const handleCustomCommentary = () => {
    if (!customCommentary) return;
    sendEvent('commentary', {
      text: customCommentary,
      minute: parseInt(match.time) || 75
    });
    setCustomCommentary('');
  };

  return (
    <div className={`simulator-panel ${isOpen ? 'open' : ''}`}>
      {/* Header */}
      <div 
        style={{ 
          padding: '20px', 
          borderBottom: '1px solid rgba(0,0,0,0.08)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.02)'
        }}
      >
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>⚙️ Event Simulator</h3>
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '1.5rem', 
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          ×
        </button>
      </div>

      {/* Body Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', flex: 1 }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Controlling Match</span>
          <div className="glass-panel" style={{ padding: '12px', marginTop: '6px', borderLeft: `4px solid ${sportColor}`, background: 'rgba(255,255,255,0.4)' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{match.homeTeam.name} vs {match.awayTeam.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
              Sport: {match.sport} | Status: {match.status} | Time: {match.time}
            </span>
          </div>
        </div>

        {statusMsg && (
          <div 
            style={{ 
              padding: '10px 14px', 
              borderRadius: '8px', 
              fontSize: '0.85rem',
              fontWeight: 500,
              backgroundColor: statusMsg.startsWith('Event') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: statusMsg.startsWith('Event') ? '#065f46' : '#991b1b',
              border: `1px solid ${statusMsg.startsWith('Event') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
            }}
          >
            {statusMsg}
          </div>
        )}

        {/* Dynamic Controls based on Sport */}
        {!isCricket ? (
          /* FOOTBALL CONTROLS */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '4px' }}>Football Simulator</h4>
            
            {/* Input Details */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={fbPlayerName}
                onChange={(e) => setFbPlayerName(e.target.value)}
                placeholder="Player Name (e.g. B. Saka)"
                className="glass-input"
                style={{ flex: 1, padding: '6px 10px', fontSize: '0.85rem' }}
              />
              <input
                type="number"
                value={fbMinute}
                onChange={(e) => setFbMinute(e.target.value)}
                placeholder="Min"
                className="glass-input"
                style={{ width: '60px', padding: '6px 6px', fontSize: '0.85rem', textAlign: 'center' }}
              />
            </div>

            {/* Goal Injectors */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleFootballGoal('home')}
                disabled={loading || match.status !== 'live'}
                className="glass-btn"
                style={{ flex: 1, fontSize: '0.85rem', padding: '8px', borderLeft: '4px solid var(--color-football)' }}
              >
                ⚽ Goal {match.homeTeam.shortName}
              </button>
              <button
                onClick={() => handleFootballGoal('away')}
                disabled={loading || match.status !== 'live'}
                className="glass-btn"
                style={{ flex: 1, fontSize: '0.85rem', padding: '8px', borderLeft: '4px solid var(--color-live)' }}
              >
                ⚽ Goal {match.awayTeam.shortName}
              </button>
            </div>

            {/* Card Injectors */}
            <div className="glass-panel" style={{ padding: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>INJECT PENALTY/CARD</span>
              
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
                <select 
                  value={fbEventTeam} 
                  onChange={(e) => setFbEventTeam(e.target.value)}
                  className="glass-input"
                  style={{ flex: 1, padding: '4px 6px' }}
                >
                  <option value="home">{match.homeTeam.name}</option>
                  <option value="away">{match.awayTeam.name}</option>
                </select>
                <select 
                  value={fbCardType} 
                  onChange={(e) => setFbCardType(e.target.value)}
                  className="glass-input"
                  style={{ flex: 1, padding: '4px 6px' }}
                >
                  <option value="yellow">🟨 Yellow Card</option>
                  <option value="red">🟥 Red Card</option>
                </select>
              </div>

              <button
                onClick={handleFootballCard}
                disabled={loading || match.status !== 'live'}
                className="glass-btn btn-football"
                style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
              >
                🚨 Book Player
              </button>
            </div>
          </div>
        ) : (
          /* CRICKET CONTROLS */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '4px' }}>Cricket Simulator</h4>
            
            {/* Run Injector Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>INJECT RUNS (Strikers Ball)</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {[0, 1, 2, 4, 6].map(runs => (
                  <button
                    key={runs}
                    onClick={() => handleCricketRuns(runs)}
                    disabled={loading || match.status !== 'live'}
                    className="glass-btn"
                    style={{ padding: '8px 0', fontSize: '0.9rem', fontWeight: 700 }}
                  >
                    {runs === 6 ? '6️⃣' : runs === 4 ? '4️⃣' : runs}
                  </button>
                ))}
              </div>
            </div>

            {/* Wicket Injector */}
            <div className="glass-panel" style={{ padding: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>INJECT WICKET & INCOMING BATSMAN</span>
              
              <input
                type="text"
                value={crWicketBatsman}
                onChange={(e) => setCrWicketBatsman(e.target.value)}
                placeholder="New Batsman Name (e.g. Dhoni)"
                className="glass-input"
                style={{ padding: '6px 10px', fontSize: '0.85rem' }}
              />
              
              <button
                onClick={handleCricketWicket}
                disabled={loading || match.status !== 'live'}
                className="glass-btn btn-cricket"
                style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
              >
                ☝️ Wicket Out!
              </button>
            </div>
          </div>
        )}

        {/* Custom Commentary Line */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>INJECT CUSTOM COMMENTARY LINE</span>
          <textarea
            value={customCommentary}
            onChange={(e) => setCustomCommentary(e.target.value)}
            placeholder="Type a custom description (will trigger AI voice synthesis automatically!)..."
            className="glass-input"
            rows="3"
            style={{ width: '100%', fontSize: '0.85rem', resize: 'none' }}
          />
          <button
            onClick={handleCustomCommentary}
            disabled={loading || !customCommentary}
            className="glass-btn"
            style={{ 
              width: '100%', 
              fontSize: '0.85rem', 
              padding: '8px',
              backgroundColor: 'white',
              color: 'var(--text-primary)',
              fontWeight: 700
            }}
          >
            📢 Broadcast Commentary
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div 
        style={{ 
          padding: '16px', 
          fontSize: '0.75rem', 
          color: 'var(--text-muted)', 
          textAlign: 'center', 
          borderTop: '1px solid rgba(0,0,0,0.08)',
          backgroundColor: 'rgba(0,0,0,0.01)'
        }}
      >
        Open multiple browser tabs to watch updates broadcast to everyone instantly.
      </div>
    </div>
  );
}
