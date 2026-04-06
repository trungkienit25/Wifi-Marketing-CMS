import { useRef, useEffect } from 'preact/hooks';
import { ApiService } from '../ApiService';

interface InterstitialProps {
  ad: any;
  mac: string;
  fp: string;
}

export function Interstitial({ ad, mac, fp }: InterstitialProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (ad?.id && !tracked.current) {
      ApiService.trackEvent({ 
        type: 'impression', 
        adId: ad.id, 
        mac, 
        fp, 
        brandId: ad.brandId 
      });
      tracked.current = true;
    }
  }, [ad?.id]);

  const bannerUrl = ad?.bannerUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop';
  const brandName = ad?.brandId || 'Lalot Restaurant';

  return (
    <section className="interstitial-zone" style={{
      position: 'relative',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      marginBottom: '24px',
      aspectRatio: '9 / 12',
      background: '#000',
      animation: 'slideIn 0.5s ease-out'
    }}>
      {/* 1. MAIN BANNER */}
      <img 
        src={bannerUrl} 
        alt="Featured Offer"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
        onError={(e) => {
            (e.target as any).src = 'https://drive.google.com/uc?export=view&id=1_X_O-v_QpX7H_G2gX4t_H-Y5U0W_Z1q';
        }}
      />

      {/* 2. GRADIENT OVERLAY (Premium Aesthetic) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '32px 24px'
      }}>
        <h2 style={{
          color: '#fff',
          fontSize: '28px',
          fontWeight: '800',
          lineHeight: '1.2',
          marginBottom: '16px',
          letterSpacing: '-0.02em',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Chào mừng Bạn đến với mạng lưới {brandName}
        </h2>
        
        <button style={{
          width: 'fit-content',
          padding: '12px 28px',
          background: 'rgba(212, 175, 55, 0.95)', // Gold premium 
          color: '#000',
          border: 'none',
          borderRadius: '14px',
          fontWeight: '700',
          fontSize: '15px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          XEM NGAY ƯU ĐÃI
        </button>
      </div>
    </section>
  );
}
