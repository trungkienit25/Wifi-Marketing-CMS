
export function SkeletonAd() {
  return (
    <div 
      className="skeleton-ad" 
      style={{ 
        background: '#f1f5f9', 
        borderRadius: '8px', 
        padding: '16px', 
        marginBottom: '15px',
        animation: 'pulse 1.5s infinite ease-in-out',
        display: 'flex',
        gap: '12px'
      }}
    >
      <div style={{ width: '80px', height: '80px', background: '#e2e8f0', borderRadius: '6px' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
        <div style={{ width: '70%', height: '14px', background: '#e2e8f0', borderRadius: '4px' }} />
        <div style={{ width: '40%', height: '10px', background: '#e2e8f0', borderRadius: '4px' }} />
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
