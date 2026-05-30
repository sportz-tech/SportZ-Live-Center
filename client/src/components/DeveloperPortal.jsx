import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Globe, 
  Phone, 
  MapPin, 
  Key, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  LogOut, 
  ArrowRight,
  TrendingUp,
  Sliders,
  DollarSign
} from 'lucide-react';

/**
 * Premium SaaS Developer Portal
 * 
 * Provides:
 * 1. Log In / Sign Up Gateway Form (Name, Email, Password, Country, Phone, Address).
 * 2. Profile Console (displays account metrics, status badge).
 * 3. PayPal Smart Checkout upgrade portal.
 * 4. Active premium license credentials key viewer.
 */
export default function DeveloperPortal({ apiHost = 'http://localhost:5000' }) {
  const [user, setUser] = useState(null);
  const [authTab, setAuthTab] = useState('login'); // 'login' or 'register'
  
  // Auth Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Billing and PayPal states
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [guideTab, setGuideTab] = useState('npm'); // 'npm' or 'iframe'

  // Support ticket form states
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSuccess, setSupportSuccess] = useState('');
  const [supportError, setSupportError] = useState('');
  const [supportLoading, setSupportLoading] = useState(false);

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMessage.trim()) return;

    setSupportLoading(true);
    setSupportSuccess('');
    setSupportError('');

    try {
      const res = await fetch(`${apiHost}/api/support/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: user.name,
          email: user.email,
          subject: supportSubject,
          message: supportMessage
        })
      });

      if (res.ok) {
        setSupportSuccess("Support query logged! We will reply within 12 hours.");
        setSupportSubject('');
        setSupportMessage('');
      } else {
        const err = await res.json();
        setSupportError(err.error || 'Failed to submit support request.');
      }
    } catch (err) {
      setSupportError('Server communication error.');
    } finally {
      setSupportLoading(false);
    }
  };

  // Sync persistent auth state from sessionStorage
  useEffect(() => {
    const cached = sessionStorage.getItem('sportz_dev_user');
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch (e) {
        sessionStorage.removeItem('sportz_dev_user');
      }
    }
  }, []);

  // Dynamically load PayPal Smart Buttons SDK
  useEffect(() => {
    if (!user || user.status === 'pro' || window.paypal) {
      if (window.paypal) setPaypalLoaded(true);
      return;
    }

    const scriptId = 'paypal-portal-sdk';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=sb&currency=EUR`;
      script.async = true;
      script.onload = () => {
        console.log("PayPal SDK loaded inside Developer Portal.");
        setPaypalLoaded(true);
      };
      script.onerror = () => console.error("PayPal SDK failed to load inside Portal.");
      document.body.appendChild(script);
    } else {
      setPaypalLoaded(true);
    }
  }, [user]);

  // Render PayPal checkout buttons
  useEffect(() => {
    if (!paypalLoaded || !user || user.status === 'pro' || !window.paypal) return;

    const container = document.getElementById('paypal-portal-container');
    if (container) {
      container.innerHTML = '';
    }

    try {
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              description: `SportZ Premium Pro Subscription upgrade for ${user.email}`,
              amount: {
                currency_code: 'EUR',
                value: '29.00'
              }
            }]
          });
        },
        onApprove: async (data, actions) => {
          try {
            const details = await actions.order.capture();
            console.log("Upgrade payment approved:", details);

            const res = await fetch(`${apiHost}/api/auth/upgrade`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id,
                orderId: details.id
              })
            });

            if (res.ok) {
              const resData = await res.json();
              setUser(resData.user);
              sessionStorage.setItem('sportz_dev_user', JSON.stringify(resData.user));
              setUpgradeSuccess(true);
            } else {
              alert("Payment captured, but server failed to update subscription status. Please contact support.");
            }
          } catch (err) {
            console.error("Capture capture error:", err);
          }
        },
        onError: (err) => {
          console.error("Smart Button Checkout error:", err);
        }
      }).render('#paypal-portal-container');
    } catch (err) {
      console.warn("PayPal initialization block:", err);
    }
  }, [paypalLoaded, user]);

  // Auth Submit Handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    try {
      const res = await fetch(`${apiHost}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        sessionStorage.setItem('sportz_dev_user', JSON.stringify(data.user));
        setAuthSuccess(`Welcome back, ${data.user.name}!`);
        setEmail('');
        setPassword('');
      } else {
        const err = await res.json();
        setAuthError(err.error || 'Authentication failed.');
      }
    } catch (err) {
      setAuthError('Connection issue. Server offline?');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    try {
      const res = await fetch(`${apiHost}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, country, phone, address })
      });

      if (res.ok) {
        setAuthSuccess('Account registered successfully! Please log in.');
        setAuthTab('login');
        setName('');
        setCountry('');
        setPhone('');
        setAddress('');
        setPassword('');
      } else {
        const err = await res.json();
        setAuthError(err.error || 'Registration failed.');
      }
    } catch (err) {
      setAuthError('Connection issue. Server offline?');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUpgradeSuccess(false);
    sessionStorage.removeItem('sportz_dev_user');
  };

  // --- RENDER 1: AUTHENTICATION LOGIN/SIGNUP SHIELD ---
  if (!user) {
    return (
      <div style={{ maxWidth: '460px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '30px 24px', background: 'white' }}>
          
          {/* Logo brand and tab header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '2.2rem', animation: 'bounce 3s infinite' }}>👤</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>Developer Account</h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              SportZ Widget SaaS Network Portal
            </span>
          </div>

          {/* Login vs Register Tab Selector */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.04)', padding: '4px', borderRadius: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => { setAuthTab('login'); setAuthError(''); setAuthSuccess(''); }}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.75rem',
                backgroundColor: authTab === 'login' ? 'white' : 'transparent',
                color: authTab === 'login' ? 'var(--color-football)' : 'var(--text-secondary)',
                boxShadow: authTab === 'login' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Sign In Account
            </button>
            <button
              onClick={() => { setAuthTab('register'); setAuthError(''); setAuthSuccess(''); }}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.75rem',
                backgroundColor: authTab === 'register' ? 'white' : 'transparent',
                color: authTab === 'register' ? 'var(--color-football)' : 'var(--text-secondary)',
                boxShadow: authTab === 'register' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Create Account
            </button>
          </div>

          {authError && (
            <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '8px', fontSize: '0.75rem', color: '#ef4444', marginBottom: '14px', fontWeight: 600 }}>
              ⚠️ {authError}
            </div>
          )}

          {authSuccess && (
            <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '8px', fontSize: '0.75rem', color: '#047857', marginBottom: '14px', fontWeight: 600 }}>
              ✓ {authSuccess}
            </div>
          )}

          {/* RENDER LOGIN FORM */}
          {authTab === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>EMAIL ADDRESS</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@sportz.com"
                    className="glass-input"
                    required
                    style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="glass-input"
                    required
                    style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="glass-btn btn-football"
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', fontWeight: 700, justifyContent: 'center', marginTop: '10px' }}
              >
                Sign In & Unlock Portal
              </button>
            </form>
          )}

          {/* RENDER REGISTER FORM */}
          {authTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>FULL NAME</label>
                  <div style={{ position: 'relative' }}>
                    <User size={13} style={{ position: 'absolute', top: '11px', left: '10px', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="glass-input"
                      required
                      style={{ width: '100%', paddingLeft: '28px', paddingRight: '6px', fontSize: '0.75rem' }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>EMAIL</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={13} style={{ position: 'absolute', top: '11px', left: '10px', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="glass-input"
                      required
                      style={{ width: '100%', paddingLeft: '28px', paddingRight: '6px', fontSize: '0.75rem' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>PASSWORD</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={13} style={{ position: 'absolute', top: '11px', left: '10px', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="glass-input"
                      required
                      style={{ width: '100%', paddingLeft: '28px', paddingRight: '6px', fontSize: '0.75rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>COUNTRY</label>
                  <div style={{ position: 'relative' }}>
                    <Globe size={13} style={{ position: 'absolute', top: '11px', left: '10px', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Germany"
                      className="glass-input"
                      style={{ width: '100%', paddingLeft: '28px', paddingRight: '6px', fontSize: '0.75rem' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>PHONE NUMBER</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={13} style={{ position: 'absolute', top: '11px', left: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+49 170 1234567"
                    className="glass-input"
                    style={{ width: '100%', paddingLeft: '28px', paddingRight: '6px', fontSize: '0.75rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>BILLING ADDRESS</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={13} style={{ position: 'absolute', top: '11px', left: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, City, Postal Code"
                    className="glass-input"
                    style={{ width: '100%', paddingLeft: '28px', paddingRight: '6px', fontSize: '0.75rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="glass-btn btn-cricket"
                style={{ width: '100%', padding: '10px', fontSize: '0.85rem', fontWeight: 700, justifyContent: 'center', marginTop: '10px' }}
              >
                Create Account & Register
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  // --- RENDER 2: DEVELOPER DASHBOARD HUB (LOGGED IN) ---
  const isPro = user.status === 'pro';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Welcome Top Header Bar */}
      <div className="glass-panel" style={{
        padding: '16px 24px',
        background: 'rgba(255,255,255,0.45)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.6rem', animation: 'pulse 3s infinite' }}>👤</span>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>Welcome, {user.name}</h2>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              SportZ Account Hub • ID: {user.id}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="glass-btn"
          style={{
            padding: '6px 12px',
            fontSize: '0.7rem',
            fontWeight: 700,
            borderColor: 'var(--color-live)',
            color: 'var(--color-live)',
            gap: '4px'
          }}
        >
          <LogOut size={12} />
          <span>Log Out</span>
        </button>
      </div>

      {/* Profile Metrics Grid Layout splits */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1.8fr',
        gap: '20px',
        alignItems: 'start'
      }} className="portal-split">
        
        {/* LEFT COLUMN: CONTACT DETAILS & STATUS PROFILE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* User Profile Card */}
          <div className="glass-panel" style={{ padding: '20px', background: 'white', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '6px', color: 'var(--text-primary)' }}>
              Developer Profile Details
            </h3>

            {/* Profile info rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.75rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.6rem', fontWeight: 700 }}>ACCOUNT TYPE</span>
                <span style={{
                  display: 'inline-flex',
                  padding: '2px 8px',
                  background: isPro ? 'rgba(79, 70, 229, 0.08)' : 'rgba(0,0,0,0.04)',
                  color: isPro ? '#4f46e5' : 'var(--text-secondary)',
                  borderRadius: '4px',
                  fontWeight: 800,
                  fontSize: '0.65rem',
                  marginTop: '2px',
                  textTransform: 'uppercase'
                }}>
                  {isPro ? '🏆 Premium Pro Subscriber' : 'Standard Normal User'}
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.6rem', fontWeight: 700 }}>EMAIL ADDRESS</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.email}</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.6rem', fontWeight: 700 }}>COUNTRY OF ORIGIN</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.country || 'Not specified'}</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.6rem', fontWeight: 700 }}>PHONE NUMBER</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.phone || 'Not specified'}</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.6rem', fontWeight: 700 }}>BILLING ADDRESS</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.address || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* CONTACT SUPPORT CARD */}
          <div className="glass-panel" style={{
            padding: '20px',
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            textAlign: 'left',
            border: '1px solid rgba(0,0,0,0.06)'
          }}>
            <div>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                📬 Contact Support & Queries
              </h3>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                Have a query? Submit a ticket to our SLA response team.
              </span>
            </div>

            {supportSuccess && (
              <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.08)', color: '#047857', fontSize: '0.7rem', fontWeight: 600, borderRadius: '8px' }}>
                ✓ {supportSuccess}
              </div>
            )}
            {supportError && (
              <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', fontSize: '0.7rem', fontWeight: 600, borderRadius: '8px' }}>
                ⚠️ {supportError}
              </div>
            )}

            <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>SUBJECT</label>
                <input
                  type="text"
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  placeholder="e.g. License verification issue"
                  className="glass-input"
                  required
                  style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>MESSAGE OR QUERY</label>
                <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Please describe your query in detail..."
                  className="glass-input"
                  required
                  rows={4}
                  style={{
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={supportLoading}
                className="glass-btn btn-football"
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  justifyContent: 'center',
                  borderColor: 'var(--color-football)',
                  color: 'white',
                  marginTop: '4px'
                }}
              >
                {supportLoading ? 'Submitting Query...' : '🚀 Submit Support Ticket'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: PREMIUM UPGRADE / ACTIVE LICENSE KEY CONSOLE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active license card if PRO */}
          {isPro ? (
            <>
              <div className="glass-panel" style={{
              padding: '24px',
              background: 'linear-gradient(135deg, white 0%, rgba(16, 185, 129, 0.03) 100%)',
              border: '2px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#047857', fontWeight: 800, fontSize: '0.8rem' }}>
                  <CheckCircle2 size={16} />
                  <span>PREMIUM PRO LICENSE KEY REGISTERED</span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.3' }}>
                  Your subscription status is **Active** and validated. All widget iframe embeds and native React component instances registered with this credential key will load dynamically **100% ad-free**!
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <code style={{
                  background: 'white',
                  border: '1.5px solid rgba(16, 185, 129, 0.2)',
                  color: 'var(--text-primary)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  flex: 1,
                  textAlign: 'center',
                  fontFamily: 'Consolas, monospace',
                  boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.01)'
                }}>{user.licenseKey}</code>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user.licenseKey);
                    alert("License key copied successfully!");
                  }}
                  className="glass-btn"
                  style={{
                    padding: '8px 14px',
                    borderColor: '#10b981',
                    color: '#10b981',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  Copy Key
                </button>
              </div>

              <div style={{ borderTop: '1.5px solid rgba(0,0,0,0.04)', paddingTop: '14px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                💡 Tip: Copy your license key above and paste it inside the Widget Configurator Wizard (Step 3) to configure your layouts before copying the final implementation codes.
              </div>
            </div>

            {/* INTEGRATION GUIDE CARD */}
            <div className="glass-panel" style={{
              padding: '24px',
              background: 'white',
              border: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              textAlign: 'left'
            }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  🛠️ Widget Integration & Setup Guide
                </h3>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  Deploy your Premium Ad-Free widgets inside your application
                </span>
              </div>

              {/* Guide Tab Pills */}
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.04)', padding: '4px', borderRadius: '8px' }}>
                <button
                  onClick={() => setGuideTab('npm')}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    backgroundColor: guideTab === 'npm' ? 'white' : 'transparent',
                    color: guideTab === 'npm' ? 'var(--color-football)' : 'var(--text-secondary)',
                    boxShadow: guideTab === 'npm' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  📦 NPM Library Method
                </button>
                <button
                  onClick={() => setGuideTab('iframe')}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    backgroundColor: guideTab === 'iframe' ? 'white' : 'transparent',
                    color: guideTab === 'iframe' ? 'var(--color-football)' : 'var(--text-secondary)',
                    boxShadow: guideTab === 'iframe' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  🌐 HTML IFrame Embed
                </button>
              </div>

              {/* Tab 1: NPM */}
              {guideTab === 'npm' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                      1. Install package via terminal:
                    </strong>
                    <pre style={{
                      background: '#0f172a',
                      color: '#38bdf8',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontFamily: 'Consolas, monospace',
                      margin: 0
                    }}>
                      npm install sportz-premium-live-widgets
                    </pre>
                  </div>

                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                      2. Implement inside your React project:
                    </strong>
                    <pre style={{
                      background: '#0f172a',
                      color: '#38bdf8',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontFamily: 'Consolas, monospace',
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      textAlign: 'left'
                    }}>
{`import React from 'react';
import { SportZWidget } from 'sportz-premium-live-widgets';
import 'sportz-premium-live-widgets/dist-lib/sportz-premium-live-widgets.css';

export default function StandingsWidget() {
  return (
    <SportZWidget 
      type="standings"
      theme="glass"
      licenseKey="${user.licenseKey}"
    />
  );
}`}
                    </pre>
                  </div>
                </div>
              )}

              {/* Tab 2: IFRAME */}
              {guideTab === 'iframe' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                      Copy this iframe tag to paste in your HTML pages:
                    </strong>
                    <pre style={{
                      background: '#0f172a',
                      color: '#38bdf8',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontFamily: 'Consolas, monospace',
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      textAlign: 'left'
                    }}>
{`<iframe 
  src="${window.location.origin}/?embed=true&type=bracket&theme=glass&accent=%233b82f6&licenseKey=${user.licenseKey}" 
  width="100%" 
  height="600" 
  style="border:none; border-radius:16px;" 
  scrolling="no">
</iframe>`}
                    </pre>
                  </div>
                  <span style={{ fontSize: '0.65rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                    💡 Tip: You can adjust type (bracket, standings, topscorers, matchcentre) and theme parameters directly in the URL query string!
                  </span>
                </div>
              )}
            </div>
          </>
          ) : (
            /* Billing checkout forms if normal */
            <div className="glass-panel" style={{
              padding: '24px',
              background: 'linear-gradient(135deg, white 0%, rgba(79, 70, 229, 0.03) 100%)',
              border: '2px solid rgba(79, 70, 229, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 8px 32px 0 rgba(79, 70, 229, 0.05)'
            }}>
              <div>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(79, 70, 229, 0.9)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Upgrade to Premium</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '2px' }}>Go Ad-Free Pro Tier</h3>
                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>Remove ads entirely from all your widget integrations</span>
              </div>

              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                €29<span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/month</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(79, 70, 229, 0.1)', paddingTop: '14px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>✓ Deactivates standard AdSense ad grids on your site</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>✓ Secure premium license key generated immediately</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>✓ 100% compliant with React & HTML embed formats</div>
              </div>

              {/* PayPal block */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>CHECKOUT WITH SECURE PAYPAL GATEWAY</label>
                {!paypalLoaded ? (
                  <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '10px' }}>
                    Loading PayPal Checkout gateway...
                  </div>
                ) : null}
                <div id="paypal-portal-container"></div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
