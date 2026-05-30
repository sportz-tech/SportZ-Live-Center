import React, { useState, useEffect } from 'react';
import SportZWidget from './SportZWidget';

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

/**
 * Premium World Cup 2026 / Euro Tournament Dashboard
 * 
 * Displays Group Stage Standings and Top Scorers leaderboards in a bespoke,
 * custom glassmorphism visual layout, completely avoiding generic widgets.
 * 
 * Features:
 * - Tabbed secondary navigation (Group Standings vs. Top Scorers).
 * - Real-time REST API sync with local mock data fallback.
 * - Dynamic goal progress visualizers.
 * - Optimized, responsive flex/grid layouts fitting the main screen.
 */
export default function WorldCupDashboard({ apiHost = 'http://localhost:5000' }) {
  const [activeSubTab, setActiveSubTab] = useState('standings'); // standings or topscorers
  const [standings, setStandings] = useState([]);
  const [topscorers, setTopscorers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Standings
  const fetchStandings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiHost}/api/football/standings`);
      if (res.ok) {
        const data = await res.json();
        // Parse Sportmonks V3 standings format or handle mock array
        setStandings(formatStandingsData(data));
      } else {
        setError("Failed to retrieve live standings.");
      }
    } catch (err) {
      console.error("Error fetching standings:", err);
      setError("Network connection issue.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Topscorers
  const fetchTopscorers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiHost}/api/football/topscorers`);
      if (res.ok) {
        const data = await res.json();
        setTopscorers(formatTopscorersData(data));
      } else {
        setError("Failed to retrieve live topscorers.");
      }
    } catch (err) {
      console.error("Error fetching topscorers:", err);
      setError("Network connection issue.");
    } finally {
      setLoading(false);
    }
  };

  // Format Standings to Group Structure (if parsing from raw Sportmonks V3 format)
  const formatStandingsData = (data) => {
    if (data.length > 0 && data[0].group) {
      // Data is already in our clean Grouped format (local mock fallback)
      return data;
    }

    // Dynamic transform if querying raw Sportmonks V3 standings schema
    try {
      const groupsMap = {};
      data.forEach(item => {
        const groupName = item.group?.name || "Group Stage";
        if (!groupsMap[groupName]) {
          groupsMap[groupName] = [];
        }
        groupsMap[groupName].push({
          rank: item.position,
          name: item.team?.name || "Team",
          logo: item.team?.image_path || "⚽",
          played: item.standing?.played || 0,
          won: item.standing?.won || 0,
          drawn: item.standing?.draw || 0,
          lost: item.standing?.lost || 0,
          gd: item.standing?.overall?.goal_difference || (item.standing?.overall?.goals_scored - item.standing?.overall?.goals_against) || 0,
          points: item.standing?.points || 0
        });
      });

      return Object.keys(groupsMap).map(group => ({
        group,
        teams: groupsMap[group].sort((a, b) => a.rank - b.rank)
      }));
    } catch (err) {
      console.warn("Sportmonks parsing error, using raw payload:", err);
      return [];
    }
  };

  // Format Top Scorers to List (handles raw Sportmonks player include mappings)
  const formatTopscorersData = (data) => {
    if (data.length > 0 && data[0].goals !== undefined) {
      return data; // Already formatted mock fallback
    }

    try {
      return data.map((item, idx) => ({
        rank: idx + 1,
        name: item.player?.common_name || item.player?.display_name || "Player",
        logo: item.player?.image_path || "🏴",
        team: item.team?.name || "Country",
        goals: item.goals || 0,
        assists: item.assists || 0,
        played: item.appearances || 0
      })).sort((a, b) => b.goals - a.goals);
    } catch (err) {
      console.warn("Sportmonks topscorers parsing error:", err);
      return [];
    }
  };

  useEffect(() => {
    if (activeSubTab === 'standings') {
      fetchStandings();
    } else {
      fetchTopscorers();
    }
  }, [activeSubTab]);

  const maxGoals = topscorers.length > 0 ? topscorers[0].goals : 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Sub-navigation Menu Toggles */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '12px 16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: '14px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.4rem' }}>🏆</span>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>World Cup 2026 Center</h2>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Bespoke Live Feeds
            </span>
          </div>
        </div>

        {/* Secondary Pill Toggles */}
        <div 
          className="dashboard-nav-menu"
          style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.04)', padding: '4px', borderRadius: '10px', flexWrap: 'wrap' }}
        >
          <button
            onClick={() => setActiveSubTab('standings')}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: activeSubTab === 'standings' ? 'white' : 'transparent',
              color: activeSubTab === 'standings' ? 'var(--color-football)' : 'var(--text-secondary)',
              boxShadow: activeSubTab === 'standings' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            📊 Group Standings
          </button>
          <button
            onClick={() => setActiveSubTab('topscorers')}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: activeSubTab === 'topscorers' ? 'white' : 'transparent',
              color: activeSubTab === 'topscorers' ? 'var(--color-football)' : 'var(--text-secondary)',
              boxShadow: activeSubTab === 'topscorers' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            👟 Golden Boot Race
          </button>
          <button
            onClick={() => setActiveSubTab('bracket')}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: activeSubTab === 'bracket' ? 'white' : 'transparent',
              color: activeSubTab === 'bracket' ? 'var(--color-football)' : 'var(--text-secondary)',
              boxShadow: activeSubTab === 'bracket' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            🌳 Knockout Bracket
          </button>
        </div>
      </div>

      {/* Loading / Error States */}
      {loading && (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="pulse-spot" style={{ width: '40px', height: '40px', margin: '0 auto 12px auto', background: 'var(--color-football)', borderRadius: '50%', opacity: 0.7 }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Syncing live tournament tables...</span>
        </div>
      )}

      {error && !loading && (
        <div 
          className="glass-panel" 
          style={{ 
            padding: '20px', 
            textAlign: 'center', 
            border: '1px solid rgba(239,68,68,0.2)', 
            backgroundColor: 'rgba(239,68,68,0.05)',
            color: 'var(--color-live)',
            fontSize: '0.85rem'
          }}
        >
          ⚠️ {error} Displaying cached local standings.
        </div>
      )}

      {/* RENDER GROUP STANDINGS TABLES */}
      {!loading && activeSubTab === 'standings' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {standings.map((gp, gIdx) => (
            <div 
              key={gIdx} 
              className="glass-panel" 
              style={{ 
                padding: '16px 20px', 
                background: 'rgba(255, 255, 255, 0.35)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', borderBottom: '1.5px solid rgba(0,0,0,0.04)', paddingBottom: '6px' }}>
                ⚽ {gp.group}
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                      <th style={{ padding: '6px 4px', width: '25px' }}>#</th>
                      <th style={{ padding: '6px 4px' }}>Team</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center', width: '30px' }}>P</th>
                      <th style={{ padding: '6px 4px', textAlign: 'center', width: '30px' }}>GD</th>
                      <th style={{ padding: '6px 4px', textAlign: 'right', width: '30px' }}>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gp.teams.map((t, tIdx) => {
                      const isQualifying = t.rank <= 2;
                      const rowBg = isQualifying ? 'rgba(16, 185, 129, 0.04)' : 'transparent';
                      const badgeBorder = isQualifying ? '2px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(0,0,0,0.08)';
                      
                      return (
                        <tr 
                          key={tIdx} 
                          style={{ 
                            backgroundColor: rowBg, 
                            borderBottom: '1px solid rgba(0,0,0,0.02)',
                            transition: 'background 0.2s'
                          }}
                        >
                          <td style={{ padding: '8px 4px', fontWeight: 800, color: isQualifying ? 'var(--color-cricket)' : 'var(--text-muted)' }}>
                            {t.rank}
                          </td>
                          <td style={{ padding: '8px 4px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center' }}>{renderLogo(t.logo, "⚽")}</span>
                              <span>{t.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '8px 4px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 500 }}>{t.played}</td>
                          <td style={{ padding: '8px 4px', textAlign: 'center', color: t.gd > 0 ? '#047857' : t.gd < 0 ? '#b91c1c' : 'var(--text-muted)', fontWeight: 700 }}>
                            {t.gd > 0 ? `+${t.gd}` : t.gd}
                          </td>
                          <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 800, color: 'var(--text-primary)' }}>{t.points}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RENDER TOPSCORERS / GOLDEN BOOT RACE */}
      {!loading && activeSubTab === 'topscorers' && (
        <div className="glass-panel" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px' }}>
            👟 Golden Boot Leaderboard (Top Goals & Assists)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topscorers.map((p, idx) => {
              const pct = (p.goals / maxGoals) * 100;
              const isLeader = idx === 0;
              
              return (
                <div 
                  key={idx} 
                  className="glass-panel" 
                  style={{ 
                    padding: '12px 16px', 
                    background: isLeader ? 'rgba(79, 70, 229, 0.03)' : 'rgba(255,255,255,0.2)', 
                    border: isLeader ? '1.5px dashed rgba(79, 70, 229, 0.25)' : '1px solid rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Subtle rank highlight */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: 900, 
                        color: isLeader ? 'var(--color-gold)' : 'var(--text-muted)',
                        background: 'rgba(0,0,0,0.03)',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {p.rank}
                      </span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.3rem', display: 'inline-flex', alignItems: 'center' }}>{renderLogo(p.logo, "🏴")}</span>
                        <div>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{p.name}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>{p.team}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Metrics */}
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', fontWeight: 700 }}>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ color: 'var(--color-football)', fontSize: '1.05rem', fontWeight: 900 }}>{p.goals}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: 500 }}>GOALS</span>
                      </div>
                      <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(0,0,0,0.06)', paddingLeft: '12px' }}>
                        <span style={{ color: 'var(--color-cricket)', fontSize: '1.05rem', fontWeight: 900 }}>{p.assists}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: 500 }}>ASSISTS</span>
                      </div>
                      <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(0,0,0,0.06)', paddingLeft: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: 800 }}>{p.played}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: 500 }}>GAMES</span>
                      </div>
                    </div>
                  </div>

                  {/* Goal visualization progress bar */}
                  <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.03)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${pct}%`, 
                        height: '100%', 
                        background: 'linear-gradient(90deg, var(--color-football) 0%, #a78bfa 100%)',
                        borderRadius: '2px',
                        transition: 'width 1s cubic-bezier(0.1, 0.8, 0.1, 1)'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RENDER TOURNAMENT BRACKET */}
      {!loading && activeSubTab === 'bracket' && (
        <div className="glass-panel" style={{ padding: '16px', overflowX: 'auto', maxWidth: '100%', background: 'rgba(255,255,255,0.25)' }}>
          <SportZWidget type="bracket" theme="glass" apiHost={apiHost} />
        </div>
      )}
      
    </div>
  );
}
