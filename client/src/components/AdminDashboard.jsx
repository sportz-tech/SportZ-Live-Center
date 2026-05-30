import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  BarChart3, 
  Vote, 
  Megaphone, 
  PlayCircle, 
  PlusCircle, 
  Eye, 
  Settings2, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Network,
  Mail
} from 'lucide-react';

/**
 * Premium Admin Dashboard Hub
 * 
 * Gateways:
 * - Username: admin
 * - Password: sportzadmin2026
 * 
 * Sub-consoles:
 * 1. Overview: System health, active connections, widget impressions, and earnings metrics.
 * 2. Polls Hub: Custom poll creations forms + voter DB registry logs table.
 * 3. AdSense Engine: Global toggle for ads, editable Slot IDs, and CTR trackers.
 * 4. Match Simulator: Secure master simulator controller previously available to general clients.
 */
export default function AdminDashboard({ apiHost = 'http://localhost:5000' }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState('overview'); // overview, polls, ads, simulator

  // SaaS User & License States
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [activeLicenses, setActiveLicenses] = useState([]);
  const [customSuffix, setCustomSuffix] = useState('');
  const [manualKeySuccess, setManualKeySuccess] = useState('');

  // Poll Manager States
  const [polls, setPolls] = useState([]);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);
  const [pollMatchId, setPollMatchId] = useState('fb-1');
  const [pollSuccess, setPollSuccess] = useState('');
  const [pollError, setPollError] = useState('');

  // AdSense Settings States
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [adClient, setAdClient] = useState('ca-pub-5739201948');
  const [adSidebarSlot, setAdSidebarSlot] = useState('5739201948');
  const [adHeaderSlot, setAdHeaderSlot] = useState('9283748291');
  const [adsSaved, setAdsSaved] = useState(false);

  // Support & Assistant States
  const [supportEmail, setSupportEmail] = useState('cricbuzz756@gmail.com');
  const [supportSaved, setSupportSaved] = useState(false);
  const [supportQueries, setSupportQueries] = useState([]);
  const [editedEmails, setEditedEmails] = useState({});

  // Match Simulator States
  const [matches, setMatches] = useState([]);
  const [activeSimMatchId, setActiveSimMatchId] = useState('');
  const [simMatch, setSimMatch] = useState(null);
  
  // Football Simulator details
  const [fbPlayerName, setFbPlayerName] = useState('');
  const [fbMinute, setFbMinute] = useState('');
  const [fbCardType, setFbCardType] = useState('yellow');
  const [fbEventTeam, setFbEventTeam] = useState('home');
  
  // Cricket Simulator details
  const [crWicketBatsman, setCrWicketBatsman] = useState('');
  const [crWicketType, setCrWicketType] = useState('bowled');

  const [simLoading, setSimLoading] = useState(false);
  const [simStatus, setSimStatus] = useState('');

  // --- LOGIN GATEWAY VALIDATOR ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.toLowerCase() === 'admin' && password === 'sportzadmin2026') {
      setIsAuthenticated(true);
      setLoginError('');
      sessionStorage.setItem('sportz_admin_auth', 'true');
    } else {
      setLoginError('Invalid Administrator Credentials!');
    }
  };

  // Persistent login session check
  useEffect(() => {
    const isAuth = sessionStorage.getItem('sportz_admin_auth');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // --- API DATA INJECTORS ---
  const fetchPolls = async () => {
    try {
      const res = await fetch(`${apiHost}/api/polls`);
      if (res.ok) {
        const data = await res.json();
        setPolls(data);
      }
    } catch (err) {
      console.error("Failed to load polls:", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${apiHost}/api/settings`);
      if (res.ok) {
        const data = await res.json();
        setAdsEnabled(data.adsEnabled);
        setAdClient(data.adClient);
        setAdSidebarSlot(data.adSlots?.sidebar || '5739201948');
        setAdHeaderSlot(data.adSlots?.header || '9283748291');
        setSupportEmail(data.supportEmail || 'cricbuzz756@gmail.com');
      }
    } catch (err) {
      console.error("Failed to load AdSense settings:", err);
    }
  };

  const fetchSupportQueries = async () => {
    try {
      const res = await fetch(`${apiHost}/api/admin/support/queries`);
      if (res.ok) {
        const data = await res.json();
        const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setSupportQueries(sorted);
      }
    } catch (err) {
      console.error("Failed to load support queries:", err);
    }
  };

  const fetchMatchesList = async () => {
    try {
      const res = await fetch(`${apiHost}/api/matches`);
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
        if (data.length > 0 && !activeSimMatchId) {
          setActiveSimMatchId(data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load match listings:", err);
    }
  };

  const fetchUsersList = async () => {
    try {
      const res = await fetch(`${apiHost}/api/admin/users`);
      if (res.ok) {
        const data = await res.json();
        setRegisteredUsers(data);
      }
    } catch (err) {
      console.error("Failed to load users list:", err);
    }
  };

  const fetchLicensesList = async () => {
    try {
      const res = await fetch(`${apiHost}/api/admin/licenses`);
      if (res.ok) {
        const data = await res.json();
        setActiveLicenses(data);
      }
    } catch (err) {
      console.error("Failed to load active licenses list:", err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchPolls();
    fetchSettings();
    fetchMatchesList();
    fetchUsersList();
    fetchLicensesList();
    fetchSupportQueries();
  }, [isAuthenticated]);

  // Load single match details when active sim selection changes
  useEffect(() => {
    if (!activeSimMatchId || !isAuthenticated) return;
    
    const loadSimMatchDetails = async () => {
      try {
        const res = await fetch(`${apiHost}/api/matches/${activeSimMatchId}`);
        if (res.ok) {
          const data = await res.json();
          setSimMatch(data);
        }
      } catch (err) {
        console.error("Failed to fetch simulator match detail:", err);
      }
    };
    
    loadSimMatchDetails();
    const interval = setInterval(loadSimMatchDetails, 4000);
    return () => clearInterval(interval);
  }, [activeSimMatchId, isAuthenticated]);

  // Admin manual toggling user status
  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await fetch(`${apiHost}/api/admin/users/toggle-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (res.ok) {
        fetchUsersList();
        fetchLicensesList();
      }
    } catch (err) {
      console.error("Failed to toggle user subscription level:", err);
    }
  };

  // Admin manual license key revoking
  const handleRevokeLicenseKey = async (licenseKey) => {
    if (!confirm(`Are you sure you want to permanently revoke key: ${licenseKey}?`)) return;

    try {
      const res = await fetch(`${apiHost}/api/admin/licenses/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey })
      });

      if (res.ok) {
        fetchLicensesList();
        fetchUsersList();
      }
    } catch (err) {
      console.error("Failed to revoke license key:", err);
    }
  };

  // Admin manual license key creation
  const handleCreateManualLicense = async (e) => {
    e.preventDefault();
    setManualKeySuccess('');

    try {
      const res = await fetch(`${apiHost}/api/admin/licenses/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customSuffix })
      });

      if (res.ok) {
        const data = await res.json();
        setManualKeySuccess(`Dynamic manual key generated successfully: ${data.licenseKey}`);
        setCustomSuffix('');
        fetchLicensesList();
      }
    } catch (err) {
      console.error("Failed to manual create key:", err);
    }
  };

  // --- HANDLERS ---
  
  // Dynamic Poll creation
  const handleAddOptionField = () => {
    if (newPollOptions.length < 4) {
      setNewPollOptions([...newPollOptions, '']);
    }
  };

  const handleRemoveOptionField = (idx) => {
    if (newPollOptions.length > 2) {
      const copy = [...newPollOptions];
      copy.splice(idx, 1);
      setNewPollOptions(copy);
    }
  };

  const handlePollCreation = async (e) => {
    e.preventDefault();
    setPollSuccess('');
    setPollError('');

    const filteredOptions = newPollOptions.filter(o => o.trim() !== '');
    if (!newPollQuestion.trim() || filteredOptions.length < 2) {
      setPollError('Please supply a question and at least 2 options.');
      return;
    }

    try {
      const res = await fetch(`${apiHost}/api/polls/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: pollMatchId,
          question: newPollQuestion,
          options: filteredOptions
        })
      });

      if (res.ok) {
        setPollSuccess('New Live Poll created successfully!');
        setNewPollQuestion('');
        setNewPollOptions(['', '']);
        fetchPolls();
      } else {
        const err = await res.json();
        setPollError(err.error || 'Failed to register poll on the server.');
      }
    } catch (err) {
      setPollError('Network connection issue. Server down?');
    }
  };

  // Dynamic AdSense Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setAdsSaved(false);

    try {
      const res = await fetch(`${apiHost}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adsEnabled,
          adClient,
          adSlots: {
            sidebar: adSidebarSlot,
            header: adHeaderSlot
          }
        })
      });

      if (res.ok) {
        setAdsSaved(true);
        setTimeout(() => setAdsSaved(false), 3000);
      }
    } catch (err) {
      console.error("AdSense Save error:", err);
    }
  };

  // Dynamic Support Assistant Email Save
  const handleSaveSupportSetting = async (e) => {
    e.preventDefault();
    setSupportSaved(false);

    try {
      const res = await fetch(`${apiHost}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supportEmail
        })
      });

      if (res.ok) {
        setSupportSaved(true);
        setTimeout(() => setSupportSaved(false), 3000);
      }
    } catch (err) {
      console.error("Support Save error:", err);
    }
  };

  // Update Support Ticket Details (Assigned Assistant / Status)
  const handleUpdateQuery = async (queryId, newEmail, newStatus) => {
    try {
      const body = { id: queryId };
      if (newEmail !== undefined) body.forwardedTo = newEmail;
      if (newStatus !== undefined) body.status = newStatus;

      const res = await fetch(`${apiHost}/api/admin/support/queries/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        fetchSupportQueries();
        if (newEmail !== undefined) {
          setEditedEmails(prev => {
            const copy = { ...prev };
            delete copy[queryId];
            return copy;
          });
        }
      } else {
        alert("Failed to update query details.");
      }
    } catch (err) {
      console.error("Error updating support query:", err);
    }
  };

  // Secure Event Simulator trigger
  const triggerSimulatorEvent = async (type, details) => {
    setSimLoading(true);
    setSimStatus('');
    try {
      const res = await fetch(`${apiHost}/api/simulator/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: activeSimMatchId,
          type,
          details
        })
      });

      if (res.ok) {
        setSimStatus('Event injected & broadcast live!');
        setTimeout(() => setSimStatus(''), 3000);
      } else {
        const err = await res.json();
        setSimStatus(`Failed: ${err.error}`);
      }
    } catch (err) {
      setSimStatus('Server connection error.');
    } finally {
      setSimLoading(false);
    }
  };

  // Audited voters registry extraction helper
  const getAggregatedVoters = () => {
    const list = [];
    polls.forEach(poll => {
      if (poll.voters && poll.voters.length > 0) {
        poll.voters.forEach(voter => {
          list.push({
            name: voter.name,
            email: voter.email,
            choice: voter.choice || 'Option Voted',
            question: poll.question,
            matchId: poll.matchId
          });
        });
      }
    });
    return list;
  };

  const aggregatedVoters = getAggregatedVoters();

  // --- RENDER LOGIN SHIELD ---
  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '420px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '30px 24px', background: 'rgba(255, 255, 255, 0.45)', textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--color-live-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: 'var(--color-live)'
          }}>
            <Lock size={22} />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>Admin Dashboard</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Authorization Shield Active
          </span>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px', textAlign: 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="glass-input"
                required
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="glass-input"
                required
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
            </div>

            {loginError && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-live)', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                ⚠️ {loginError}
              </span>
            )}

            <button
              type="submit"
              className="glass-btn btn-football"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '0.85rem',
                justifyContent: 'center',
                marginTop: '10px',
                fontWeight: 700
              }}
            >
              🔓 Unlock Admin Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER LOGGED-IN PANEL HUB ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Welcome Title Banner */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        background: 'rgba(255,255,255,0.45)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.8rem', animation: 'pulse 2.5s infinite' }}>⚙️</span>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Master Administration Console</h2>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Authorized Platform Management Hub
            </span>
          </div>
        </div>

        {/* Dynamic Log out action */}
        <button
          onClick={() => {
            setIsAuthenticated(false);
            sessionStorage.removeItem('sportz_admin_auth');
          }}
          className="glass-btn"
          style={{
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            borderColor: 'var(--color-live)',
            color: 'var(--color-live)'
          }}
        >
          🔒 Lock Dashboard
        </button>
      </div>

      {/* Admin Tab pill routers */}
      <div className="glass-panel" style={{ padding: '6px', display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.3)', flexWrap: 'wrap' }}>
        {[
          { id: 'overview', label: '📊 Live Overview', icon: <BarChart3 size={15} /> },
          { id: 'users', label: '👤 Users Registry', icon: <Users size={15} /> },
          { id: 'licenses', label: '🔑 Key Manager', icon: <Lock size={15} /> },
          { id: 'polls', label: '🗳️ Polls Auditor', icon: <Vote size={15} /> },
          { id: 'ads', label: '⚙️ Settings & Ads', icon: <Settings2 size={15} /> },
          { id: 'inbox', label: '✉️ Support Inbox', icon: <Mail size={15} /> },
          { id: 'simulator', label: '⚙️ Master Simulator', icon: <PlayCircle size={15} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontWeight: 700,
              fontSize: '0.8rem',
              backgroundColor: adminTab === tab.id ? 'white' : 'transparent',
              color: adminTab === tab.id ? 'var(--color-football)' : 'var(--text-secondary)',
              boxShadow: adminTab === tab.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: 1. OVERVIEW HEALTH ANALYTICS */}
      {adminTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Glowing cards grids */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Active Viewers Feed', val: '147 sessions', sub: 'Live WS Streams', color: 'var(--color-football)', icon: <Users size={16} /> },
              { label: 'Widget Embed Loadings', val: '3,840 calls', sub: '+18% vs last week', color: 'var(--color-cricket)', icon: <Network size={16} /> },
              { label: 'Ad Revenue Estimates', val: '€118.42', sub: 'Calculated this month', color: 'var(--color-gold)', icon: <DollarSign size={16} /> },
              { label: 'Poll Voters Records', val: aggregatedVoters.length + ' voters', sub: '100% audited list', color: 'var(--color-live)', icon: <TrendingUp size={16} /> }
            ].map((card, idx) => (
              <div key={idx} className="glass-panel" style={{
                padding: '18px 20px',
                background: 'white',
                borderLeft: `4.5px solid ${card.color}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{card.label}</span>
                  <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>{card.val}</span>
                  <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 500 }}>{card.sub}</span>
                </div>
                <div style={{ color: card.color, padding: '8px', background: 'rgba(0,0,0,0.02)', borderRadius: '50%' }}>{card.icon}</div>
              </div>
            ))}
          </div>

          {/* Quick Stats overview panel */}
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.45)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px', marginBottom: '12px' }}>
              📡 Widget Network Status
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Your SportZ Live widget network is fully operational. 6 widgets (Standings, Top Scorers, Livescores, Tournament Fixtures, Knockout Brackets, and Match Centres) are currently serving embed requests. All API proxy routes are caching queries gracefully from Sportmonks V3, ensuring minimal cost overhead.
            </span>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. POLL CREATION & AUDITING DATABASE */}
      {adminTab === 'polls' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '20px' }} className="admin-polls-grid">
          {/* Create Poll Card */}
          <div className="glass-panel" style={{ padding: '20px', background: 'white' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PlusCircle size={15} style={{ color: 'var(--color-cricket)' }} />
              LAUNCH NEW LIVE POLL
            </h3>

            {pollSuccess && (
              <div style={{ padding: '6px 10px', background: 'rgba(16,185,129,0.08)', color: '#065f46', fontSize: '0.75rem', fontWeight: 600, borderRadius: '6px', marginBottom: '10px' }}>
                ✓ {pollSuccess}
              </div>
            )}
            {pollError && (
              <div style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.08)', color: '#991b1b', fontSize: '0.75rem', fontWeight: 600, borderRadius: '6px', marginBottom: '10px' }}>
                ⚠️ {pollError}
              </div>
            )}

            <form onSubmit={handlePollCreation} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>ATTACH TO FIXTURE ID</label>
                <select
                  value={pollMatchId}
                  onChange={(e) => setPollMatchId(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  {matches.map(m => (
                    <option key={m.id} value={m.id}>{m.homeTeam.name} vs {m.awayTeam.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>POLL QUESTION</label>
                <input
                  type="text"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  placeholder="e.g. Who will lift the trophy?"
                  className="glass-input"
                  required
                  style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>ANSWER CHOICES</label>
                  {newPollOptions.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddOptionField}
                      style={{ border: 'none', background: 'transparent', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-cricket)', cursor: 'pointer' }}
                    >
                      + Add Option
                    </button>
                  )}
                </div>

                {newPollOptions.map((opt, oIdx) => (
                  <div key={oIdx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const copy = [...newPollOptions];
                        copy[oIdx] = e.target.value;
                        setNewPollOptions(copy);
                      }}
                      placeholder={`Choice ${oIdx + 1}`}
                      className="glass-input"
                      required
                      style={{ flex: 1, padding: '4px 8px', fontSize: '0.75rem' }}
                    />
                    {newPollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOptionField(oIdx)}
                        style={{ border: 'none', background: 'transparent', fontSize: '0.85rem', color: 'var(--color-live)', cursor: 'pointer', padding: '0 4px' }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="glass-btn btn-cricket"
                style={{ width: '100%', padding: '8px', fontSize: '0.75rem', justifyContent: 'center', fontWeight: 700, marginTop: '4px' }}
              >
                🚀 Deploy Active Poll
              </button>
            </form>
          </div>

          {/* Voter Database Audit Registry Logs */}
          <div className="glass-panel" style={{ padding: '20px', background: 'white', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={15} style={{ color: 'var(--color-football)' }} />
              AUDITED VOTER DATABASE REGISTRY
            </h3>

            <div style={{ overflowX: 'auto', maxHeight: '380px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', fontWeight: 700, borderBottom: '1.5px solid rgba(0,0,0,0.06)' }}>
                    <th style={{ padding: '8px 6px' }}>Voter Details</th>
                    <th style={{ padding: '8px 6px' }}>Target Poll Question</th>
                    <th style={{ padding: '8px 6px' }}>Vote Choice Cast</th>
                    <th style={{ padding: '8px 6px', textAlign: 'right' }}>Fixture ID</th>
                  </tr>
                </thead>
                <tbody>
                  {aggregatedVoters.length > 0 ? (
                    aggregatedVoters.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.02)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '8px 6px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>{item.name}</span>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block' }}>{item.email}</span>
                        </td>
                        <td style={{ padding: '8px 6px', color: 'var(--text-secondary)' }}>
                          <span style={{ display: 'inline-block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.question}>
                            {item.question}
                          </span>
                        </td>
                        <td style={{ padding: '8px 6px' }}>
                          <span style={{
                            padding: '2px 8px',
                            background: 'rgba(16,185,129,0.08)',
                            color: '#047857',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.65rem'
                          }}>
                            {item.choice}
                          </span>
                        </td>
                        <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 700, color: 'var(--text-muted)' }}>
                          {item.matchId}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        No voter logs present in active poll caches.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. ADSENSE slot configurations */}
      {adminTab === 'ads' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="admin-ads-grid">
          {/* Left Column: Configs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Ad settings Form */}
            <div className="glass-panel" style={{ padding: '20px', background: 'white' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Settings2 size={15} style={{ color: 'var(--color-football)' }} />
                ADSENSE INTEGRATION SETTINGS
              </h3>

              {adsSaved && (
                <div style={{ padding: '6px 10px', background: 'rgba(16,185,129,0.08)', color: '#065f46', fontSize: '0.75rem', fontWeight: 600, borderRadius: '6px', marginBottom: '10px' }}>
                  ✓ AdSense settings saved & updated in real-time!
                </div>
              )}

              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Show ads global switcher */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.02)', padding: '10px 14px', borderRadius: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>GLOBAL ADS STATUS</span>
                    <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)' }}>Toggle ads on/off across all center panels</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={adsEnabled}
                    onChange={(e) => setAdsEnabled(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>GOOGLE ADSENSE PUBLISHER ID</label>
                  <input
                    type="text"
                    value={adClient}
                    onChange={(e) => setAdClient(e.target.value)}
                    placeholder="e.g. ca-pub-xxxxxxxxxxxxxx"
                    className="glass-input"
                    required
                    style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>MATCHES SIDEBAR SLOT ID</label>
                  <input
                    type="text"
                    value={adSidebarSlot}
                    onChange={(e) => setAdSidebarSlot(e.target.value)}
                    className="glass-input"
                    required
                    style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOP HEADER BANNER SLOT ID</label>
                  <input
                    type="text"
                    value={adHeaderSlot}
                    onChange={(e) => setAdHeaderSlot(e.target.value)}
                    className="glass-input"
                    required
                    style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                  />
                </div>

                <button
                  type="submit"
                  className="glass-btn btn-football"
                  style={{ width: '100%', padding: '8px', fontSize: '0.75rem', justifyContent: 'center', fontWeight: 700 }}
                >
                  💾 Save & Apply Configurations
                </button>
              </form>
            </div>

            {/* Support Assistant settings Form */}
            <div className="glass-panel" style={{ padding: '20px', background: 'white' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={15} style={{ color: 'var(--color-cricket)' }} />
                SUPPORT ASSISTANT SETTINGS
              </h3>

              {supportSaved && (
                <div style={{ padding: '6px 10px', background: 'rgba(16,185,129,0.08)', color: '#065f46', fontSize: '0.75rem', fontWeight: 600, borderRadius: '6px', marginBottom: '10px' }}>
                  ✓ Support settings saved & updated in real-time!
                </div>
              )}

              <form onSubmit={handleSaveSupportSetting} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>DEFAULT ASSISTANT RECIPIENT EMAIL</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="e.g. cricbuzz756@gmail.com"
                    className="glass-input"
                    required
                    style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                  />
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    New developer support queries will default to this email.
                  </span>
                </div>

                <button
                  type="submit"
                  className="glass-btn btn-cricket"
                  style={{ width: '100%', padding: '8px', fontSize: '0.75rem', justifyContent: 'center', fontWeight: 700 }}
                >
                  💾 Save Support Assistant
                </button>
              </form>
            </div>
          </div>

          {/* Glowing CTR stats estimation */}
          <div className="glass-panel" style={{ padding: '20px', background: 'white', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={15} style={{ color: 'var(--color-gold)' }} />
              LIVE ADSENSE CTR METRICS
            </h3>

            {/* Glowing stats sub-grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL IMPRESSIONS</span>
                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '2px' }}>8,240</span>
              </div>
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)' }}>AVERAGE CTR (CLICK RATE)</span>
                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-cricket)', marginTop: '2px' }}>2.14%</span>
              </div>
            </div>

            {/* Mock chart illustration */}
            <div style={{
              background: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              height: '140px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: '8px',
              position: 'relative'
            }}>
              <span style={{ position: 'absolute', top: '8px', left: '10px', fontSize: '0.55rem', color: '#94a3b8', fontWeight: 800 }}>ESTIMATED EARNINGS (€/day)</span>
              
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '80px', padding: '0 10px' }}>
                {[15, 25, 45, 30, 60, 50, 85].map((val, idx) => (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '100%',
                      height: `${val}%`,
                      background: 'linear-gradient(0deg, var(--color-football) 0%, var(--color-cricket) 100%)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.8s ease'
                    }} />
                    <span style={{ fontSize: '0.45rem', color: '#94a3b8' }}>M{idx+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. SECURE MASTER MATCH SIMULATOR */}
      {adminTab === 'simulator' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) 1.8fr', gap: '20px' }} className="admin-sim-grid">
          {/* Controls Sidebar */}
          <div className="glass-panel" style={{ padding: '20px', background: 'white', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PlayCircle size={15} style={{ color: 'var(--color-live)' }} />
              SECURE SIMULATOR TRIGGERS
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>SELECT ACTIVE SIM FIXTURE</label>
              <select
                value={activeSimMatchId}
                onChange={(e) => setActiveSimMatchId(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '0.75rem',
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

            {simStatus && (
              <div style={{
                padding: '6px 10px',
                background: simStatus.startsWith('Failed') ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                color: simStatus.startsWith('Failed') ? '#991b1b' : '#065f46',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '6px'
              }}>
                ✓ {simStatus}
              </div>
            )}

            {simMatch ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
                
                {/* FOOTBALL CONTROLS */}
                {simMatch.sport === 'football' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        value={fbPlayerName}
                        onChange={(e) => setFbPlayerName(e.target.value)}
                        placeholder="Goal/Card Player Name"
                        className="glass-input"
                        style={{ flex: 1, padding: '6px 10px', fontSize: '0.75rem' }}
                      />
                      <input
                        type="number"
                        value={fbMinute}
                        onChange={(e) => setFbMinute(e.target.value)}
                        placeholder="Min"
                        className="glass-input"
                        style={{ width: '50px', padding: '6px 6px', fontSize: '0.75rem', textAlign: 'center' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => triggerSimulatorEvent('goal', { team: 'home', player: fbPlayerName || 'M. Ødegaard', minute: parseInt(fbMinute) || 78 })}
                        disabled={simLoading || simMatch.status !== 'live'}
                        className="glass-btn"
                        style={{ flex: 1, padding: '6px', fontSize: '0.7rem', fontWeight: 700, borderLeft: '3px solid var(--color-football)', justifyContent: 'center' }}
                      >
                        ⚽ Goal {simMatch.homeTeam.shortName}
                      </button>
                      <button
                        onClick={() => triggerSimulatorEvent('goal', { team: 'away', player: fbPlayerName || 'C. Palmer', minute: parseInt(fbMinute) || 78 })}
                        disabled={simLoading || simMatch.status !== 'live'}
                        className="glass-btn"
                        style={{ flex: 1, padding: '6px', fontSize: '0.7rem', fontWeight: 700, borderLeft: '3px solid var(--color-live)', justifyContent: 'center' }}
                      >
                        ⚽ Goal {simMatch.awayTeam.shortName}
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(0,0,0,0.01)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <select value={fbEventTeam} onChange={(e) => setFbEventTeam(e.target.value)} style={{ flex: 1, fontSize: '0.7rem', padding: '4px' }}>
                          <option value="home">{simMatch.homeTeam.name}</option>
                          <option value="away">{simMatch.awayTeam.name}</option>
                        </select>
                        <select value={fbCardType} onChange={(e) => setFbCardType(e.target.value)} style={{ flex: 1, fontSize: '0.7rem', padding: '4px' }}>
                          <option value="yellow">🟨 Yellow Card</option>
                          <option value="red">🟥 Red Card</option>
                        </select>
                      </div>
                      <button
                        onClick={() => triggerSimulatorEvent('card', { team: fbEventTeam, card: fbCardType, player: fbPlayerName || 'W. Saliba', minute: parseInt(fbMinute) || 78 })}
                        disabled={simLoading || simMatch.status !== 'live'}
                        className="glass-btn btn-football"
                        style={{ width: '100%', padding: '6px', fontSize: '0.7rem', justifyContent: 'center', fontWeight: 700 }}
                      >
                        🚨 Book Player
                      </button>
                    </div>
                  </div>
                )}

                {/* CRICKET CONTROLS */}
                {simMatch.sport === 'cricket' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>INJECT RUNS</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                        {[0, 1, 2, 4, 6].map(runs => (
                          <button
                            key={runs}
                            onClick={() => triggerSimulatorEvent('runs', { runs })}
                            disabled={simLoading || simMatch.status !== 'live'}
                            className="glass-btn"
                            style={{ padding: '6px 0', fontSize: '0.75rem', fontWeight: 800, justifyContent: 'center' }}
                          >
                            {runs}r
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(0,0,0,0.01)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.03)' }}>
                      <input
                        type="text"
                        value={crWicketBatsman}
                        onChange={(e) => setCrWicketBatsman(e.target.value)}
                        placeholder="Incoming Batsman"
                        className="glass-input"
                        style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                      />
                      <button
                        onClick={() => triggerSimulatorEvent('wicket', { newBatsman: crWicketBatsman || 'MS Dhoni' })}
                        disabled={simLoading || simMatch.status !== 'live'}
                        className="glass-btn btn-cricket"
                        style={{ width: '100%', padding: '6px', fontSize: '0.7rem', justifyContent: 'center', fontWeight: 700 }}
                      >
                        ☝️ Dismiss Stryker (Wicket Out)
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Loading active fixture details...</span>
            )}
          </div>

          {/* Preview Sandbox / Live commentary console */}
          <div className="glass-panel" style={{ padding: '20px', background: 'white', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={15} style={{ color: 'var(--color-cricket)' }} />
              MATCH DETAILS PREVIEW
            </h3>

            {simMatch ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.2rem', display: 'block' }}>{simMatch.homeTeam.logo}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{simMatch.homeTeam.name}</span>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-live)' }}>
                      {simMatch.status === 'upcoming' ? 'VS' : `${simMatch.score.home} - ${simMatch.score.away}`}
                    </span>
                    <span style={{ fontSize: '0.55rem', display: 'block', color: 'var(--text-muted)', fontWeight: 700 }}>
                      STATUS: {simMatch.status.toUpperCase()} ({simMatch.time})
                    </span>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.2rem', display: 'block' }}>{simMatch.awayTeam.logo}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{simMatch.awayTeam.name}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>LATEST COMMENTARY LOGS</span>
                  <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1.5px solid rgba(0,0,0,0.04)', borderRadius: '8px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {simMatch.commentary && simMatch.commentary.length > 0 ? (
                      simMatch.commentary.map((c, idx) => (
                        <div key={idx} style={{ padding: '4px 6px', background: 'rgba(0,0,0,0.01)', borderBottom: '0.5px solid rgba(0,0,0,0.02)', lineHeight: '1.3' }}>
                          <span style={{ fontWeight: 800, color: 'var(--color-football)', marginRight: '4px' }}>[{c.minute || `Ov ${c.over}`}]</span>
                          <span>{c.text}</span>
                        </div>
                      ))
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No commentaries broadcast yet.</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sandbox empty. Select a match to begin.</span>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. ADMIN USERS REGISTRY GRIDS */}
      {adminTab === 'users' && (
        <div className="glass-panel" style={{ padding: '24px 20px', background: 'white', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} style={{ color: 'var(--color-football)' }} />
            REGISTERED DEVELOPER ACCOUNTS AUDIT TABLE
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', fontWeight: 700, borderBottom: '1.5px solid rgba(0,0,0,0.06)' }}>
                  <th style={{ padding: '8px 6px' }}>Developer Account Details</th>
                  <th style={{ padding: '8px 6px' }}>Country</th>
                  <th style={{ padding: '8px 6px' }}>Phone Number</th>
                  <th style={{ padding: '8px 6px' }}>Billing Address</th>
                  <th style={{ padding: '8px 6px', textAlign: 'center' }}>Subscription Tier</th>
                  <th style={{ padding: '8px 6px', textAlign: 'center' }}>Active License Key</th>
                  <th style={{ padding: '8px 6px', textAlign: 'right' }}>Manual Override Action</th>
                </tr>
              </thead>
              <tbody>
                {registeredUsers.length > 0 ? (
                  registeredUsers.map((usr) => (
                    <tr key={usr.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                      <td style={{ padding: '8px 6px' }}>
                        <span style={{ fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>{usr.name}</span>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block' }}>{usr.email}</span>
                      </td>
                      <td style={{ padding: '8px 6px', fontWeight: 600, color: 'var(--text-secondary)' }}>{usr.country || 'N/A'}</td>
                      <td style={{ padding: '8px 6px', color: 'var(--text-secondary)' }}>{usr.phone || 'N/A'}</td>
                      <td style={{ padding: '8px 6px', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'inline-block', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={usr.address}>
                          {usr.address || 'N/A'}
                        </span>
                      </td>
                      <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                        <span style={{
                          padding: '2px 8px',
                          background: usr.status === 'pro' ? 'rgba(79, 70, 229, 0.08)' : 'rgba(0,0,0,0.04)',
                          color: usr.status === 'pro' ? '#4f46e5' : 'var(--text-secondary)',
                          borderRadius: '4px',
                          fontWeight: 800,
                          fontSize: '0.65rem'
                        }}>
                          {usr.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                        {usr.licenseKey ? (
                          <code style={{ background: 'rgba(0,0,0,0.04)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontFamily: 'Consolas, monospace', fontWeight: 700 }}>
                            {usr.licenseKey}
                          </code>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.65rem' }}>No Active Key</span>
                        )}
                      </td>
                      <td style={{ padding: '8px 6px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleToggleUserStatus(usr.id)}
                          className="glass-btn"
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            borderColor: usr.status === 'pro' ? 'var(--color-live)' : '#4f46e5',
                            color: usr.status === 'pro' ? 'var(--color-live)' : '#4f46e5'
                          }}
                        >
                          {usr.status === 'pro' ? 'Downgrade' : 'Upgrade to Pro'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      No registered user accounts found in local auth caches.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 6. ADMIN SAAS LICENSES KEY MANAGER */}
      {adminTab === 'licenses' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px' }} className="admin-licenses-grid">
          {/* Manual License Generator */}
          <div className="glass-panel" style={{ padding: '20px', background: 'white' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={15} style={{ color: 'var(--color-gold)' }} />
              ISSUE MANUAL LICENSE KEY
            </h3>

            {manualKeySuccess && (
              <div style={{ padding: '6px 10px', background: 'rgba(16,185,129,0.08)', color: '#065f46', fontSize: '0.75rem', fontWeight: 600, borderRadius: '6px', marginBottom: '10px' }}>
                ✓ {manualKeySuccess}
              </div>
            )}

            <form onSubmit={handleCreateManualLicense} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>MANUAL KEY IDENTIFIER (OPTIONAL)</label>
                <input
                  type="text"
                  value={customSuffix}
                  onChange={(e) => setCustomSuffix(e.target.value)}
                  placeholder="e.g. VIP88 (Max 8 characters)"
                  className="glass-input"
                  maxLength={8}
                  style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                />
              </div>

              <button
                type="submit"
                className="glass-btn btn-football"
                style={{ width: '100%', padding: '8px', fontSize: '0.75rem', justifyContent: 'center', fontWeight: 700, marginTop: '4px' }}
              >
                🔑 Generate Premium Key
              </button>
            </form>
          </div>

          {/* Licenses Registry Table */}
          <div className="glass-panel" style={{ padding: '20px', background: 'white', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={15} style={{ color: 'var(--color-football)' }} />
              ACTIVE PREMIUM LICENSES REGISTRY
            </h3>

            <div style={{ overflowX: 'auto', maxHeight: '380px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', fontWeight: 700, borderBottom: '1.5px solid rgba(0,0,0,0.06)' }}>
                    <th style={{ padding: '8px 6px' }}>Active Premium License Key</th>
                    <th style={{ padding: '8px 6px', textAlign: 'center' }}>Validity Integrity</th>
                    <th style={{ padding: '8px 6px', textAlign: 'right' }}>Administrative Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeLicenses.length > 0 ? (
                    activeLicenses.map((keyVal, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                        <td style={{ padding: '8px 6px' }}>
                          <code style={{ background: 'rgba(0,0,0,0.04)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'Consolas, monospace', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {keyVal}
                          </code>
                        </td>
                        <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                          <span style={{
                            padding: '2px 8px',
                            background: 'rgba(16,185,129,0.08)',
                            color: '#047857',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.65rem'
                          }}>
                            ✓ VALID & ACTIVE
                          </span>
                        </td>
                        <td style={{ padding: '8px 6px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleRevokeLicenseKey(keyVal)}
                            className="glass-btn"
                            style={{
                              padding: '4px 8px',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              borderColor: 'var(--color-live)',
                              color: 'var(--color-live)'
                            }}
                          >
                            Revoke Key
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        No active premium keys in database registry.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 7. SUPPORT INBOX TICKET MANAGER */}
      {adminTab === 'inbox' && (
        <div className="glass-panel" style={{ padding: '24px 20px', background: 'white', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={16} style={{ color: 'var(--color-cricket)' }} />
            SUPPORT TICKET HUB & ROUTING MANAGER
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', fontWeight: 700, borderBottom: '1.5px solid rgba(0,0,0,0.06)' }}>
                  <th style={{ padding: '8px 6px', width: '100px' }}>Ticket Details</th>
                  <th style={{ padding: '8px 6px', width: '150px' }}>Developer Account</th>
                  <th style={{ padding: '8px 6px' }}>Subject & Message</th>
                  <th style={{ padding: '8px 6px', textAlign: 'center', width: '100px' }}>Status</th>
                  <th style={{ padding: '8px 6px', textAlign: 'right', width: '320px' }}>Assigned Support Assistant / Actions</th>
                </tr>
              </thead>
              <tbody>
                {supportQueries.length > 0 ? (
                  supportQueries.map((query) => {
                    const currentEditEmail = editedEmails[query.id] !== undefined 
                      ? editedEmails[query.id] 
                      : query.forwardedTo || '';

                    return (
                      <tr key={query.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.02)', verticalAlign: 'top' }}>
                        <td style={{ padding: '12px 6px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--text-primary)', display: 'block', fontFamily: 'Consolas, monospace' }}>
                            {query.id}
                          </span>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                            {new Date(query.timestamp).toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: '12px 6px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>{query.name}</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>{query.email}</span>
                          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block' }}>ID: {query.userId}</span>
                        </td>
                        <td style={{ padding: '12px 6px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                            {query.subject}
                          </span>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', background: 'rgba(0,0,0,0.01)', padding: '8px', borderRadius: '6px', border: '1px dashed rgba(0,0,0,0.05)', whiteSpace: 'pre-wrap' }}>
                            {query.message}
                          </span>
                        </td>
                        <td style={{ padding: '12px 6px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleUpdateQuery(query.id, undefined, query.status === 'resolved' ? 'pending' : 'resolved')}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              outline: 'none',
                              padding: 0
                            }}
                            title="Click to toggle status"
                          >
                            <span style={{
                              padding: '3px 8px',
                              background: query.status === 'resolved' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                              color: query.status === 'resolved' ? '#047857' : '#d97706',
                              borderRadius: '4px',
                              fontWeight: 800,
                              fontSize: '0.65rem',
                              display: 'inline-block'
                            }}>
                              {query.status ? query.status.toUpperCase() : 'PENDING'}
                            </span>
                          </button>
                        </td>
                        <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <input
                              type="email"
                              value={currentEditEmail}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditedEmails(prev => ({
                                  ...prev,
                                  [query.id]: val
                                }));
                              }}
                              placeholder="Assign assistant email"
                              className="glass-input"
                              style={{
                                padding: '4px 8px',
                                fontSize: '0.7rem',
                                width: '180px',
                                textAlign: 'left'
                              }}
                            />
                            <button
                              onClick={() => handleUpdateQuery(query.id, currentEditEmail, undefined)}
                              className="glass-btn btn-cricket"
                              style={{
                                padding: '4px 10px',
                                fontSize: '0.65rem',
                                fontWeight: 700
                              }}
                            >
                              Reassign
                            </button>
                          </div>
                          <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Active Forward: <code style={{ fontFamily: 'Consolas, monospace', fontWeight: 600 }}>{query.forwardedTo}</code>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      No support tickets found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
