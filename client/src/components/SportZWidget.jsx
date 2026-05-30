import React, { useState, useEffect } from 'react';
import AdSenseAd from './AdSenseAd';

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
 * Premium Self-Contained SportZ Widget Engine
 * 
 * Renders any of the 6 core tournament widgets:
 * 1. standings - Group stage standing tables
 * 2. topscorers - Golden Boot progress leaderboards
 * 3. livescores - Match listing grids
 * 4. fixtures - Calendar/round scheduled matches
 * 5. bracket - Interactive visual Knockout bracket tree
 * 6. matchcentre - Detailed single match console (Stats, Lineup, Events, Commentary)
 * 
 * Supports 4 themes:
 * - glass: Crystal Glassmorphism (Default)
 * - dark: Midnight Obsidian Dark Cyberpunk
 * - light: Pristine Snow Crisp Light
 * - gold: Championship Royal Gold Gradients
 */
export default function SportZWidget({
  type = 'standings',
  theme = 'glass',
  accent = '#3b82f6',
  font = 'Outfit',
  borders = 'rounded',
  config = {},
  selectedMatchIdProp = null,
  apiHost = 'http://localhost:5000',
  licenseKey = null
}) {
  const [standings, setStandings] = useState([]);
  const [topscorers, setTopscorers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeMatchId, setActiveMatchId] = useState(selectedMatchIdProp);
  const [matchDetail, setMatchDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Local sub-tab for Match Centre detail view
  const [detailSubTab, setDetailSubTab] = useState('timeline'); // timeline, stats, lineups, commentary
  
  // Local metric sub-tab for Top Scorers (Goals, Assists, Yellow Cards, Red Cards)
  const [scorerMetric, setScorerMetric] = useState(config.defaultMetric || 'goals');

  // --- THEME DEFINITIONS ---
  const themeStyles = {
    glass: {
      background: 'rgba(255, 255, 255, 0.45)',
      backdropFilter: 'blur(14px) saturate(140%)',
      WebkitBackdropFilter: 'blur(14px) saturate(140%)',
      border: borders === 'sharp' ? '1.5px solid rgba(255,255,255,0.7)' : '1px solid rgba(255, 255, 255, 0.6)',
      borderRadius: borders === 'sharp' ? '0px' : borders === 'glass' ? '24px' : '16px',
      color: '#1e293b',
      textMuted: '#64748b',
      shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
      tableRowHover: 'rgba(255,255,255,0.25)',
      cardBg: 'rgba(255,255,255,0.3)',
      inputBg: 'rgba(255,255,255,0.4)',
      accentLight: 'rgba(59, 130, 246, 0.12)'
    },
    dark: {
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(16px) saturate(120%)',
      WebkitBackdropFilter: 'blur(16px) saturate(120%)',
      border: borders === 'sharp' ? '1.5px solid rgba(255,255,255,0.1)' : '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: borders === 'sharp' ? '0px' : borders === 'glass' ? '24px' : '16px',
      color: '#f8fafc',
      textMuted: '#94a3b8',
      shadow: '0 10px 40px 0 rgba(0, 0, 0, 0.4)',
      tableRowHover: 'rgba(255,255,255,0.05)',
      cardBg: 'rgba(30, 41, 59, 0.7)',
      inputBg: 'rgba(30, 41, 59, 0.9)',
      accentLight: 'rgba(59, 130, 246, 0.2)'
    },
    light: {
      background: '#ffffff',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      border: borders === 'sharp' ? '1.5px solid #cbd5e1' : '1px solid #e2e8f0',
      borderRadius: borders === 'sharp' ? '0px' : borders === 'glass' ? '24px' : '16px',
      color: '#0f172a',
      textMuted: '#64748b',
      shadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      tableRowHover: '#f8fafc',
      cardBg: '#f1f5f9',
      inputBg: '#ffffff',
      accentLight: 'rgba(59, 130, 246, 0.08)'
    },
    gold: {
      background: 'linear-gradient(135deg, rgba(254, 253, 244, 0.95) 0%, rgba(254, 240, 138, 0.98) 100%)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: borders === 'sharp' ? '2.5px solid #d97706' : '1.5px solid rgba(234, 179, 8, 0.5)',
      borderRadius: borders === 'sharp' ? '0px' : borders === 'glass' ? '28px' : '18px',
      color: '#451a03',
      textMuted: '#78350f',
      shadow: '0 8px 32px rgba(234, 179, 8, 0.15)',
      tableRowHover: 'rgba(254, 249, 195, 0.6)',
      cardBg: 'rgba(253, 224, 71, 0.2)',
      inputBg: '#ffffff',
      accentLight: 'rgba(234, 179, 8, 0.15)'
    }
  };

  const style = themeStyles[theme] || themeStyles.glass;
  const activeFont = font === 'Outfit' ? "'Outfit', sans-serif" : font === 'Roboto' ? "'Roboto', sans-serif" : "'Inter', sans-serif";

  // Dynamic CSS variables setup
  const wrapperStyle = {
    fontFamily: activeFont,
    color: style.color,
    background: style.background,
    backdropFilter: style.backdropFilter,
    WebkitBackdropFilter: style.WebkitBackdropFilter,
    border: style.border,
    borderRadius: style.borderRadius,
    boxShadow: style.shadow,
    padding: '24px',
    width: '100%',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  };

  // --- API DATA FETCHING ---
  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        if (type === 'standings') {
          const res = await fetch(`${apiHost}/api/football/standings`);
          if (res.ok) {
            const data = await res.json();
            setStandings(formatStandingsData(data));
          } else {
            setError("Failed to fetch live standings.");
          }
        } else if (type === 'topscorers') {
          const res = await fetch(`${apiHost}/api/football/topscorers`);
          if (res.ok) {
            const data = await res.json();
            setTopscorers(formatTopscorersData(data));
          } else {
            setError("Failed to fetch topscorers.");
          }
        } else if (type === 'livescores' || type === 'fixtures' || type === 'matchcentre') {
          const res = await fetch(`${apiHost}/api/matches`);
          if (res.ok) {
            const data = await res.json();
            setMatches(data);
            
            // Auto select active match for matchcentre
            const defaultId = selectedMatchIdProp || (data.length > 0 ? data[0].id : null);
            if (!activeMatchId && defaultId) {
              setActiveMatchId(defaultId);
            }
          } else {
            setError("Failed to sync matches.");
          }
        }
      } catch (err) {
        console.error("Widget API Error:", err);
        setError("Connection timeout. Offline cache loaded.");
        loadLocalFallbacks();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [type, apiHost]);

  // Load detailed single match for matchcentre view
  useEffect(() => {
    if (type !== 'matchcentre' || !activeMatchId) return;

    const loadMatchDetail = async () => {
      try {
        const res = await fetch(`${apiHost}/api/matches/${activeMatchId}`);
        if (res.ok) {
          const data = await res.json();
          setMatchDetail(data);
        }
      } catch (err) {
        console.error("Failed to load match detail:", err);
      }
    };

    loadMatchDetail();
    
    // Setup polling for live match center updates
    const timer = setInterval(loadMatchDetail, 6000);
    return () => clearInterval(timer);
  }, [activeMatchId, type, apiHost]);

  // Fallbacks
  const loadLocalFallbacks = () => {
    if (type === 'standings') {
      setStandings(getMockStandings());
    } else if (type === 'topscorers') {
      setTopscorers(getMockTopscorers());
    }
  };

  const formatStandingsData = (data) => {
    if (data.length > 0 && data[0].group) return data;
    try {
      const groupsMap = {};
      data.forEach(item => {
        const groupName = item.group?.name || "Group Stage";
        if (!groupsMap[groupName]) groupsMap[groupName] = [];
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
    } catch {
      return getMockStandings();
    }
  };

  const formatTopscorersData = (data) => {
    if (data.length > 0 && data[0].goals !== undefined) return data;
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
    } catch {
      return getMockTopscorers();
    }
  };

  // --- MOCK CONSTANTS ---
  const getMockStandings = () => [
    {
      group: "Group A",
      teams: [
        { rank: 1, name: "Czech Republic", logo: "🇨🇿", played: 3, won: 2, drawn: 1, lost: 0, gd: 4, points: 7 },
        { rank: 2, name: "Mexico", logo: "🇲🇽", played: 3, won: 2, drawn: 0, lost: 1, gd: 2, points: 6 },
        { rank: 3, name: "South Africa", logo: "🇿🇦", played: 3, won: 1, drawn: 1, lost: 1, gd: 0, points: 4 },
        { rank: 4, name: "Korea Republic", logo: "🇰🇷", played: 3, won: 0, drawn: 0, lost: 3, gd: -6, points: 0 }
      ]
    },
    {
      group: "Group B",
      teams: [
        { rank: 1, name: "Bosnia & Herz.", logo: "🇧🇦", played: 3, won: 3, drawn: 0, lost: 0, gd: 7, points: 9 },
        { rank: 2, name: "Argentina", logo: "🇦🇷", played: 3, won: 2, drawn: 0, lost: 1, gd: 3, points: 6 },
        { rank: 3, name: "Spain", logo: "🇪🇸", played: 3, won: 1, drawn: 0, lost: 2, gd: -1, points: 3 },
        { rank: 4, name: "Canada", logo: "🇨🇦", played: 3, won: 0, drawn: 0, lost: 3, gd: -9, points: 0 }
      ]
    }
  ];

  const getMockTopscorers = () => [
    { rank: 1, name: "Georges Mikautadze", logo: "🇬🇪", team: "Georgia", goals: 4, assists: 1, played: 4, yellowCards: 1, redCards: 0, minsPerGoal: 88, totalShots: 11, conversion: 36 },
    { rank: 2, name: "Ivan Schranz", logo: "🇸🇰", team: "Slovakia", goals: 3, assists: 0, played: 4, yellowCards: 0, redCards: 0, minsPerGoal: 112, totalShots: 6, conversion: 50 },
    { rank: 3, name: "Jamal Musiala", logo: "🇩🇪", team: "Germany", goals: 3, assists: 1, played: 5, yellowCards: 1, redCards: 0, minsPerGoal: 135, totalShots: 14, conversion: 21 },
    { rank: 4, name: "Dani Olmo", logo: "🇪🇸", team: "Spain", goals: 3, assists: 2, played: 6, yellowCards: 0, redCards: 0, minsPerGoal: 144, totalShots: 18, conversion: 17 },
    { rank: 5, name: "Cody Gakpo", logo: "🇳🇱", team: "Netherlands", goals: 3, assists: 1, played: 6, yellowCards: 2, redCards: 0, minsPerGoal: 175, totalShots: 13, conversion: 23 }
  ];

  const getBracketData = () => {
    // World Cup 2022 visual knockout structure matching screenshots
    return {
      r16Left: [
        { id: "L1", team1: { name: "Netherlands", logo: "🇳🇱", score: 3 }, team2: { name: "United States", logo: "🇺🇸", score: 1 } },
        { id: "L2", team1: { name: "Argentina", logo: "🇦🇷", score: 2 }, team2: { name: "Australia", logo: "🇦🇺", score: 1 } },
        { id: "L3", team1: { name: "Japan", logo: "🇯🇵", score: 1 }, team2: { name: "Croatia", logo: "🇭🇷", score: 1 }, detail: "Pen 1-3" },
        { id: "L4", team1: { name: "Brazil", logo: "🇧🇷", score: 4 }, team2: { name: "South Korea", logo: "🇰🇷", score: 1 } }
      ],
      qfLeft: [
        { id: "L5", team1: { name: "Netherlands", logo: "🇳🇱", score: 2 }, team2: { name: "Argentina", logo: "🇦🇷", score: 2 }, detail: "Pen 3-4" },
        { id: "L6", team1: { name: "Croatia", logo: "🇭🇷", score: 1 }, team2: { name: "Brazil", logo: "🇧🇷", score: 1 }, detail: "Pen 4-2" }
      ],
      sfLeft: [
        { id: "L7", team1: { name: "Argentina", logo: "🇦🇷", score: 3 }, team2: { name: "Croatia", logo: "🇭🇷", score: 0 } }
      ],
      final: {
        id: "F1",
        team1: { name: "Argentina", logo: "🇦🇷", score: 3 },
        team2: { name: "France", logo: "🇫🇷", score: 3 },
        detail: "Pen 4-2 (Champion: ARG!)"
      },
      sfRight: [
        { id: "R7", team1: { name: "France", logo: "🇫🇷", score: 2 }, team2: { name: "Morocco", logo: "🇲🇦", score: 0 } }
      ],
      qfRight: [
        { id: "R5", team1: { name: "England", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 1 }, team2: { name: "France", logo: "🇫🇷", score: 2 } },
        { id: "R6", team1: { name: "Morocco", logo: "🇲🇦", score: 1 }, team2: { name: "Portugal", logo: "🇵🇹", score: 0 } }
      ],
      r16Right: [
        { id: "R1", team1: { name: "England", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 3 }, team2: { name: "Senegal", logo: "🇸🇳", score: 0 } },
        { id: "R2", team1: { name: "France", logo: "🇫🇷", score: 3 }, team2: { name: "Poland", logo: "🇵🇱", score: 1 } },
        { id: "R3", team1: { name: "Morocco", logo: "🇲🇦", score: 0 }, team2: { name: "Spain", logo: "🇪🇸", score: 0 }, detail: "Pen 3-0" },
        { id: "R4", team1: { name: "Portugal", logo: "🇵🇹", score: 6 }, team2: { name: "Switzerland", logo: "🇨🇭", score: 1 } }
      ]
    };
  };

  // --- RENDER SECTIONS ---

  // Loading indicator
  if (loading && standings.length === 0 && topscorers.length === 0) {
    return (
      <div style={{ ...wrapperStyle, padding: '50px 20px', textAlign: 'center' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: `3px solid ${accent}`,
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 12px auto'
        }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: style.textMuted }}>Syncing live widget data...</span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="sportz-widget-root" style={wrapperStyle}>
      {/* Widget Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1.5px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
        paddingBottom: '14px',
        marginBottom: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '1.25rem',
            padding: '6px',
            background: style.cardBg,
            borderRadius: '8px'
          }}>
            {type === 'standings' ? '📊' : type === 'topscorers' ? '👟' : type === 'livescores' ? '⚽' : type === 'fixtures' ? '📅' : type === 'bracket' ? '🌳' : '🏟️'}
          </span>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {type === 'standings' ? 'World Cup Standings' : type === 'topscorers' ? 'Golden Boot Race' : type === 'livescores' ? 'Live Matches' : type === 'fixtures' ? 'Schedules' : type === 'bracket' ? 'Knockout Bracket' : 'Live Match Centre'}
            </h2>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: style.textMuted, textTransform: 'uppercase' }}>
              SportZ Live Engine
            </span>
          </div>
        </div>

        {/* Live Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            display: 'inline-block',
            boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.2)'
          }} />
          <span style={{ color: style.textMuted }}>LIVE UPDATES</span>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '8px 12px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.15)',
          borderRadius: '8px',
          fontSize: '0.75rem',
          color: '#ef4444',
          marginBottom: '14px',
          fontWeight: 500
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* 1. STANDINGS WIDGET */}
      {type === 'standings' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '16px' }}>
          {standings.map((gp, gIdx) => (
            <div key={gIdx} style={{
              background: style.cardBg,
              borderRadius: '12px',
              padding: '14px',
              border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}`
            }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '6px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⚽ {gp.group}
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: style.textMuted, fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <th style={{ padding: '6px 4px', width: '20px' }}>#</th>
                    <th style={{ padding: '6px 4px' }}>Team</th>
                    {!config.hidePlayed && <th style={{ padding: '6px 4px', textAlign: 'center', width: '25px' }}>P</th>}
                    {!config.hideGD && <th style={{ padding: '6px 4px', textAlign: 'center', width: '25px' }}>GD</th>}
                    <th style={{ padding: '6px 4px', textAlign: 'right', width: '25px', fontWeight: 800 }}>PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {gp.teams.map((t, tIdx) => {
                    const isQualifying = t.rank <= (config.qualifyingCount || 2);
                    const rowBg = isQualifying ? 'rgba(16, 185, 129, 0.05)' : 'transparent';

                    return (
                      <tr key={tIdx} style={{
                        backgroundColor: rowBg,
                        borderBottom: '1px solid rgba(0,0,0,0.02)'
                      }}>
                        <td style={{
                          padding: '8px 4px',
                          fontWeight: 800,
                          color: isQualifying ? '#10b981' : style.textMuted
                        }}>
                          {t.rank}
                        </td>
                        <td style={{ padding: '8px 4px', fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '1rem', lineHeight: '1', display: 'inline-flex', alignItems: 'center' }}>{renderLogo(t.logo, "⚽")}</span>
                            <span>{t.name}</span>
                          </div>
                        </td>
                        {!config.hidePlayed && <td style={{ padding: '8px 4px', textAlign: 'center', color: style.textMuted }}>{t.played}</td>}
                        {!config.hideGD && (
                          <td style={{
                            padding: '8px 4px',
                            textAlign: 'center',
                            fontWeight: 700,
                            color: t.gd > 0 ? '#10b981' : t.gd < 0 ? '#ef4444' : style.textMuted
                          }}>
                            {t.gd > 0 ? `+${t.gd}` : t.gd}
                          </td>
                        )}
                        <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 800 }}>{t.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* 2. TOP SCORERS WIDGET */}
      {type === 'topscorers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Sub-Metric selectors */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.04)', padding: '4px', borderRadius: '8px', marginBottom: '8px', maxWidth: '300px' }}>
            {['goals', 'assists', 'yellowCards', 'redCards'].map(metric => (
              <button
                key={metric}
                onClick={() => setScorerMetric(metric)}
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: scorerMetric === metric ? '#ffffff' : 'transparent',
                  color: scorerMetric === metric ? accent : style.textMuted,
                  boxShadow: scorerMetric === metric ? '0 1px 4px rgba(0,0,0,0.05)' : 'none',
                  textTransform: 'capitalize'
                }}
              >
                {metric === 'yellowCards' ? 'Yellows' : metric === 'redCards' ? 'Reds' : metric}
              </button>
            ))}
          </div>

          {topscorers.slice(0, config.limit || 5).map((p, idx) => {
            const val = p[scorerMetric] !== undefined ? p[scorerMetric] : (scorerMetric === 'goals' ? p.goals : p.assists);
            const maxVal = scorerMetric === 'goals' ? 4 : scorerMetric === 'assists' ? 2 : 2;
            const pct = Math.min((val / (maxVal || 1)) * 100, 100);

            return (
              <div key={idx} style={{
                background: style.cardBg,
                border: `1px solid ${idx === 0 ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0,0,0,0.02)'}`,
                padding: '10px 14px',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      color: idx === 0 ? '#f59e0b' : style.textMuted,
                      width: '20px'
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center' }}>{renderLogo(p.logo, "🏴")}</span>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>{p.name}</span>
                      <span style={{ display: 'block', fontSize: '0.6rem', color: style.textMuted, fontWeight: 500 }}>{p.team}</span>
                    </div>
                  </div>

                  {/* Value count badge */}
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: accent, fontSize: '0.9rem', fontWeight: 900 }}>{val}</span>
                      <span style={{ display: 'block', fontSize: '0.55rem', color: style.textMuted }}>{scorerMetric.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                {!config.hideProgressBar && (
                  <div style={{ width: '100%', height: '3.5px', background: 'rgba(0,0,0,0.03)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${accent} 0%, #a78bfa 100%)`,
                      borderRadius: '2px',
                      transition: 'width 0.8s ease'
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. LIVESCORES MATCH LIST */}
      {type === 'livescores' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {matches.filter(m => !config.sportFilter || m.sport === config.sportFilter).slice(0, config.limit || 5).map((m, idx) => {
            const isLive = m.status === 'live';

            return (
              <div key={idx} style={{
                background: style.cardBg,
                borderRadius: '12px',
                padding: '12px 16px',
                border: isLive ? `1.5px solid ${accent}` : '1px solid rgba(0,0,0,0.03)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
              onClick={() => {
                if (config.onMatchSelect) config.onMatchSelect(m.id);
                setActiveMatchId(m.id);
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', fontWeight: 700, color: style.textMuted }}>
                  <span>{m.league}</span>
                  {isLive ? (
                    <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', backgroundColor: '#ef4444', borderRadius: '50%' }} />
                      LIVE ({m.time})
                    </span>
                  ) : (
                    <span style={{ textTransform: 'capitalize' }}>{m.status}</span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '10px' }}>
                  {/* Home */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.8rem' }}>
                    <span style={{ fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center' }}>{renderLogo(m.homeTeam.logo, "⚽")}</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.homeTeam.name}</span>
                  </div>

                  {/* Score */}
                  <div style={{
                    padding: '4px 10px',
                    background: 'rgba(0,0,0,0.04)',
                    borderRadius: '6px',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    textAlign: 'center'
                  }}>
                    {m.status === 'upcoming' ? m.time : `${m.score.home} - ${m.score.away}`}
                  </div>

                  {/* Away */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.8rem', justifyContent: 'flex-end' }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.awayTeam.name}</span>
                    <span style={{ fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center' }}>{renderLogo(m.awayTeam.logo, "⚽")}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. TOURNAMENT FIXTURES / SCHEDULE */}
      {type === 'fixtures' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {matches.map((m, idx) => (
            <div key={idx} style={{
              background: style.cardBg,
              border: '1px solid rgba(0,0,0,0.02)',
              borderRadius: '10px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.6rem', color: style.textMuted, fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  {m.league} • {m.date}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {renderLogo(m.homeTeam.logo, "⚽")} {m.homeTeam.name}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: style.textMuted }}>vs</span>
                  <span style={{ fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {renderLogo(m.awayTeam.logo, "⚽")} {m.awayTeam.name}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  padding: '4px 8px',
                  background: 'rgba(0,0,0,0.04)',
                  borderRadius: '6px',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: m.status === 'live' ? '#ef4444' : style.color
                }}>
                  {m.status === 'live' ? '🔴 LIVE' : m.status === 'recent' || m.status === 'historical' ? 'FT' : m.time}
                </span>
                {config.showVenue && <span style={{ display: 'block', fontSize: '0.55rem', color: style.textMuted, marginTop: '4px' }}>{m.venue}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. KNOCKOUT BRACKET WIDGET */}
      {type === 'bracket' && (
        <div style={{
          overflowX: 'auto',
          paddingBottom: '10px',
          width: '100%',
          display: 'block'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '15px',
            minWidth: '850px',
            padding: '10px'
          }}>
            {/* Local helper to render a bracket node */}
            {(() => {
              const b = getBracketData();
              const nodeStyle = (match, isLeft) => ({
                background: style.cardBg,
                border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                borderRadius: '8px',
                padding: '6px 10px',
                width: '140px',
                fontSize: '0.7rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                position: 'relative'
              });

              const renderTeamRow = (team, oppositeTeam) => {
                const isWinner = team.score !== null && oppositeTeam.score !== null && team.score > oppositeTeam.score;
                return (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: isWinner ? 800 : 500, opacity: isWinner ? 1 : 0.75 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center' }}>{renderLogo(team.logo, "⚽")}</span>
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '85px' }}>{team.name}</span>
                    </div>
                    <span style={{ fontWeight: 800, color: isWinner ? accent : style.color }}>{team.score}</span>
                  </div>
                );
              };

              const renderMatchBox = (m, isLeft) => (
                <div key={m.id} style={nodeStyle(m, isLeft)}>
                  {renderTeamRow(m.team1, m.team2)}
                  {renderTeamRow(m.team2, m.team1)}
                  {m.detail && (
                    <div style={{ fontSize: '0.55rem', color: style.textMuted, textAlign: 'center', borderTop: '0.5px solid rgba(0,0,0,0.04)', paddingTop: '2px', marginTop: '2px', fontWeight: 600 }}>
                      {m.detail}
                    </div>
                  )}
                </div>
              );

              return (
                <>
                  {/* COLUMN 1: LEFT ROUND OF 16 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-around' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: style.textMuted, textAlign: 'center', textTransform: 'uppercase' }}>Round of 16</div>
                    {b.r16Left.map(m => renderMatchBox(m, true))}
                  </div>

                  {/* COLUMN 2: LEFT QUARTER FINALS */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: style.textMuted, textAlign: 'center', textTransform: 'uppercase' }}>Quarter-Finals</div>
                    {b.qfLeft.map(m => renderMatchBox(m, true))}
                  </div>

                  {/* COLUMN 3: LEFT SEMI FINALS */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: style.textMuted, textAlign: 'center', textTransform: 'uppercase', marginBottom: '40px' }}>Semi-Finals</div>
                    {b.sfLeft.map(m => renderMatchBox(m, true))}
                  </div>

                  {/* COLUMN 4: FINALS (CENTER) */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '2rem', animation: 'bounce 2s infinite' }}>🏆</span>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>GRAND FINAL</div>
                    <div style={{
                      ...nodeStyle(b.final, false),
                      width: '160px',
                      border: '2px solid rgba(245, 158, 11, 0.45)',
                      background: 'linear-gradient(135deg, rgba(254, 253, 244, 0.5), rgba(254, 240, 138, 0.35))'
                    }}>
                      {renderTeamRow(b.final.team1, b.final.team2)}
                      {renderTeamRow(b.final.team2, b.final.team1)}
                      <div style={{ fontSize: '0.55rem', color: '#b45309', textAlign: 'center', borderTop: '0.5px solid rgba(245, 158, 11, 0.3)', paddingTop: '3px', marginTop: '3px', fontWeight: 800 }}>
                        ⭐ {b.final.detail} ⭐
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 5: RIGHT SEMI FINALS */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: style.textMuted, textAlign: 'center', textTransform: 'uppercase', marginBottom: '40px' }}>Semi-Finals</div>
                    {b.sfRight.map(m => renderMatchBox(m, false))}
                  </div>

                  {/* COLUMN 6: RIGHT QUARTER FINALS */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: style.textMuted, textAlign: 'center', textTransform: 'uppercase' }}>Quarter-Finals</div>
                    {b.qfRight.map(m => renderMatchBox(m, false))}
                  </div>

                  {/* COLUMN 7: RIGHT ROUND OF 16 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-around' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: style.textMuted, textAlign: 'center', textTransform: 'uppercase' }}>Round of 16</div>
                    {b.r16Right.map(m => renderMatchBox(m, false))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* 6. FULL MATCH CENTRE WIDGET */}
      {type === 'matchcentre' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Match selector (dropdown inside the widget preview) */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: style.textMuted }}>SELECT MATCH:</label>
            <select
              value={activeMatchId || ''}
              onChange={(e) => setActiveMatchId(e.target.value)}
              style={{
                background: style.inputBg,
                color: style.color,
                border: `1px solid ${style.textMuted}40`,
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.7rem',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              {matches.map(m => (
                <option key={m.id} value={m.id}>
                  {m.homeTeam.name} vs {m.awayTeam.name} ({m.sport === 'cricket' ? 'Cricket' : 'Football'})
                </option>
              ))}
            </select>
          </div>

          {matchDetail ? (
            <div style={{
              background: style.cardBg,
              borderRadius: '12px',
              padding: '16px',
              border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              {/* Score header */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: style.textMuted, textTransform: 'uppercase' }}>
                  {matchDetail.league} • {matchDetail.venue}
                </span>

                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                    <span style={{ fontSize: '2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{renderLogo(matchDetail.homeTeam.logo, "⚽")}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{matchDetail.homeTeam.name}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '0 10px' }}>
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: 900,
                      background: 'rgba(0,0,0,0.04)',
                      padding: '4px 14px',
                      borderRadius: '8px',
                      color: matchDetail.status === 'live' ? '#ef4444' : style.color
                    }}>
                      {matchDetail.status === 'upcoming' ? 'VS' : (matchDetail.score.home + ' - ' + matchDetail.score.away)}
                    </div>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      color: matchDetail.status === 'live' ? '#ef4444' : style.textMuted,
                      background: matchDetail.status === 'live' ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {matchDetail.status === 'live' ? `🔴 LIVE (${matchDetail.time})` : matchDetail.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                    <span style={{ fontSize: '2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{renderLogo(matchDetail.awayTeam.logo, "⚽")}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{matchDetail.awayTeam.name}</span>
                  </div>
                </div>
              </div>

              {/* Sub-tabs toggler */}
              <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.04)', padding: '3px', borderRadius: '8px' }}>
                {[
                  { id: 'timeline', label: 'Timeline' },
                  { id: 'stats', label: 'Stats' },
                  { id: 'lineups', label: 'Lineups' },
                  { id: 'commentary', label: 'Commentary' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setDetailSubTab(tab.id)}
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: detailSubTab === tab.id ? '#ffffff' : 'transparent',
                      color: detailSubTab === tab.id ? accent : style.textMuted,
                      boxShadow: detailSubTab === tab.id ? '0 1px 4px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT: TIMELINE */}
              {detailSubTab === 'timeline' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {matchDetail.timeline && matchDetail.timeline.length > 0 ? (
                    matchDetail.timeline.map((event, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.7rem',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255,255,255,0.05)'
                      }}>
                        <span style={{ fontWeight: 800, color: accent, width: '25px' }}>{event.minute}'</span>
                        <span style={{ fontSize: '0.9rem' }}>{event.type === 'goal' ? '⚽' : event.type === 'yellow' ? '🟨' : event.type === 'red' ? '🟥' : '🔔'}</span>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 800 }}>{event.player}</span>
                          <span style={{ fontSize: '0.6rem', color: style.textMuted, marginLeft: '6px' }}>({event.detail})</span>
                        </div>
                        <span style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', color: style.textMuted }}>{event.team}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.7rem', color: style.textMuted }}>No events reported yet.</div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: STATS */}
              {detailSubTab === 'stats' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {matchDetail.stats ? (
                    Object.keys(matchDetail.stats).map((key, idx) => {
                      const stat = matchDetail.stats[key];
                      const total = stat.home + stat.away || 1;
                      const homePct = (stat.home / total) * 100;
                      const label = key.replace(/([A-Z])/g, ' $1').toUpperCase();

                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.65rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                            <span>{stat.home}</span>
                            <span style={{ color: style.textMuted, fontSize: '0.55rem' }}>{label}</span>
                            <span>{stat.away}</span>
                          </div>

                          <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.03)', borderRadius: '2px', display: 'flex', overflow: 'hidden' }}>
                            <div style={{ width: `${homePct}%`, height: '100%', backgroundColor: accent }} />
                            <div style={{ flex: 1, height: '100%', backgroundColor: '#a78bfa' }} />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.7rem', color: style.textMuted }}>Stats unavailable for upcoming fixtures.</div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: LINEUPS */}
              {detailSubTab === 'lineups' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.7rem' }}>
                  {matchDetail.lineups ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {/* Home XI */}
                      <div>
                        <h4 style={{ fontWeight: 800, fontSize: '0.75rem', marginBottom: '6px', color: accent }}>{matchDetail.homeTeam.name} ({matchDetail.lineups.home.formation})</h4>
                        {matchDetail.lineups.home.startingXI.map((p, idx) => (
                          <div key={idx} style={{ padding: '3px 0', borderBottom: '0.5px solid rgba(0,0,0,0.02)' }}>
                            <span style={{ color: style.textMuted, width: '16px', display: 'inline-block' }}>{p.number}</span>
                            <span style={{ fontWeight: 600 }}>{p.name}</span>
                            <span style={{ fontSize: '0.55rem', color: style.textMuted, marginLeft: '4px' }}>[{p.position}]</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Away XI */}
                      <div>
                        <h4 style={{ fontWeight: 800, fontSize: '0.75rem', marginBottom: '6px', color: '#a78bfa' }}>{matchDetail.awayTeam.name} ({matchDetail.lineups.away.formation})</h4>
                        {matchDetail.lineups.away.startingXI.map((p, idx) => (
                          <div key={idx} style={{ padding: '3px 0', borderBottom: '0.5px solid rgba(0,0,0,0.02)', textAlign: 'right' }}>
                            <span style={{ fontSize: '0.55rem', color: style.textMuted, marginRight: '4px' }}>[{p.position}]</span>
                            <span style={{ fontWeight: 600 }}>{p.name}</span>
                            <span style={{ color: style.textMuted, width: '16px', display: 'inline-block', textAlign: 'right', marginLeft: '6px' }}>{p.number}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: style.textMuted }}>Lineup lists will appear close to match-off time.</div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: COMMENTARY */}
              {detailSubTab === 'commentary' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {matchDetail.commentary && matchDetail.commentary.length > 0 ? (
                    matchDetail.commentary.map((c, idx) => (
                      <div key={idx} style={{
                        fontSize: '0.7rem',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        lineHeight: '1.4'
                      }}>
                        {c.minute && <span style={{ fontWeight: 800, color: accent, marginRight: '6px' }}>[{c.minute}]</span>}
                        {c.over && <span style={{ fontWeight: 800, color: accent, marginRight: '6px' }}>[Ov {c.over}]</span>}
                        <span>{c.text}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: style.textMuted }}>Live commentaries will start at kick-off.</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.75rem', color: style.textMuted }}>Please select a valid match center fixture.</div>
          )}
        </div>
      )}

      {/* Embed Mode Monetization Elements */}
      {window.location.search.includes('embed=true') && (
        <>
          {/* Dynamically configured AdSense unit embedded inside the iframe */}
          <AdSenseAd 
            slot="8837482910" // Dedicated Embed Iframe Ad Unit Slot
            height="90px"
            licenseKey={licenseKey}
          />

          {/* Aesthetic Backlink Attribution Signature */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '16px',
            paddingTop: '10px',
            borderTop: `1.5px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
            fontSize: '0.65rem',
            fontWeight: 700,
            color: style.textMuted
          }}>
            <a 
              href={window.location.origin} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: accent,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              <span>⚡ Widget by</span>
              <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2px' }}>SportZ Live Center</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
}

