import { useState, useEffect, useMemo } from 'preact/hooks';
import { ApiService } from '../ApiService';
import { OFFLINE_CONTENT } from '../OfflineContent';
import type { ApiResponse } from '../ApiService';

/**
 * HOOK: Business logic for Alogin flow.
 * Handles: Identity (Fingerprinting), Fetching (Retry/Fallback), 
 * Timer, and CNA Anti-Auto-Close protection.
 */
export function useAloginLogic(mac: string, linkOrig: string, brandId?: string) {
  const [countdown, setCountdown] = useState(10);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(OFFLINE_CONTENT);

  // 1. HYBRID IDENTITY (MAC + Fingerprint)
  const fingerprint = useMemo(() => {
    return btoa(`fp-${window.navigator.userAgent}-${window.screen.width}x${window.screen.height}`);
  }, []);

  useEffect(() => {
    // 2. CNA ANTI-AUTO-CLOSE (CNA PROTECTION)
    // Prevents mobile OS from closing the captive portal after network gain.
    window.history.pushState({ noExit: true }, '');
    
    const handlePopState = () => {
      if (!window.confirm('Continue browsing our exclusive offers before leaving?')) {
        window.history.pushState({ noExit: true }, '');
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Trigger OS confirmation dialog
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 3. DATA ACQUISITION & TRACKING (POLLING + RETRY)
    // Passing the brandId down to the API
    ApiService.getAdContent(brandId)
      .then((res: ApiResponse<any>) => {
        if (res.success && res.data) {
          console.log(`[Alogin] Sync complete for ${brandId}:`, res.data);
          setData(res.data);
          // Auto-track initial Impression (Identity Sync)
          ApiService.trackEvent({ type: 'impression', brandId: brandId || res.data.meta?.brandId });
        }
      })
      .catch((err) => {
        console.warn(`[Alogin] API Fetch Failure for brand: ${brandId}. Falling back to offline mode. Error:`, err.message);
      })
      .finally(() => setLoading(false));

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [mac, fingerprint, brandId]);

  // 4. REDIRECT TIMER
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleLinkRedirect = () => {
    // 1. Track Click Event (Background)
    if (data?.meta?.brandId) {
      ApiService.trackEvent({ 
        type: 'click', 
        brandId: data.meta.brandId,
        trackingEnabled: data.meta.trackingEnabled 
      });
    }
    
    // 2. User explicitly decides to leave
    window.location.href = linkOrig || 'https://google.com';
  };

  return {
    data,
    loading,
    countdown,
    fingerprint,
    handleLinkRedirect
  };
}
