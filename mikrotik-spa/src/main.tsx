import { render } from 'preact';
import { useState } from 'preact/hooks';
import { useMikrotik } from './hooks/useMikrotik';
import { AloginView } from './core/AloginView';
import './app.css';

function App() {
  const context = useMikrotik();
  const [mockAuthorized, setMockAuthorized] = useState(false);

  // ROUTING LOGIC: Decide based on authorized state (isLoggedIn)
  // local testing with mockAuthorized toggle
  if (context.isLoggedIn || mockAuthorized) {
    const brandId = import.meta.env.VITE_BRAND || context.hostname || 'default';
    return <AloginView linkOrig={context.linkOrig} mac={context.mac} brandId={brandId} />;
  }

  // ELSE: Render Login View (The entry point for non-authorized users)
  return (
    <div className="login-view-wrapper" style={{ 
      minHeight: '100vh', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      padding: '24px', textAlign: 'center', fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ 
        background: 'white', padding: '40px', borderRadius: '24px', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' 
      }}>
        <h1 style={{ color: '#0369a1', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
          Lá Lốt Restaurant
        </h1>
        <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
          Connect to our high-speed WiFi by completing our premium partner survey.
        </p>
        
        <button 
          style={{ 
            width: '100%', padding: '16px', background: '#0284c7', color: 'white', 
            border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '16px', 
            cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.3)' 
          }}
          onClick={() => {
            console.log('[MikroTik] Simulating Login Authorization...');
            setMockAuthorized(true);
          }}
        >
          CONNECT TO WI-FI
        </button>
        
        <div style={{ marginTop: '24px', fontSize: '11px', color: '#94a3b8', letterSpacing: '0.02em' }}>
          DEVICE MAC: <span style={{ color: '#64748b', fontWeight: '600' }}>{context.mac}</span><br/>
          GATEWAY ID: <span style={{ color: '#64748b', fontWeight: '600' }}>{context.hostname}</span>
        </div>
      </div>
    </div>
  );
}

render(<App />, document.getElementById('app') as HTMLElement);
