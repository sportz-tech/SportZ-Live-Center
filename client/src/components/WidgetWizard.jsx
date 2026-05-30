import React, { useState, useEffect } from 'react';
import SportZWidget from './SportZWidget';
import { 
  Trophy, 
  TrendingUp, 
  Tv, 
  Calendar, 
  GitCommit, 
  Activity, 
  Sparkles, 
  Copy, 
  Check, 
  Settings, 
  Sliders, 
  Layout, 
  Code,
  Palette
} from 'lucide-react';

/**
 * Premium Widget Configuration Wizard Dashboard
 * 
 * Includes:
 * - 3-step configuration settings (Type, Style, Details)
 * - Live real-time Preview Sandbox
 * - Integration code generation hub (Iframe and React component)
 * - Click-to-copy utility with responsive checks animations
 */
export default function WidgetWizard({ apiHost = 'http://localhost:5000', setMainView }) {
  // Config state variables
  const [widgetType, setWidgetType] = useState('standings');
  const [theme, setTheme] = useState('glass');
  const [accent, setAccent] = useState('#3b82f6');
  const [font, setFont] = useState('Outfit');
  const [borders, setBorders] = useState('rounded');
  const [licenseKey, setLicenseKey] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [devUser, setDevUser] = useState(null);

  // Sync logged in Pro developer license key and session automatically
  useEffect(() => {
    const devUserStr = sessionStorage.getItem('sportz_dev_user');
    if (devUserStr) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(devUserStr);
        setDevUser(parsedUser);
        if (parsedUser && parsedUser.status === 'pro' && parsedUser.licenseKey) {
          setLicenseKey(parsedUser.licenseKey);
        }
      } catch (e) {
        console.error("Failed to parse dev user session in Wizard:", e);
      }
    } else {
      setIsLoggedIn(false);
      setDevUser(null);
    }
  }, []);

  const [wizardTab, setWizardTab] = useState('builder'); // builder or pricing
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [purchasedKey, setPurchasedKey] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dynamic PayPal JS SDK script loader
  useEffect(() => {
    if (wizardTab !== 'pricing' || window.paypal) {
      if (window.paypal) setPaypalLoaded(true);
      return;
    }

    const scriptId = 'paypal-sdk-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=sb&currency=EUR`;
      script.async = true;
      
      script.onload = () => {
        console.log("PayPal JS SDK loaded successfully.");
        setPaypalLoaded(true);
      };

      script.onerror = () => {
        console.error("Failed to load PayPal JS SDK.");
      };

      document.body.appendChild(script);
    } else {
      setPaypalLoaded(true);
    }
  }, [wizardTab]);

  // Render PayPal Smart buttons dynamically once SDK is loaded
  useEffect(() => {
    if (!paypalLoaded || wizardTab !== 'pricing' || !window.paypal || isLoggedIn && devUser && devUser.status === 'pro') return;

    const container = document.getElementById('paypal-button-container');
    if (container) {
      container.innerHTML = '';
    }

    try {
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal'
        },
        createOrder: (data, actions) => {
          const value = billingCycle === 'yearly' ? '249.00' : '29.00';
          const description = billingCycle === 'yearly'
            ? 'SportZ Widget Premium Subscription (Yearly Pro Plan - Save 30%)'
            : 'SportZ Widget Premium Subscription (Monthly Pro Plan)';
          return actions.order.create({
            purchase_units: [{
              description: description,
              amount: {
                currency_code: 'EUR',
                value: value
              }
            }]
          });
        },
        onApprove: async (data, actions) => {
          try {
            const details = await actions.order.capture();
            console.log("PayPal payment capture successful:", details);
            
            // Call the correct endpoint based on login status to ensure the developer profile updates to pro
            const apiEndpoint = isLoggedIn && devUser 
              ? `${apiHost}/api/auth/upgrade` 
              : `${apiHost}/api/license/generate`;
              
            const bodyPayload = isLoggedIn && devUser
              ? { userId: devUser.id, orderId: details.id }
              : { orderId: details.id, payerEmail: details.payer?.email_address };

            const res = await fetch(apiEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bodyPayload)
            });

            if (res.ok) {
              const resData = await res.json();
              const activeKey = resData.licenseKey || resData.user?.licenseKey;
              setPurchasedKey(activeKey);
              setPaymentSuccess(true);
              setLicenseKey(activeKey);
              
              // Sync updated user profile locally in state and sessionStorage
              if (isLoggedIn && resData.user) {
                setDevUser(resData.user);
                sessionStorage.setItem('sportz_dev_user', JSON.stringify(resData.user));
              }
            } else {
              alert("Payment validated, but server failed to update subscription status. Contact support.");
            }
          } catch (err) {
            console.error("PayPal capture error:", err);
            alert("PayPal capture encountered an error.");
          }
        },
        onError: (err) => {
          console.error("PayPal Smart Button render error:", err);
        }
      }).render('#paypal-button-container');
    } catch (e) {
      console.error("PayPal buttons rendering failed:", e);
    }
  }, [paypalLoaded, wizardTab, billingCycle, isLoggedIn, devUser]);
  
  // Custom configurations based on widget type
  const [qualifyingCount, setQualifyingCount] = useState(2);
  const [hideGD, setHideGD] = useState(false);
  const [hidePlayed, setHidePlayed] = useState(false);
  
  const [rowLimit, setRowLimit] = useState(5);
  const [hideProgressBar, setHideProgressBar] = useState(false);
  const [defaultMetric, setDefaultMetric] = useState('goals');
  
  const [sportFilter, setSportFilter] = useState(''); // empty for all
  const [showVenue, setShowVenue] = useState(true);

  // Generated code tab ('iframe' or 'react')
  const [codeTab, setCodeTab] = useState('iframe');
  const [copied, setCopied] = useState(false);

  // Core colors sync
  const accentPresets = [
    { color: '#3b82f6', name: 'Electric Blue' },
    { color: '#10b981', name: 'Emerald Cricket' },
    { color: '#ef4444', name: 'Pulse Live Red' },
    { color: '#f59e0b', name: 'Championship Gold' },
    { color: '#8b5cf6', name: 'Imperial Purple' }
  ];

  // Dynamic config object passed to widget preview
  const getConfigObject = () => {
    const config = {};
    if (widgetType === 'standings') {
      config.qualifyingCount = Number(qualifyingCount);
      config.hideGD = hideGD;
      config.hidePlayed = hidePlayed;
    } else if (widgetType === 'topscorers') {
      config.limit = Number(rowLimit);
      config.hideProgressBar = hideProgressBar;
      config.defaultMetric = defaultMetric;
    } else if (widgetType === 'livescores') {
      config.limit = Number(rowLimit);
      if (sportFilter) config.sportFilter = sportFilter;
    } else if (widgetType === 'fixtures') {
      config.showVenue = showVenue;
    }
    return config;
  };

  // Dynamic code outputs
  const getEmbedUrl = () => {
    const baseUrl = window.location.origin;
    let url = `${baseUrl}/?embed=true&type=${widgetType}&theme=${theme}&accent=${encodeURIComponent(accent)}&font=${font}&borders=${borders}`;
    
    if (licenseKey.trim() !== '') {
      url += `&licenseKey=${encodeURIComponent(licenseKey.trim())}`;
    }

    // Add additional config tags
    const config = getConfigObject();
    Object.keys(config).forEach(k => {
      url += `&${k}=${encodeURIComponent(config[k])}`;
    });
    
    return url;
  };

  const getIframeCode = () => {
    const embedUrl = getEmbedUrl();
    const height = widgetType === 'bracket' ? '540' : widgetType === 'matchcentre' ? '650' : '500';
    return `<iframe src="${embedUrl}" width="100%" height="${height}" style="border:none; border-radius: ${borders === 'rounded' ? '16px' : borders === 'glass' ? '24px' : '0px'}; box-shadow: 0 8px 32px rgba(0,0,0,0.05);" allowtransparency="true" scrolling="auto"></iframe>`;
  };

  const getReactCode = () => {
    const config = getConfigObject();
    const configStr = Object.keys(config).length > 0 
      ? `\n  config={${JSON.stringify(config, null, 2).replace(/\n/g, '\n  ')}}` 
      : '';
    const licenseKeyStr = licenseKey.trim() !== ''
      ? `\n  licenseKey="${licenseKey.trim()}"`
      : '';
    return `import { SportZWidget } from 'sportz-premium-live-widgets';\nimport 'sportz-premium-live-widgets/dist-lib/sportz-premium-live-widgets.css';\n\n// Render anywhere inside your app\n<SportZWidget\n  type="${widgetType}"\n  theme="${theme}"\n  accent="${accent}"\n  font="${font}"\n  borders="${borders}"${licenseKeyStr}${configStr}\n/>`;
  };

  // Copy trigger
  const handleCopy = () => {
    const code = codeTab === 'iframe' ? getIframeCode() : getReactCode();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <span style={{ fontSize: '1.8rem', animation: 'pulse 2.5s infinite' }}>🧩</span>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Live Widget Builder & Configurator</h2>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Create widgets without code. Embed on any website.
            </span>
          </div>
        </div>
        
        {/* AdSense slot highlight */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-cricket)' }}>
          <Sparkles size={14} />
          <span>REAL-TIME PREVIEW SANDBOX</span>
        </div>
      </div>

      {/* Wizard Sub-tab Pill Toggles */}
      <div className="glass-panel" style={{ padding: '6px', display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.35)', borderRadius: '12px' }}>
        <button
          onClick={() => setWizardTab('builder')}
          style={{
            flex: 1,
            padding: '8px 0',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.75rem',
            backgroundColor: wizardTab === 'builder' ? 'white' : 'transparent',
            color: wizardTab === 'builder' ? 'var(--color-football)' : 'var(--text-secondary)',
            boxShadow: wizardTab === 'builder' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          🔧 Widget Builder Sandbox
        </button>
        <button
          onClick={() => setWizardTab('pricing')}
          style={{
            flex: 1,
            padding: '8px 0',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.75rem',
            backgroundColor: wizardTab === 'pricing' ? 'white' : 'transparent',
            color: wizardTab === 'pricing' ? 'var(--color-football)' : 'var(--text-secondary)',
            boxShadow: wizardTab === 'pricing' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          💳 Go Premium & Billing
        </button>
      </div>

      {/* 2. PRICING & SUBSCRIPTION TAB SHEET */}
      {wizardTab === 'pricing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Billing Cycle Selector Switch */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.4)',
            padding: '10px 20px',
            borderRadius: '12px',
            width: 'fit-content',
            margin: '0 auto',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: billingCycle === 'monthly' ? 'var(--color-football)' : 'var(--text-secondary)', transition: 'color 0.2s' }}>
              📅 Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              style={{
                width: '44px',
                height: '22px',
                borderRadius: '11px',
                background: 'rgba(79, 70, 229, 0.15)',
                border: '1.5px solid rgba(79, 70, 229, 0.35)',
                position: 'relative',
                cursor: 'pointer',
                padding: 0,
                outline: 'none',
                transition: 'background 0.2s'
              }}
            >
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: 'var(--color-football)',
                position: 'absolute',
                top: '2px',
                left: billingCycle === 'yearly' ? '24px' : '4px',
                transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: billingCycle === 'yearly' ? 'var(--color-football)' : 'var(--text-secondary)', transition: 'color 0.2s' }}>
                🏆 Yearly Billing
              </span>
              <span style={{
                fontSize: '0.55rem',
                fontWeight: 900,
                background: 'var(--color-gold)',
                color: '#78350f',
                padding: '2px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                animation: 'pulse 2s infinite'
              }}>Save 30%!</span>
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '20px',
            alignItems: 'start'
          }} className="pricing-split">
            
            {/* FREE TIER CARD */}
            <div className="glass-panel" style={{
              padding: '24px',
              background: 'white',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              border: '1px solid rgba(0,0,0,0.06)'
            }}>
              <div>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Free Tier Plan</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>Standard Widget</h3>
                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>Ad-supported widget model</span>
              </div>
              
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                €0<span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/forever</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>✓ Access to all 6 tournament widgets</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>✓ Standard customization styling presets</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>✗ Requires Google AdSense ads to be active</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>✗ Ad impressions and clicks go to SportZ</div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <button
                  onClick={() => setWizardTab('builder')}
                  className="glass-btn"
                  style={{ width: '100%', padding: '10px', fontSize: '0.8rem', justifyContent: 'center', fontWeight: 700 }}
                >
                  Configure Free Widgets
                </button>
              </div>
            </div>

            {/* PREMIUM PRO TIER CARD */}
            <div className="glass-panel" style={{
              padding: '24px',
              background: 'linear-gradient(135deg, white 0%, rgba(79, 70, 229, 0.03) 100%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              border: '2px solid rgba(79, 70, 229, 0.35)',
              boxShadow: '0 10px 40px rgba(79, 70, 229, 0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '-32px',
                background: 'var(--color-gold)',
                color: 'white',
                fontSize: '0.55rem',
                fontWeight: 900,
                padding: '4px 32px',
                transform: 'rotate(45deg)',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>POPULAR</div>

              <div>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(79, 70, 229, 0.9)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Premium Pro Plan</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>Ad-Free Integration</h3>
                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>
                  {billingCycle === 'yearly' ? 'Get 12 months for the price of 8! (Save €99/year)' : 'Keep 100% of your website monetization'}
                </span>
              </div>
              
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                {billingCycle === 'yearly' ? (
                  <>
                    €249<span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/year</span>
                    <span style={{ display: 'block', fontSize: '0.65rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                      Equivalent to €20.75/month (Save €99/year!)
                    </span>
                  </>
                ) : (
                  <>
                    €29<span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/month</span>
                  </>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid rgba(79, 70, 229, 0.1)', paddingTop: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#4f46e5' }}>✓ Remove all Google AdSense elements completely</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>✓ Custom premium active license key generated instantly</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>✓ Unlock advanced configurations & responsive builders</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>✓ Premium dedicated email & SLA server support</div>
              </div>

              {/* Success credentials & Active Key box */}
              {(paymentSuccess && purchasedKey) || (devUser && devUser.status === 'pro') ? (
                <div className="glass-panel" style={{
                  padding: '16px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1.5px dashed rgba(16, 185, 129, 0.45)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: '10px'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🎉 PREMIUM LICENSE KEY ACTIVE
                  </div>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.3' }}>
                    Your subscription status is <strong>Active</strong>. All widget embeds registered with this key will render 100% ad-free!
                  </p>
                  
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                    <code style={{
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.06)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      flex: 1,
                      textAlign: 'center',
                      fontFamily: 'Consolas, monospace',
                      letterSpacing: '0.5px'
                    }}>{purchasedKey || (devUser && devUser.licenseKey)}</code>
                    
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(purchasedKey || (devUser && devUser.licenseKey));
                        alert("License key copied! Paste it in the SaaS License Key field in step 3 to test!");
                      }}
                      className="glass-btn"
                      style={{ padding: '6px 10px', fontSize: '0.7rem', fontWeight: 700, borderColor: '#10b981', color: '#10b981' }}
                    >
                      Copy Key
                    </button>
                  </div>

                  {/* Profile Details segment */}
                  {devUser && (
                    <div style={{ borderTop: '1.5px solid rgba(16, 185, 129, 0.15)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.65rem', textAlign: 'left' }}>
                      <span style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Subscriber Profile Details:
                      </span>
                      <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span>👤 <strong>Name:</strong> {devUser.name}</span>
                        <span>✉️ <strong>Email:</strong> {devUser.email}</span>
                        <span>📍 <strong>Billing Address:</strong> {devUser.address || 'Not specified'}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : isLoggedIn ? (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>PAY WITH SECURE PAYPAL SMART BUTTONS</label>
                  {!paypalLoaded ? (
                    <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '10px' }}>
                      Loading PayPal Checkout gateway...
                    </div>
                  ) : null}
                  <div id="paypal-button-container"></div>
                </div>
              ) : (
                <div style={{
                  padding: '16px',
                  background: 'rgba(239, 68, 68, 0.04)',
                  border: '1.5px dashed rgba(239, 68, 68, 0.35)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: '10px'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ⚠️ AUTHENTICATION REQUIRED
                  </div>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                    You must sign in or register a Developer Account before subscribing. This ensures your premium license key is linked to your billing profile permanently.
                  </p>
                  <button
                    onClick={() => {
                      if (setMainView) setMainView('devportal');
                    }}
                    className="glass-btn btn-football"
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      justifyContent: 'center',
                      borderColor: 'var(--color-football)',
                      color: 'white'
                    }}
                  >
                    👤 Developer Login
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 1. BUILDER TAB SHEET */}
      {wizardTab === 'builder' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(0, 1.8fr)',
          gap: '20px',
          alignItems: 'start'
        }} className="wizard-split">
        
        {/* LEFT COLUMN: 3-STEP SETUP PANEL */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(255,255,255,0.35)' }}>
          
          {/* STEP 1: WIDGET TYPE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layout size={15} style={{ color: 'var(--color-football)' }} />
              STEP 1: SELECT CATEGORY TYPE
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {[
                { id: 'standings', label: 'Standings', icon: <Trophy size={16} />, color: 'var(--color-gold)' },
                { id: 'topscorers', label: 'Top Scorers', icon: <TrendingUp size={16} />, color: 'var(--color-football)' },
                { id: 'livescores', label: 'Live Scores', icon: <Activity size={16} />, color: 'var(--color-live)' },
                { id: 'fixtures', label: 'Fixtures', icon: <Calendar size={16} />, color: 'var(--color-cricket)' },
                { id: 'bracket', label: 'Bracket Tree', icon: <GitCommit size={16} />, color: 'var(--color-football)' },
                { id: 'matchcentre', label: 'Match Centre', icon: <Tv size={16} />, color: 'var(--color-live)' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setWidgetType(item.id)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '12px',
                    border: widgetType === item.id ? `2px solid ${item.color}` : '1.5px solid rgba(255,255,255,0.6)',
                    background: widgetType === item.id ? 'white' : 'rgba(255,255,255,0.2)',
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: widgetType === item.id ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'
                  }}
                  className="wizard-card-btn"
                >
                  <span style={{ color: item.color }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: APPEARANCE STYLE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '16px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Palette size={15} style={{ color: 'var(--color-football)' }} />
              STEP 2: CUSTOMIZE APPEARANCE
            </h3>

            {/* Themes presets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>THEME PRESETS</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {[
                  { id: 'glass', label: '💎 Crystal Glass' },
                  { id: 'dark', label: '🌑 Obsidian Dark' },
                  { id: 'light', label: '❄️ Pristine Light' },
                  { id: 'gold', label: '👑 Championship Gold' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: theme === t.id ? '1.5px solid var(--text-primary)' : '1px solid rgba(0,0,0,0.06)',
                      background: theme === t.id ? 'white' : 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>ACCENT COLOR</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {accentPresets.map(preset => (
                  <button
                    key={preset.color}
                    onClick={() => setAccent(preset.color)}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: preset.color,
                      border: accent === preset.color ? '2.5px solid var(--text-primary)' : '1px solid rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                    title={preset.name}
                  />
                ))}
                
                {/* Custom Color Input */}
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  style={{
                    width: '24px',
                    height: '24px',
                    border: 'none',
                    borderRadius: '4px',
                    background: 'transparent',
                    cursor: 'pointer'
                  }}
                  title="Custom Accent Color"
                />
              </div>
            </div>

            {/* Font and border controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>FONT FAMILY</label>
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.5)',
                    border: '1.5px solid rgba(0,0,0,0.06)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  <option value="Outfit">Outfit (Display)</option>
                  <option value="Inter">Inter (Sleek)</option>
                  <option value="Roboto">Roboto (Classic)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>CONTAINER BORDERS</label>
                <select
                  value={borders}
                  onChange={(e) => setBorders(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.5)',
                    border: '1.5px solid rgba(0,0,0,0.06)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  <option value="rounded">Rounded Corners</option>
                  <option value="glass">Soft Glass Curves</option>
                  <option value="sharp">Sharp Squares</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 3: CONTENT OPTIONS CONFIGURATIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '16px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders size={15} style={{ color: 'var(--color-football)' }} />
              STEP 3: CONFIG CONTENT OPTIONS
            </h3>

            {/* Standings configurations */}
            {widgetType === 'standings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>QUALIFYING HIGHLIGHT COUNT</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={qualifyingCount}
                    onChange={(e) => setQualifyingCount(e.target.value)}
                    style={{
                      width: '50px',
                      padding: '4px 6px',
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textAlign: 'center'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input type="checkbox" checked={hideGD} onChange={(e) => setHideGD(e.target.checked)} />
                    Hide GD Column
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input type="checkbox" checked={hidePlayed} onChange={(e) => setHidePlayed(e.target.checked)} />
                    Hide Played Column
                  </label>
                </div>
              </div>
            )}

            {/* Topscorers / Livescores configurations */}
            {(widgetType === 'topscorers' || widgetType === 'livescores') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>MAX ITEMS SHOWN</label>
                  <select
                    value={rowLimit}
                    onChange={(e) => setRowLimit(e.target.value)}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    <option value="3">3 Rows</option>
                    <option value="5">5 Rows</option>
                    <option value="10">10 Rows</option>
                    <option value="15">15 Rows</option>
                  </select>
                </div>

                {widgetType === 'topscorers' && (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>
                      <input type="checkbox" checked={hideProgressBar} onChange={(e) => setHideProgressBar(e.target.checked)} />
                      Hide Goal Bars
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>DEFAULT:</span>
                      <select
                        value={defaultMetric}
                        onChange={(e) => setDefaultMetric(e.target.value)}
                        style={{ border: 'none', background: 'transparent', fontSize: '0.7rem', fontWeight: 700, color: accent }}
                      >
                        <option value="goals">Goals</option>
                        <option value="assists">Assists</option>
                        <option value="yellowCards">Yellows</option>
                      </select>
                    </div>
                  </div>
                )}

                {widgetType === 'livescores' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>FILTER SPORT:</span>
                    <select
                      value={sportFilter}
                      onChange={(e) => setSportFilter(e.target.value)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '6px',
                        padding: '2px 6px',
                        fontSize: '0.7rem',
                        fontWeight: 700
                      }}
                    >
                      <option value="">All Sports</option>
                      <option value="football">Football Only</option>
                      <option value="cricket">Cricket Only</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Fixtures configurations */}
            {widgetType === 'fixtures' && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>
                <input type="checkbox" checked={showVenue} onChange={(e) => setShowVenue(e.target.checked)} />
                Show Venue Details
              </label>
            )}

            {/* Bracket/MatchCentre helper */}
            {(widgetType === 'bracket' || widgetType === 'matchcentre') && (
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, fontStyle: 'italic' }}>
                {widgetType === 'bracket' ? '💡 Full knockout bracket rendering from Round of 16 to the Grand Final is enabled automatically.' : '💡 Rich match detailing including stats comparisons, timeline feeds, lineups lists, and commentaries is active.'}
              </span>
            )}

            {/* SaaS License Key Input Option */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '12px', marginTop: '4px' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                🔑 SAAS LICENSE KEY (OPTIONAL)
              </label>
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="e.g. SZ-PRO-2026-GOLD"
                className="glass-input"
                style={{ padding: '6px 10px', fontSize: '0.75rem', fontWeight: 600 }}
              />
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Enter premium key to hide ads. Try: <code style={{ background: 'rgba(0,0,0,0.04)', padding: '1px 4px', borderRadius: '3px' }}>SZ-PRO-2026-GOLD</code>
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE WIDGET PREVIEW SANDBOX */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-panel" style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '8px',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.01)',
            minHeight: '440px',
            display: 'flex',
            alignItems: 'stretch',
            overflowX: 'auto',
            maxWidth: '100%'
          }}>
            <SportZWidget
              type={widgetType}
              theme={theme}
              accent={accent}
              font={font}
              borders={borders}
              config={getConfigObject()}
              apiHost={apiHost}
              licenseKey={licenseKey.trim() !== '' ? licenseKey.trim() : null}
            />
          </div>

        </div>
      </div>
      )}

      {/* BOTTOM HUB: CODE GENERATOR INSPECTOR */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'rgba(255, 255, 255, 0.45)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '10px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={16} style={{ color: 'var(--color-football)' }} />
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>Copy Integration Code</h3>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Paste directly into your HTML pages or load inside your React project</span>
            </div>
          </div>

          {/* Code type tabs */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.05)', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => setCodeTab('iframe')}
              style={{
                border: 'none',
                padding: '4px 12px',
                fontSize: '0.7rem',
                fontWeight: 700,
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: codeTab === 'iframe' ? 'white' : 'transparent',
                color: codeTab === 'iframe' ? accent : 'var(--text-muted)'
              }}
            >
              🌐 HTML Iframe Embed
            </button>
            <button
              onClick={() => setCodeTab('react')}
              style={{
                border: 'none',
                padding: '4px 12px',
                fontSize: '0.7rem',
                fontWeight: 700,
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: codeTab === 'react' ? 'white' : 'transparent',
                color: codeTab === 'react' ? accent : 'var(--text-muted)'
              }}
            >
              ⚛️ React Component
            </button>
          </div>
        </div>

        {/* Dynamic code snippet pre-box */}
        <div style={{ position: 'relative' }}>
          <pre style={{
            background: '#0f172a',
            color: '#38bdf8',
            padding: '16px 20px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            lineHeight: '1.5',
            overflowX: 'auto',
            border: '1px solid rgba(255,255,255,0.05)',
            margin: 0,
            fontFamily: 'Consolas, Monaco, monospace',
            minHeight: '60px',
            maxHeight: '180px'
          }}>
            <code>{codeTab === 'iframe' ? getIframeCode() : getReactCode()}</code>
          </pre>

          {/* Copy float action */}
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: copied ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'white',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(4px)'
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? 'Copied! ✓' : 'Copy Code'}</span>
          </button>
        </div>
      </div>
      
    </div>
  );
}
