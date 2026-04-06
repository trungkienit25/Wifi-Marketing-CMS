import { useAloginLogic } from './alogin/useAloginLogic';
import { Header } from './alogin/Header';
import { Interstitial } from './alogin/Interstitial';
import { PartnerFeed } from './alogin/PartnerFeed';
import { StickyFooter } from './alogin/StickyFooter';

interface AloginProps {
  linkOrig: string;
  mac: string;
  brandId?: string;
}

/**
 * ORCHESTRATOR: Unified Alogin View.
 * Follows the Scientific Z-Pattern Layout for maximum ad exposure.
 * Resilience: Multi-tier Disaster Recovery (DR) Integration.
 * Performance: Fully Memoized Architecture for Micro-CPU devices.
 */
export function AloginView({ linkOrig, mac, brandId }: AloginProps) {
  const { data, loading, countdown, fingerprint, handleLinkRedirect } = useAloginLogic(mac, linkOrig, brandId);

  const brandName = data?.meta?.brandName || 'Guest WiFi';
  const mainAd = data?.ads?.[0]; // Interstitial Ad
  const partnerAds = data?.ads?.slice(1) || [];

  return (
    <div className="alogin-container" style={{ 
      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', 
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* 1. TOP HEADER (Z-Pattern Top) */}
      <Header brandName={brandName} />

      <main style={{ padding: '0 20px' }}>
        {/* 2. INTERSTITIAL ZONE (80% Prominence) */}
        <div style={{ marginTop: '20px' }}>
            <Interstitial ad={mainAd} mac={mac} fp={fingerprint} />
        </div>

        {/* 3. VERTICAL FEED (Partner Network) */}
        <PartnerFeed ads={partnerAds} loading={loading} mac={mac} fp={fingerprint} />

        {/* 4. FOOTER (Flow-based Bottom) */}
        <StickyFooter countdown={countdown} onContinue={handleLinkRedirect} />
      </main>

      {/* STYLES: Embedded for Performance & Single-File Bundling */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ad-card-native:hover {
          transform: translateY(-2px);
          border-color: #3b82f6 !important;
        }
        .cta-button-premium:active {
          transform: scale(0.98);
          opacity: 0.95;
        }
      `}</style>
    </div>
  );
}
