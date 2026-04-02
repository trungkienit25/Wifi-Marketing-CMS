import { useState } from 'react';
import './index.css';

interface PartnerAd {
  adId: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  weight: number;
}

interface BrandConfig {
  brandId: string;
  brandName: string;
  layoutType: 'Vertical' | 'Z-Pattern' | 'NativeFeed';
  primaryBanner: {
    originalUrl: string;
    optimizedUrl: string;
  };
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  partnerAds: PartnerAd[];
}

const DEFAULT_CONFIG: BrandConfig = {
  brandId: 'lalot_restroom',
  brandName: 'Lá Lốt Restaurant',
  layoutType: 'Vertical',
  primaryBanner: {
    originalUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800',
    optimizedUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800'
  },
  theme: {
    primaryColor: '#6366f1',
    backgroundColor: '#ffffff',
    textColor: '#1e293b'
  },
  partnerAds: [
    {
      adId: 'ad1',
      title: 'Summer Collection - 20% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=400',
      targetUrl: 'https://example.com/summer',
      weight: 10
    },
    {
      adId: 'ad2',
      title: 'Member Exclusive Lounge',
      imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d7681d4?q=80&w=400',
      targetUrl: 'https://example.com/lounge',
      weight: 5
    }
  ]
};

function App() {
  const [config, setConfig] = useState<BrandConfig>(DEFAULT_CONFIG);
  const [publishing, setPublishing] = useState(false);

  const handleUpdate = (field: string, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const addAd = () => {
    const newAd: PartnerAd = {
      adId: `ad${Date.now()}`,
      title: 'New Advertisement',
      imageUrl: 'https://via.placeholder.com/400x300?text=Ad+Banner',
      targetUrl: 'https://example.com',
      weight: 1
    };
    setConfig(prev => ({ ...prev, partnerAds: [...prev.partnerAds, newAd] }));
  };

  const publishConfig = async () => {
    setPublishing(true);
    try {
      // 1. Update Backend config
      const resUpdate = await fetch('http://localhost:3000/api/v1/brands/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      if (!resUpdate.ok) throw new Error('Update failed');

      // 2. Trigger Cache Invalidation
      const resCache = await fetch('http://localhost:3000/api/v1/brands/invalidate-cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: config.brandId })
      });
      
      if (resCache.status === 200) {
        alert('🚀 Successfully published and cache invalidated!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to publish. Check console.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="cms-container">
      {/* 🛠 Builder Section */}
      <div className="builder-panel">
        <h1 className="builder-title">
          <span>Success Page Builder</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MKT-CMS v1.0</span>
        </h1>

        <div className="form-group">
          <label className="form-label">Brand Identity</label>
          <input 
            className="form-input" 
            value={config.brandName} 
            onChange={e => handleUpdate('brandName', e.target.value)} 
            placeholder="Restaurant/Booth Name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Layout Strategy</label>
          <select 
            className="form-select" 
            value={config.layoutType} 
            onChange={e => handleUpdate('layoutType', e.target.value)}
          >
            <option value="Vertical">Vertical Feed (Social Style)</option>
            <option value="Z-Pattern">Z-Pattern (High Conversion)</option>
            <option value="NativeFeed">Native Carousel (Premium)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Primary Banner URL (Drive/Original)</label>
          <input 
            className="form-input" 
            value={config.primaryBanner.originalUrl} 
            onChange={e => setConfig({ ...config, primaryBanner: { ...config.primaryBanner, originalUrl: e.target.value } })}
            placeholder="Direct link to primary advertisement banner"
          />
        </div>

        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Partner Advertisements</label>
            <button 
              onClick={addAd}
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem', background: 'var(--primary)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
            >
              + Add Ad
            </button>
          </div>
          
          {config.partnerAds.map((ad, idx) => (
            <div key={ad.adId} className="ad-card" style={{ position: 'relative' }}>
              <img src={ad.imageUrl} alt={ad.title} className="ad-thumb" />
              <div className="ad-info">
                <div className="ad-title">{ad.title}</div>
                <div className="ad-priority">Priority Weight: {ad.weight}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>#{idx + 1}</div>
                <button 
                  onClick={() => setConfig(prev => ({ ...prev, partnerAds: prev.partnerAds.filter(a => a.adId !== ad.adId) }))}
                  style={{ background: 'transparent', border: 'none', color: '#f87171', fontSize: '0.7rem', cursor: 'pointer', padding: 0 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-publish" onClick={publishConfig} disabled={publishing}>
          {publishing ? 'Publishing...' : 'Publish & Sync Store'}
        </button>
      </div>

      {/* 📱 Real-time Mobile Preview */}
      <div className="preview-panel">
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0 }}>Live Device Preview</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mocking MAC: 1A:2B:3C:4D:5E:6F</p>
        </div>

        <div className="device-frame">
          <div className="device-screen" style={{ backgroundColor: config.theme.backgroundColor }}>
            {/* Simulated Success Page Content */}
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div style={{ width: '32px', height: '32px', background: config.theme.primaryColor, borderRadius: '50%' }} />
                <h4 style={{ margin: 0, color: config.theme.textColor }}>{config.brandName}</h4>
              </div>

              <img 
                src={config.primaryBanner.originalUrl} 
                style={{ width: '100%', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} 
                alt="Banner" 
              />

              <div style={{ color: config.theme.textColor, fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>
                Recommended for you
              </div>

              {/* Z-Pattern, Vertical or Horizontal Logic Simulation */}
              <div style={
                config.layoutType === 'Vertical' 
                  ? { display: 'flex', flexDirection: 'column', gap: '15px' }
                  : config.layoutType === 'NativeFeed'
                  ? { display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '10px' }
                  : { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }
              }>
                {config.partnerAds.map(ad => (
                  <div key={ad.adId} style={{ 
                    background: '#f8fafc', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    border: '1px solid #e2e8f0',
                    minWidth: config.layoutType === 'NativeFeed' ? '180px' : 'auto',
                    display: config.layoutType === 'Vertical' ? 'flex' : 'block'
                  }}>
                    <img src={ad.imageUrl} style={{ 
                      width: config.layoutType === 'Vertical' ? '100px' : '100%', 
                      height: config.layoutType === 'Vertical' ? 'auto' : '100px', 
                      objectFit: 'cover' 
                    }} alt="" />
                    <div style={{ padding: '10px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>{ad.title}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>Sponsored</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ 
                marginTop: '30px', 
                padding: '15px', 
                background: config.theme.primaryColor, 
                color: 'white', 
                borderRadius: '8px', 
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                CONTINUE TO INTERNET
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
