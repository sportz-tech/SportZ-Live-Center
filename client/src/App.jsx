import React, { useState, useEffect, useRef } from 'react';
import MatchCard from './components/MatchCard';
import MatchDetail from './components/MatchDetail';
import Simulator from './components/Simulator';
import AdSenseAd from './components/AdSenseAd';
import WorldCupDashboard from './components/WorldCupDashboard';
import WidgetWizard from './components/WidgetWizard';
import AdminDashboard from './components/AdminDashboard';
import DeveloperPortal from './components/DeveloperPortal';
import SportZWidget from './components/SportZWidget';
import { initGA, trackPageView, trackEvent } from './utils/analytics';
import './App.css';

export default function App() {
  const [sport, setSport] = useState('football'); // football or cricket
  const [filter, setFilter] = useState('all'); // all, live, upcoming, recent, historical
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [wsStatus, setWsStatus] = useState('connecting');
  const [simulatorActive, setSimulatorActive] = useState(true);
  const [mainView, setMainView] = useState('match'); // match or worldcup

  const isEmbedMode = window.location.search.includes('embed=true');
  const wsRef = useRef(null);
  const API_HOST = import.meta.env.VITE_API_HOST || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin);
  const WS_HOST = import.meta.env.VITE_WS_HOST || (window.location.hostname === 'localhost' ? 'ws://localhost:5000' : window.location.origin.replace(/^http/, 'ws'));

  if (isEmbedMode) {
    const params = new URLSearchParams(window.location.search);
    const embedType = params.get('type') || 'standings';
    const embedTheme = params.get('theme') || 'glass';
    const embedAccent = params.get('accent') || '#3b82f6';
    const embedFont = params.get('font') || 'Outfit';
    const embedBorders = params.get('borders') || 'rounded';
    const embedLicenseKey = params.get('licenseKey') || null;
    
    const embedConfig = {};
    params.forEach((val, key) => {
      if (!['embed', 'type', 'theme', 'accent', 'font', 'borders', 'licenseKey'].includes(key)) {
        if (val === 'true') embedConfig[key] = true;
        else if (val === 'false') embedConfig[key] = false;
        else if (!isNaN(val)) embedConfig[key] = Number(val);
        else embedConfig[key] = val;
      }
    });

    return (
      <div style={{ padding: '0', margin: '0', background: 'transparent', minHeight: '100vh', display: 'flex', alignItems: 'stretch', boxSizing: 'border-box' }}>
        <SportZWidget
          type={embedType}
          theme={embedTheme}
          accent={embedAccent}
          font={embedFont}
          borders={embedBorders}
          config={embedConfig}
          apiHost={API_HOST}
          licenseKey={embedLicenseKey}
        />
      </div>
    );
  }

  // Initialize Google Analytics GA4
  useEffect(() => {
    initGA(import.meta.env.VITE_GA_MEASUREMENT_ID);
  }, []);

  // Fetch initial matches via REST API as fallback
  const fetchMatches = async () => {
    try {
      const res = await fetch(`${API_HOST}/api/matches`);
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }

      const configRes = await fetch(`${API_HOST}/api/config`);
      if (configRes.ok) {
        const config = await configRes.json();
        setSimulatorActive(config.simulatorActive);
      }
    } catch (err) {
      console.error("Failed to fetch initial matches or config:", err);
    }
  };

  // Connect to WebSocket Server for live updates
  useEffect(() => {
    fetchMatches();
    
    let reconnectTimeout;
    
    const connectWS = () => {
      setWsStatus('connecting');
      const ws = new WebSocket(WS_HOST);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsStatus('connected');
        console.log("WebSocket connected to SportZ Server");
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'INIT') {
            setMatches(message.data.matches);
          } else if (message.type === 'MATCH_UPDATE') {
            const updatedMatch = message.data;
            setMatches((prevMatches) => {
              // Replace the updated match in state
              return prevMatches.map(m => m.id === updatedMatch.id ? updatedMatch : m);
            });
          }
        } catch (err) {
          console.error("Error processing WS message:", err);
        }
      };

      ws.onclose = () => {
        setWsStatus('disconnected');
        console.log("WebSocket connection closed. Attempting reconnect...");
        reconnectTimeout = setTimeout(connectWS, 5000); // Reconnect in 5s
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    };

    connectWS();

    return () => {
      if (wsRef.current) wsRef.current.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  // Filtered matches list
  const filteredMatches = matches.filter((m) => {
    const matchesSport = m.sport === sport;
    if (!matchesSport) return false;
    
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);

  // Set default selection when active list changes
  useEffect(() => {
    if (filteredMatches.length > 0) {
      // Keep selected match if it is still in the filtered list
      const stillAvailable = filteredMatches.some(m => m.id === selectedMatchId);
      if (!stillAvailable) {
        setSelectedMatchId(filteredMatches[0].id);
      }
    } else {
      setSelectedMatchId(null);
    }
  }, [sport, filter, matches]);

  const activeSportColor = sport === 'cricket' ? 'var(--color-cricket)' : 'var(--color-football)';

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '100vh' }}>
      
      {/* Premium Header Nav */}
      <header 
        className="glass-panel" 
        style={{ 
          padding: '12px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'white',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Left branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="SportZ Logo" style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1.5px solid var(--color-football)', objectFit: 'cover' }} />
          <div>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', display: 'inline-block' }}>SportZ</h1>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', background: '#e2e8f0', borderRadius: '4px', marginLeft: '8px', verticalAlign: 'middle', color: 'var(--text-secondary)' }}>
              LIVE CENTER
            </span>
          </div>
        </div>

        {/* Center navigation menu pills */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.04)', padding: '4px', borderRadius: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setSport('football');
              setFilter('all');
              setMainView('match');
              trackEvent('select_sport', 'navigation', 'football');
              trackPageView('/sport/football', 'Football Live Center');
            }}
            className="glass-btn"
            style={{
              padding: '6px 14px',
              backgroundColor: sport === 'football' && mainView === 'match' ? 'white' : 'transparent',
              borderRadius: '8px',
              border: 'none',
              color: sport === 'football' && mainView === 'match' ? 'var(--color-football)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              boxShadow: sport === 'football' && mainView === 'match' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            ⚽ Football
          </button>
          
          <button
            onClick={() => {
              setSport('cricket');
              setFilter('all');
              setMainView('match');
              trackEvent('select_sport', 'navigation', 'cricket');
              trackPageView('/sport/cricket', 'Cricket Live Center');
            }}
            className="glass-btn"
            style={{
              padding: '6px 14px',
              backgroundColor: sport === 'cricket' && mainView === 'match' ? 'white' : 'transparent',
              borderRadius: '8px',
              border: 'none',
              color: sport === 'cricket' && mainView === 'match' ? 'var(--color-cricket)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              boxShadow: sport === 'cricket' && mainView === 'match' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            🏏 Cricket
          </button>
          
          <button
            onClick={() => {
              setMainView('worldcup');
              trackEvent('select_sport', 'navigation', 'worldcup');
              trackPageView('/tournament/worldcup', 'World Cup Center');
            }}
            className="glass-btn"
            style={{
              padding: '6px 14px',
              backgroundColor: mainView === 'worldcup' ? 'white' : 'transparent',
              borderRadius: '8px',
              border: 'none',
              color: mainView === 'worldcup' ? 'var(--color-football)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              boxShadow: mainView === 'worldcup' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            🏆 WC 2026
          </button>

          <button
            onClick={() => {
              setMainView('wizard');
              trackEvent('select_sport', 'navigation', 'wizard');
              trackPageView('/widgets', 'Widget Wizard');
            }}
            className="glass-btn"
            style={{
              padding: '6px 14px',
              backgroundColor: mainView === 'wizard' ? 'white' : 'transparent',
              borderRadius: '8px',
              border: 'none',
              color: mainView === 'wizard' ? 'var(--color-football)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              boxShadow: mainView === 'wizard' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            🧩 Widgets
          </button>

          <button
            onClick={() => {
              setMainView('devportal');
              trackEvent('select_sport', 'navigation', 'devportal');
              trackPageView('/devportal', 'Developer Portal');
            }}
            className="glass-btn"
            style={{
              padding: '6px 14px',
              backgroundColor: mainView === 'devportal' ? 'white' : 'transparent',
              borderRadius: '8px',
              border: 'none',
              color: mainView === 'devportal' ? 'var(--color-football)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              boxShadow: mainView === 'devportal' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            👤 Dev Portal
          </button>

          <button
            onClick={() => {
              setMainView('admin');
              trackEvent('select_sport', 'navigation', 'admin');
              trackPageView('/admin', 'Admin Dashboard');
            }}
            className="glass-btn"
            style={{
              padding: '6px 14px',
              backgroundColor: mainView === 'admin' ? 'white' : 'transparent',
              borderRadius: '8px',
              border: 'none',
              color: mainView === 'admin' ? 'var(--color-football)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              boxShadow: mainView === 'admin' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            🔒 Admin
          </button>
        </div>

        {/* Right status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
            <span 
              style={{ 
                display: 'inline-block', 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: wsStatus === 'connected' ? 'var(--color-cricket)' : wsStatus === 'connecting' ? 'var(--color-gold)' : 'var(--color-live)' 
              }} 
            />
            <span style={{ color: 'var(--text-muted)' }}>
              {wsStatus === 'connected' ? 'Live Feed' : wsStatus === 'connecting' ? 'Reconnecting...' : 'Feed Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: (mainView === 'wizard' || mainView === 'admin' || mainView === 'devportal') ? 'minmax(0, 1fr)' : 'minmax(300px, 1fr) minmax(0, 2.5fr)', 
          gap: '20px', 
          alignItems: 'start',
          flex: 1
        }}
        className="main-layout"
      >
        {/* SIDEBAR: Sport/Filter Toggles & Match List */}
        {!(mainView === 'wizard' || mainView === 'admin' || mainView === 'devportal') && (
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Status Filters */}
            <div 
              className="glass-panel" 
              style={{ 
                padding: '12px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '6px',
                background: 'rgba(255,255,255,0.3)'
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', display: 'block', paddingLeft: '4px' }}>
                Filter Fixtures
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[
                  { id: 'all', label: 'All Matches' },
                  { id: 'live', label: '🔴 Live' },
                  { id: 'upcoming', label: '📅 Upcoming' },
                  { id: 'recent', label: '🏁 Recent' },
                  { id: 'historical', label: '📜 History' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className="glass-btn"
                    style={{
                      padding: '6px 10px',
                      fontSize: '0.75rem',
                      borderRadius: '8px',
                      backgroundColor: filter === f.id ? 'white' : 'transparent',
                      color: filter === f.id ? activeSportColor : 'var(--text-secondary)',
                      fontWeight: 600,
                      border: filter === f.id ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
                      boxShadow: filter === f.id ? '0 2px 5px rgba(0,0,0,0.02)' : 'none'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Matches List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '65vh', overflowY: 'auto', paddingRight: '4px' }}>
              {filteredMatches.length > 0 ? (
                filteredMatches.map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    isSelected={selectedMatchId === m.id}
                    onClick={() => {
                      setSelectedMatchId(m.id);
                      trackEvent('view_match', 'match_center', `${m.homeTeam.name} vs ${m.awayTeam.name}`);
                    }}
                  />
                ))
              ) : (
                <div 
                  className="glass-panel" 
                  style={{ 
                    padding: '30px 20px', 
                    textAlign: 'center', 
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                  }}
                >
                  No {filter} matches found for {sport === 'cricket' ? 'Cricket' : 'Football'}.
                </div>
              )}
            </div>

            {/* Sidebar Google AdSense Unit */}
            <AdSenseAd 
              slot="5739201948" // Dedicated Sidebar Ad Unit Slot
              height="150px"
            />
          </aside>
        )}

        {/* MAIN MATCH CONSOLE */}
        <main style={{ gridColumn: (mainView === 'wizard' || mainView === 'admin' || mainView === 'devportal') ? '1 / -1' : 'auto', minWidth: 0 }}>
          {mainView === 'worldcup' ? (
            <WorldCupDashboard apiHost={API_HOST} />
          ) : mainView === 'wizard' ? (
            <WidgetWizard apiHost={API_HOST} setMainView={setMainView} />
          ) : mainView === 'admin' ? (
            <AdminDashboard apiHost={API_HOST} />
          ) : mainView === 'devportal' ? (
            <DeveloperPortal apiHost={API_HOST} />
          ) : (
            <MatchDetail match={selectedMatch} apiHost={API_HOST} />
          )}
        </main>
      </div>
    </div>
  );
}
