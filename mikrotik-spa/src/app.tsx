import { useState, useEffect } from 'preact/hooks';
import './app.css';

// Type definition for RouterOS Context
const context = (window as any).MIKROTIK_CONTEXT || {
  mac: '1A:2B:3C:4D:5E:6F', // Mock MAC
  linkOrig: 'https://google.com',
  isLoggedIn: true
};

interface AdContent {
  meta: {
    brandName: string;
    layout: string;
    theme: {
      primaryColor: string;
      backgroundColor: string;
      textColor: string;
    };
  };
  banner: {
    imageUrl: string;
    proxyUrl: string;
    backupBase64: string;
  };
  ads: Array<{
    adId: string;
    title: string;
    imageUrl: string;
    targetUrl: string;
  }>;
}

export function App() {
  const [data, setData] = useState<AdContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [bannerTier, setBannerTier] = useState(1); // 1: Optimized, 2: Proxy, 3: Base64

  useEffect(() => {
    // 1. Fetch Dynamic Content from CMS Aggregator
    // Using current hostname to identify brand id
    fetch('/api/v1/brands/ad-content')
      .then(r => r.json())
      .then(json => {
        if (json.success) setData(json.data);
      })
      .catch(err => console.error('Cloud API unreachable. Retrying with fallback...'))
      .finally(() => setLoading(false));

    // 2. Initial Tracking Impression
    // No-op if offline
  }, []);

  const handleTrackClick = (adId: string) => {
    fetch('/api/v1/track/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'click',
        adId,
        mac: context.mac,
        // Fingerprint can be added here with a lightweight lib
      })
    }).catch(() => {/* Silent fail on DR */});
  };

  const handleBannerError = () => {
    setBannerTier(prev => prev + 1);
  };

  if (loading) return <div className="loading">Connecting to Secure WiFi...</div>;

  const config = data?.meta || { 
    brandName: 'Hotspot Access', 
    theme: { backgroundColor: '#fff', textColor: '#333', primaryColor: '#007bff' } 
  };

  return (
    <div className="login-container" style={{ backgroundColor: config.theme.backgroundColor, color: config.theme.textColor }}>
      <header className="header" style={{ borderColor: config.theme.primaryColor }}>
        <h2 style={{ margin: 0 }}>{config.brandName}</h2>
        <span className="status-badge">CONNECTED</span>
      </header>

      <main className="content">
        {/* MULTI-TIER BANNER FALLBACK (DR GOAL) */}
        <div className="banner-wrapper">
          {bannerTier === 1 && data?.banner.imageUrl && (
            <img src={data.banner.imageUrl} onError={handleBannerError} className="main-banner" alt="Promotion" />
          )}
          {bannerTier === 2 && data?.banner.proxyUrl && (
            <img src={data.banner.proxyUrl} onError={handleBannerError} className="main-banner" alt="Promotion Fallback" />
          )}
          {(bannerTier === 3 || !data) && (
            <img src={data?.banner.backupBase64 || 'https://via.placeholder.com/800x400?text=Welcome+to+WiFi+Marketing'} className="main-banner" alt="Offline Banner" />
          )}
        </div>

        <div className="ad-grid" style={data?.meta.layout === 'Z-Pattern' ? { display: 'grid', gridTemplateColumns: '1fr 1fr' } : {}}>
          {data?.ads.map(ad => (
            <a 
              key={ad.adId} 
              href={ad.targetUrl} 
              target="_blank" 
              className="ad-item"
              onClick={() => handleTrackClick(ad.adId)}
            >
              <img src={ad.imageUrl} alt={ad.title} />
              <p>{ad.title}</p>
            </a>
          ))}
        </div>

        <button 
          className="btn-continue" 
          style={{ backgroundColor: config.theme.primaryColor }}
          onClick={() => window.location.href = context.linkOrig}
        >
          CONTINUE TO INTERNET
        </button>
      </main>

      <footer className="footer">
        Powered by WiFi Marketing CMS | ID: {context.mac}
      </footer>
    </div>
  );
}
