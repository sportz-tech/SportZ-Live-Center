import React from 'react';

export default function MatchCharts({ match }) {
  const isCricket = match.sport === 'cricket';

  // Football Statistics Component
  if (!isCricket) {
    if (!match.stats) {
      return (
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Statistics are not available for this match.
        </div>
      );
    }

    const renderStatRow = (label, homeValue, awayValue, format = (v) => v) => {
      const homeVal = parseFloat(homeValue) || 0;
      const awayVal = parseFloat(awayValue) || 0;
      const total = homeVal + awayVal || 1;
      const homePercent = (homeVal / total) * 100;
      const awayPercent = (awayVal / total) * 100;

      return (
        <div style={{ marginBottom: '18px' }} key={label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600 }}>
            <span>{format(homeValue)}</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
            <span>{format(awayValue)}</span>
          </div>
          <div style={{ height: '8px', display: 'flex', borderRadius: '4px', overflow: 'hidden', background: '#e2e8f0' }}>
            <div 
              style={{ 
                width: `${homePercent}%`, 
                backgroundColor: 'var(--color-football)', 
                transition: 'width 0.5s ease-out',
                borderRadius: '4px 0 0 4px'
              }} 
            />
            <div 
              style={{ 
                width: `${awayPercent}%`, 
                backgroundColor: 'var(--color-live)', 
                transition: 'width 0.5s ease-out',
                borderRadius: '0 4px 4px 0'
              }} 
            />
          </div>
        </div>
      );
    };

    return (
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Match Statistics</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--color-football)', marginRight: '8px' }}>● {match.homeTeam.shortName}</span>
            <span style={{ color: 'var(--color-live)' }}>● {match.awayTeam.shortName}</span>
          </span>
        </h3>

        {renderStatRow("Possession", match.stats.possession.home, match.stats.possession.away, (v) => `${v}%`)}
        {renderStatRow("Total Shots", match.stats.shots.home, match.stats.shots.away)}
        {renderStatRow("Shots on Target", match.stats.shotsOnTarget.home, match.stats.shotsOnTarget.away)}
        {renderStatRow("Corners", match.stats.corners.home, match.stats.corners.away)}
        {renderStatRow("Fouls", match.stats.fouls.home, match.stats.fouls.away)}
        {renderStatRow("Yellow Cards", match.stats.yellowCards.home, match.stats.yellowCards.away)}
        {renderStatRow("Red Cards", match.stats.redCards.home, match.stats.redCards.away)}
      </div>
    );
  }

  // Cricket Run Rate Progression SVG Chart
  if (!match.chartData || !match.chartData.overs.length) {
    return (
      <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Run rate analytics are not available for this match.
      </div>
    );
  }

  const { overs, homeRunRate, awayRunRate } = match.chartData;

  // Chart dimensions & scaling
  const width = 500;
  const height = 260;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxOver = Math.max(...overs);
  const minOver = Math.min(...overs);
  const maxRR = Math.max(...homeRunRate, ...awayRunRate, 12);
  const minRR = Math.min(0, ...homeRunRate, ...awayRunRate);

  // Coordinate scaling functions
  const getX = (over) => {
    return paddingLeft + ((over - minOver) / (maxOver - minOver)) * chartWidth;
  };
  
  const getY = (rr) => {
    return paddingTop + chartHeight - ((rr - minRR) / (maxRR - minRR)) * chartHeight;
  };

  // Generate SVG path strings
  let homePath = "";
  let awayPath = "";

  overs.forEach((over, index) => {
    const x = getX(over);
    const yHome = getY(homeRunRate[index]);
    const yAway = getY(awayRunRate[index]);

    if (index === 0) {
      homePath = `M ${x} ${yHome}`;
      awayPath = `M ${x} ${yAway}`;
    } else {
      homePath += ` L ${x} ${yHome}`;
      awayPath += ` L ${x} ${yAway}`;
    }
  });

  // Gridlines and axis helper values
  const yTicks = [3, 6, 9, 12];
  const xTicks = overs.filter((_, idx) => idx % Math.max(1, Math.floor(overs.length / 5)) === 0);

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <h3 style={{ marginBottom: '14px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Run Rate Progression</span>
        <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <span style={{ display: 'inline-block', width: '12px', height: '3px', backgroundColor: 'var(--color-football)' }} />
            {match.homeTeam.shortName} ({homeRunRate[homeRunRate.length - 1]?.toFixed(2)})
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <span style={{ display: 'inline-block', width: '12px', height: '3px', backgroundColor: 'var(--color-cricket)' }} />
            {match.awayTeam.shortName} ({awayRunRate[awayRunRate.length - 1]?.toFixed(2)})
          </span>
        </div>
      </h3>

      <div style={{ width: '100%', position: 'relative' }}>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          style={{ width: '100%', height: 'auto', overflow: 'visible' }}
        >
          {/* Y-axis gridlines & labels */}
          {yTicks.map(rr => (
            <g key={rr}>
              <line 
                x1={paddingLeft} 
                y1={getY(rr)} 
                x2={width - paddingRight} 
                y2={getY(rr)} 
                stroke="#e2e8f0" 
                strokeDasharray="4 4" 
              />
              <text 
                x={paddingLeft - 8} 
                y={getY(rr) + 4} 
                textAnchor="end" 
                fontSize="10" 
                fill="var(--text-muted)"
                fontWeight="500"
              >
                {rr}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {xTicks.map(over => (
            <text 
              key={over}
              x={getX(over)} 
              y={height - paddingBottom + 16} 
              textAnchor="middle" 
              fontSize="10" 
              fill="var(--text-muted)"
              fontWeight="500"
            >
              Over {over}
            </text>
          ))}

          {/* X and Y axes */}
          <line 
            x1={paddingLeft} 
            y1={height - paddingBottom} 
            x2={width - paddingRight} 
            y2={height - paddingBottom} 
            stroke="rgba(0,0,0,0.1)" 
            strokeWidth="1.5" 
          />
          <line 
            x1={paddingLeft} 
            y1={paddingTop} 
            x2={paddingLeft} 
            y2={height - paddingBottom} 
            stroke="rgba(0,0,0,0.1)" 
            strokeWidth="1.5" 
          />

          {/* Home team path */}
          <path 
            d={homePath} 
            fill="none" 
            stroke="var(--color-football)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Away team path */}
          <path 
            d={awayPath} 
            fill="none" 
            stroke="var(--color-cricket)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Draw dots at coordinate points */}
          {overs.map((over, index) => (
            <g key={over}>
              <circle 
                cx={getX(over)} 
                cy={getY(homeRunRate[index])} 
                r="3.5" 
                fill="white" 
                stroke="var(--color-football)" 
                strokeWidth="2.5" 
              />
              <circle 
                cx={getX(over)} 
                cy={getY(awayRunRate[index])} 
                r="3.5" 
                fill="white" 
                stroke="var(--color-cricket)" 
                strokeWidth="2.5" 
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
