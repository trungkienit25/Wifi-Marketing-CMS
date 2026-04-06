import { memo } from 'preact/compat';

interface StickyFooterProps {
  countdown: number;
  onContinue: () => void;
}

export function StickyFooter({ countdown, onContinue }: StickyFooterProps) {
  return (
    <footer style={{ 
      padding: '40px 20px 60px', 
      background: 'transparent', 
      borderTop: '1px solid rgba(226, 232, 240, 0.8)',
      marginTop: '20px'
    }}>
      {/* 1. COUNTDOWN STATUS */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '700', letterSpacing: '0.02em' }}>
          ĐANG KẾT NỐI INTERNET • TỰ ĐỘNG TRONG <span style={{ color: '#0f172a', fontWeight: '900' }}>{countdown}S</span>
        </p>
      </div>

      {/* 2. PRIMARY ACTION (Luxury Gold) */}
      <button 
        onClick={onContinue}
        className="cta-button-premium"
        style={{ 
          width: '100%', 
          background: '#0f172a', // Dark base
          color: '#fbbf24', // Gold text
          border: 'none', 
          padding: '18px', 
          borderRadius: '16px', 
          fontWeight: '900', 
          fontSize: '16px', 
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.2)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <span>XEM NGAY ƯU ĐÃI</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>

      {/* 3. OPTIONAL SUBTEXT */}
      <p style={{ 
        textAlign: 'center', 
        marginTop: '12px', 
        fontSize: '10px', 
        color: '#94a3b8', 
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        Cung cấp bởi MikroTik WiFi Marketing Engine
      </p>
    </footer>
  );
}
