import { memo } from 'preact/compat';
import { ApiService } from '../ApiService';

/**
 * COMPONENT: Optimized Ad Card (Memoized to prevent Micro-CPU overhead)
 * Implements the Premium Vertical Feed pattern.
 */
interface AdCardProps { ad: any; mac: string; fp: string; index: number; }
const AdCard = memo(({ ad, mac, fp, index }: AdCardProps) => {
  const brandName = ad.brandId || 'Partner Brand';
  const initial = brandName.charAt(0).toUpperCase();
  const bannerUrl = ad.bannerUrl || 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=2000&auto=format&fit=crop';

  return (
    <div 
      className="ad-card-native"
      style={{ 
        background: 'white', 
        borderRadius: '20px', // More rounded for modern feel
        padding: '16px', 
        marginBottom: '16px', 
        display: 'flex', 
        alignItems: 'center',
        gap: '16px', 
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
      }}
      onClick={() => {
        ApiService.trackEvent({ type: 'click', adId: ad.id, mac, fp, brandId: ad.brandId });
        if (ad.redirectUrl?.startsWith('http')) window.open(ad.redirectUrl, '_blank');
      }}
    >
      {/* BRAND THUMBNAIL */}
      <div style={{ position: 'relative', width: '76px', height: '76px', flexShrink: 0 }}>
        <img 
          src={bannerUrl} 
          style={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: '16px', 
            objectFit: 'cover',
            background: '#f8fafc' 
          }} 
          alt={brandName} 
        />
        <div style={{ 
          position: 'absolute', 
          top: '-6px', 
          left: '-6px', 
          background: '#0f172a', 
          color: '#fbbf24', 
          fontSize: '9px', 
          padding: '4px 8px', 
          borderRadius: '8px', 
          fontWeight: '900',
          letterSpacing: '0.05em',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          PARTNER
        </div>
      </div>

      {/* BRAND INFO */}
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontWeight: '800', 
          fontSize: '16px', 
          color: '#0f172a', 
          marginBottom: '2px',
          letterSpacing: '-0.01em'
        }}>
          {brandName}
        </div>
        <div style={{ 
          fontSize: '13px', 
          color: '#64748b', 
          lineHeight: '1.4',
          fontWeight: '500'
        }}>
          Ưu đãi đặc quyền dành cho khách hàng {brandName}
        </div>
      </div>

      {/* ACTION ICON */}
      <div style={{ 
        width: '36px',
        height: '36px',
        background: '#f8fafc',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8' 
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  );
});

interface PartnerFeedProps {
  ads: any[];
  loading: boolean;
  mac: string;
  fp: string;
}

export const PartnerFeed = memo(({ ads, loading, mac, fp }: PartnerFeedProps) => (
  <section className="partner-feed" style={{ marginTop: '32px' }}>
    <h3 style={{ 
        fontSize: '12px', 
        fontWeight: '900', 
        color: '#94a3b8', 
        textTransform: 'uppercase', 
        letterSpacing: '0.15em', 
        marginBottom: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px' 
    }}>
      THƯƠNG HIỆU ĐỐI TÁC
      <span style={{ height: '1px', flex: 1, background: '#f1f5f9' }}></span>
    </h3>
    
    <div className="vertical-feed">
      {ads && ads.length > 0 ? (
        ads.map((ad: any, i: number) => (
          <AdCard key={ad.id || i} ad={ad} mac={mac} fp={fp} index={i} />
        ))
      ) : (
        /* FALLBACK MOCK PARTNERS (For Zero-Config or Network Delay) */
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <AdCard 
              ad={{ brandId: 'Bancông Cafe', bannerUrl: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&w=300&q=80' }} 
              mac={mac} fp={fp} index={0} 
            />
            <AdCard 
              ad={{ brandId: 'Everbloom', bannerUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=300&q=80' }} 
              mac={mac} fp={fp} index={1} 
            />
        </div>
      )}
    </div>
  </section>
));
