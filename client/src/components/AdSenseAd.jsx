import React, { useEffect, useState } from 'react';

/**
 * Premium Google AdSense Component
 * 
 * Renders a responsive Google AdSense ad unit.
 * 
 * Features:
 * - Dynamic AdSense script injection using Vite environment variables.
 * - Graceful fallback: If the AdSense script fails, gets blocked by an ad-blocker, 
 *   or if no Publisher ID is set, it displays a gorgeous, premium, glassmorphism 
 *   ad placeholder in development/preview mode instead of breaking.
 * - Supports custom styling, slot IDs, and layout configurations.
 */
export default function AdSenseAd({
  slot = "1234567890", // Example slot ID (replace with your Google AdSense ad unit slot ID)
  client = null,       // Configurable dynamic client ID
  format = "auto",
  responsive = "true",
  style = { display: 'block' },
  className = "",
  height = "120px",
  licenseKey = null
}) {
  const [adBlocked, setAdBlocked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [dynamicClient, setDynamicClient] = useState(null);

  // Fetch settings from server on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const apiHost = import.meta.env.VITE_API_HOST || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin);
        const url = `${apiHost}/api/settings${licenseKey ? `?licenseKey=${encodeURIComponent(licenseKey)}` : ''}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setAdsEnabled(data.adsEnabled);
          if (data.adClient) {
            setDynamicClient(data.adClient);
          }
        }
      } catch (err) {
        console.warn("Dynamic settings fetch failed:", err);
      }
    };
    loadSettings();
  }, [licenseKey]);

  // Retrieve Publisher ID from passed prop, dynamic admin settings, environment variable or use a fallback placeholder
  const publisherId = client || dynamicClient || import.meta.env.VITE_ADSENSE_PUB_ID || "";
  const isDev = import.meta.env.DEV || !publisherId;

  useEffect(() => {
    if (!publisherId) {
      // In development or when publisherId is missing, show preview placeholder
      setIsLoaded(true);
      return;
    }

    // Try to load Google AdSense script dynamically if not already loaded
    const scriptId = 'google-adsense-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        console.log("Google AdSense script loaded successfully.");
        initializeAd();
      };

      script.onerror = () => {
        console.warn("Failed to load Google AdSense. Script might be blocked by an ad-blocker.");
        setAdBlocked(true);
      };

      document.head.appendChild(script);
    } else {
      // Script is already in DOM, initialize ad unit
      initializeAd();
    }
  }, [publisherId, slot]);

  const initializeAd = () => {
    try {
      // Wait for DOM to register the ins element, then push
      setTimeout(() => {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsLoaded(true);
        } else {
          setAdBlocked(true);
        }
      }, 100);
    } catch (e) {
      console.warn("Google AdSense initialization error:", e);
      setAdBlocked(true);
    }
  };

  if (!adsEnabled) return null;

  // Render Premium Ad Preview / Mock when no Publisher ID is provided, in dev mode, or if blocked
  if (isDev || adBlocked) {
    return (
      <div 
        className={`glass-panel ${className}`} 
        style={{
          minHeight: height,
          background: 'rgba(255, 255, 255, 0.4)',
          border: '1px dashed rgba(79, 70, 229, 0.4)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          gap: '6px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          margin: '10px 0',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Subtle decorative glowing spot */}
        <div style={{
          position: 'absolute',
          width: '80px',
          height: '80px',
          background: adBlocked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(79, 70, 229, 0.15)',
          borderRadius: '50%',
          filter: 'blur(20px)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0
        }} />

        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            fontSize: '0.8rem', 
            fontWeight: 800, 
            letterSpacing: '1.5px',
            color: adBlocked ? 'var(--color-live)' : 'rgba(79, 70, 229, 0.85)',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '4px'
          }}>
            <span>💰</span> 
            <span>{adBlocked ? 'Ad Blocker Active' : 'AdSense Placeholder'}</span>
          </div>
          
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 4px 0', maxWidth: '380px', lineHeight: '1.3' }}>
            {adBlocked 
              ? "We detected an ad blocker. Ads would appear here for your users in production." 
              : "This slot is ready for Google AdSense! Set VITE_ADSENSE_PUB_ID in your env config to go live."
            }
          </p>

          <div style={{ display: 'flex', gap: '8px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            <span><strong>Client:</strong> {publisherId || "ca-pub-XXXXXXXXXXXX"}</span>
            <span>•</span>
            <span><strong>Slot:</strong> {slot}</span>
          </div>
        </div>
      </div>
    );
  }

  // Render actual Google AdSense DOM elements in Production
  return (
    <div 
      className={`adsense-wrapper ${className}`} 
      style={{ margin: '15px 0', overflow: 'hidden', textAlign: 'center', minHeight: height }}
    >
      <ins 
        className="adsbygoogle"
        style={style}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
