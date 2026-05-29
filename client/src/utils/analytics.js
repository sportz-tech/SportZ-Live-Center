/**
 * Premium Google Analytics 4 (GA4) Tracking Utility
 * 
 * Features:
 * - Dynamic Script Injection: Loads the GA4 tag dynamically only if a Measurement ID (G-XXXXXXXXXX) is provided.
 * - Single-Page App Friendly: Exposes programmatic page view and custom event tracking.
 * - Standardized Events: Built-in hooks to log votes, match selections, and sport toggle analytics.
 */

// Initialize Google Analytics
export const initGA = (measurementId) => {
  if (!measurementId) {
    console.log("📊 Google Analytics: Measurement ID missing. Tracking disabled in dev/preview.");
    return;
  }

  // Check if script is already injected
  const scriptId = 'google-analytics-gtag';
  if (document.getElementById(scriptId)) return;

  // 1. Inject Gtag script tag
  const script = document.createElement('script');
  script.id = scriptId;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  // 2. Setup gtag function globally
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  
  // 3. Configure defaults
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: true, // Trigger initial page view
    page_path: window.location.pathname
  });

  console.log(`📊 Google Analytics initialized successfully with ID: ${measurementId}`);
};

// Track Page Views (highly useful when users change views/tabs in single-page apps)
export const trackPageView = (pagePath, title = "") => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: title || document.title
  });
};

// Track Custom Engagement Events (e.g. casting votes, selecting matches)
export const trackEvent = (action, category, label = "", value = null) => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId || !window.gtag) return;

  const eventParams = {
    event_category: category,
    event_label: label
  };

  if (value !== null) {
    eventParams.value = value;
  }

  window.gtag('event', action, eventParams);
};
