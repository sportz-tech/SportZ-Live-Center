import React, { useState } from 'react';

export default function Lineups({ match }) {
  const [selectedTeam, setSelectedTeam] = useState('home');

  if (!match.lineups) {
    return (
      <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Lineups are not announced yet for this match.
      </div>
    );
  }

  const isCricket = match.sport === 'cricket';

  if (isCricket) {
    const homeLineup = match.lineups.home;
    const awayLineup = match.lineups.away;
    const activeLineup = selectedTeam === 'home' ? homeLineup : awayLineup;
    const activeTeamName = selectedTeam === 'home' ? match.homeTeam.name : match.awayTeam.name;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setSelectedTeam('home')}
            className={`glass-btn ${selectedTeam === 'home' ? 'active' : ''}`}
            style={{ flex: 1 }}
          >
            {match.homeTeam.name}
          </button>
          <button
            onClick={() => setSelectedTeam('away')}
            className={`glass-btn ${selectedTeam === 'away' ? 'active' : ''}`}
            style={{ flex: 1 }}
          >
            {match.awayTeam.name}
          </button>
        </div>

        {/* Batting Card */}
        <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '14px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px', color: 'var(--color-cricket)' }}>
            Batting Scorecard - {activeTeamName}
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '450px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.08)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <th style={{ padding: '8px 4px' }}>Batsman</th>
                <th style={{ padding: '8px 4px' }}>Status</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>R</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>B</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>4s</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>6s</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>SR</th>
              </tr>
            </thead>
            <tbody>
              {activeLineup.batsmen.map((batsman, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '10px 4px', fontWeight: 600 }}>{batsman.name}</td>
                  <td style={{ padding: '10px 4px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{batsman.status}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'right', fontWeight: 700 }}>{batsman.runs}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'right' }}>{batsman.balls}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'right' }}>{batsman.fours}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'right' }}>{batsman.sixes}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'right', color: 'var(--text-secondary)' }}>{batsman.strikeRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bowling Card */}
        <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '14px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px', color: 'var(--color-cricket)' }}>
            Bowling Stats
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '450px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.08)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <th style={{ padding: '8px 4px' }}>Bowler</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>O</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>M</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>R</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>W</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>Econ</th>
              </tr>
            </thead>
            <tbody>
              {activeLineup.bowlers.map((bowler, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '10px 4px', fontWeight: 600 }}>{bowler.name}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'right' }}>{bowler.overs}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'right' }}>{bowler.maidens}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'right' }}>{bowler.runs}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'right', fontWeight: 700, color: 'var(--color-cricket)' }}>{bowler.wickets}</td>
                  <td style={{ padding: '10px 4px', textAlign: 'right', color: 'var(--text-secondary)' }}>{bowler.economy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Football Pitch Visualizer
  const activeFootballLineup = match.lineups[selectedTeam];
  const activeTeam = selectedTeam === 'home' ? match.homeTeam : match.awayTeam;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
        <button
          onClick={() => setSelectedTeam('home')}
          className={`glass-btn ${selectedTeam === 'home' ? 'active' : ''}`}
          style={{ flex: 1 }}
        >
          {match.homeTeam.name} ({activeFootballLineup.formation})
        </button>
        <button
          onClick={() => setSelectedTeam('away')}
          className={`glass-btn ${selectedTeam === 'away' ? 'active' : ''}`}
          style={{ flex: 1 }}
        >
          {match.awayTeam.name} ({match.lineups.away.formation})
        </button>
      </div>

      <div className="football-pitch" style={{ alignSelf: 'center' }}>
        {/* Draw markings */}
        <div className="pitch-midline" />
        <div className="pitch-center-circle" />
        <div className="pitch-penalty-area-top" />
        <div className="pitch-penalty-area-bot" />

        {/* Render Players */}
        {activeFootballLineup.startingXI.map((player, idx) => {
          // grid is [row, col] where row is 1 to 5 from bottom to top, col is 1 to 9 from left to right
          // We translate this to percentage values:
          // Row 1 (GK) should be at the bottom (for home team) or top (for away team)
          // To make it look uniform for the selected team, we can display it from GK at bottom to FW at top.
          const rowVal = player.grid[0];
          const colVal = player.grid[1];

          // Calculate top and left positions based on grid (scaled to fit the pitch coordinates)
          // Rows 1 to 5: GK is at bottom (90%), FWs are at top (15%)
          const topPercent = 95 - (rowVal - 1) * 19;
          // Cols 1 to 9: Col 5 is center (50%), Col 1 is left (10%), Col 9 is right (90%)
          const leftPercent = 10 + (colVal - 1) * 10;

          return (
            <div
              key={idx}
              className="pitch-player"
              style={{
                top: `${topPercent}%`,
                left: `${leftPercent}%`
              }}
            >
              <div 
                className="player-jersey"
                style={{
                  borderColor: selectedTeam === 'home' ? 'var(--color-football)' : 'var(--color-live)',
                  background: 'white'
                }}
              >
                {player.number}
              </div>
              <span className="player-name">{player.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
