import type { Request } from 'express';

export class HostnameExtractor {
  /**
   * Identifies brand_id from hostname. 
   * Example: 'lalot.wifi-marketing.com' -> 'lalot'.
   * Fallback to query parameter 'brandId' for dev/testing.
   */
  public static extractBrandId(req: Request): string | null {
    // 1. Check for specific host mapping (Tenant ID in Subdomain)
    const host = req.headers['x-forwarded-host'] || req.get('host');
    if (host && typeof host === 'string') {
      const subdomain = host.split('.')[0];
      if (subdomain && subdomain !== 'localhost' && subdomain !== 'www' && subdomain !== 'api') {
        return subdomain;
      }
    }

    // 2. Fallback to Query Parameters (Useful for local status.html testing)
    const queryBrandId = req.query['brandId'];
    if (queryBrandId && typeof queryBrandId === 'string') {
      return queryBrandId;
    }

    return null;
  }
}
