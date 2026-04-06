import { memo } from 'preact/compat';

interface HeaderProps {
  brandName: string;
  mac?: string;
  ip?: string;
}

export const Header = memo(({ brandName, mac, ip }: HeaderProps) => {
  const displayBrand = brandName || 'Lalot Restaurant';
  const initial = displayBrand.charAt(0).toUpperCase();

  return (
    <header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      position: 'sticky', 
      top: 0, 
      zIndex: 100,
      width: '100%',
      boxSizing: 'border-box', // Đảm bảo padding không làm tràn màn hình
      background: 'rgba(255, 255, 255, 0.9)', 
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      padding: '12px 16px', // Giảm nhẹ padding để cân đối trên mobile
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    }}>
      {/* LEFT: Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          background: '#0f172a', // Dark premium
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: '#fbbf24', // Gold text
          fontSize: '24px',
          fontWeight: '900',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          {initial}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ 
            fontWeight: '800', 
            color: '#0f172a', 
            fontSize: '17px',
            lineHeight: '1.2'
          }}>
            {displayBrand}
          </span>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: '700', 
            color: '#10b981', 
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginTop: '2px'
          }}>
            WIFI CONNECTED
          </span>
        </div>
      </div>

      {/* RIGHT: Technical Metadata (The Tech Touch) */}
      <div style={{ 
        textAlign: 'right',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
      }}>
        <span style={{ 
          fontSize: '10px', 
          fontWeight: '700', 
          color: '#94a3b8', 
          fontFamily: 'monospace',
          letterSpacing: '0.02em'
        }}>
          {mac || '00:1A:2B:3C:4D:5E'}
        </span>
        <span style={{ 
          fontSize: '10px', 
          fontWeight: '700', 
          color: '#94a3b8', 
          fontFamily: 'monospace'
        }}>
          {ip || '192.168.88.245'}
        </span>
      </div>
    </header>
  );
});
