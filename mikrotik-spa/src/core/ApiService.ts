/**
 * API Service with Exponential Backoff Retry mechanism.
 * Handles the initial network instability of MikroTik routers (Masquerade latency).
 */

const RETRY_DELAY = [500, 1000, 2000]; // ms

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class ApiService {
  private static BASE_URL = 'http://localhost:3000'; // In production, this would be the Cloud API domain

  /**
   * Fetch with automatic retries on failure.
   */
  public static async fetchWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = 0
  ): Promise<T> {
    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (retries < RETRY_DELAY.length) {
        const delay = RETRY_DELAY[retries];
        console.warn(`[API] Fetch failed. Retrying in ${delay}ms... (Attempt ${retries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(endpoint, options, retries + 1);
      }
      console.error('[API] Max retries reached. Network unstable.');
      throw error;
    }
  }

  /**
   * Get dynamic advertisement content.
   */
  public static async getAdContent(brandId?: string) {
    const endpoint = brandId ? `/api/mikrotik/ad-content?brandId=${brandId}` : '/api/mikrotik/ad-content';
    return this.fetchWithRetry<ApiResponse<any>>(endpoint);
  }

  /**
   * Track advertisement events.
   * New Signature: (payload: { type, adId?, mac?, fp?, brandId? })
   * Old Signature: (brandId: string, type: 'impression' | 'click')
   */
  public static async trackEvent(payload: { type: 'impression' | 'click'; adId?: string; mac?: string; fp?: string; brandId?: string; trackingEnabled?: boolean }): Promise<ApiResponse<any>>;
  public static async trackEvent(arg1: any, arg2?: 'impression' | 'click') {
    let payload: any = {};
    
    if (typeof arg1 === 'string' && arg2) {
      // Old signature support (Retained for legacy compatibility)
      payload = { brandId: arg1, type: arg2 };
    } else if (typeof arg1 === 'object') {
      // New signature: ({ type, adId, mac, fp, brandId, trackingEnabled? })
      payload = arg1;
    }

    // [STRATEGY CHECK]: Skip request if tracking is disabled in CMS for this brand
    if (payload.trackingEnabled === false) {
      console.debug('[API] User Tracking for this brand is DISABLED by strategy.');
      return { success: true, message: "Tracking disabled by policy" };
    }

    return this.fetchWithRetry<ApiResponse<any>>('/api/mikrotik/tracking', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}
