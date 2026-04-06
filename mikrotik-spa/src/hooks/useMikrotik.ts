import { useMemo } from 'preact/hooks';

export interface MikroTikContext {
  mac: string;
  hostname: string;
  ip: string;
  linkOrig: string;
  isLoggedIn: boolean;
  error: string;
}

const MOCK_CONTEXT: MikroTikContext = {
  mac: '1A:2B:3C:4D:5E:6F',
  hostname: 'lalot',
  ip: '192.168.88.254',
  linkOrig: 'https://google.com',
  isLoggedIn: false, // Start with unauthorized for testing
  error: '',
};

export function useMikrotik() {
  const context = useMemo<MikroTikContext>(() => {
    // Check if the script tiêm $(v) has been replaced by RouterOS
    const raw = (window as any).MIKROTIK_CONTEXT;
    
    // Detection logic: if $(mac) is still there, it's local development
    if (!raw || raw.mac === '$(mac)') {
      console.log('[MikroTik] RouterOS context not found, using Mock Data.');
      return MOCK_CONTEXT;
    }

    return raw;
  }, []);

  return context;
}
