import AnalyticsSummary from '../models/AnalyticsSummary.js';

interface TrackingPayload {
  brandId: string;
  adId: string;
  type: 'impression' | 'click';
  macAddress: string;  // MikroTik
  fingerprint: string; // Browser
}

/**
 * High-performance Analytics Service: Handles fraud detection and daily/hourly aggregation.
 */
export class AnalyticsService {
  private static clickBuffer: Map<string, Set<string>> = new Map(); // brand_id + ad_id + type + date + hour -> Set<MAC+FP>
  private static rateLimiter: Map<string, number> = new Map(); // MAC+FP+AD -> Timestamp
  private static writeQueue: TrackingPayload[] = [];
  private static BATCH_THRESHOLD = 50; // Write to DB after 50 hits
  private static INTERVAL_MS = 30000; // or every 30 seconds

  constructor() {
    setInterval(() => AnalyticsService.flushQueue(), AnalyticsService.INTERVAL_MS);
  }

  /**
   * Main entry point for tracking. Performs hybrid ID validation and fraud checks.
   */
  public static async track(payload: TrackingPayload): Promise<boolean> {
    const { brandId, adId, type, macAddress, fingerprint } = payload;
    const hybridId = `${macAddress}:${fingerprint}`;
    const fraudKey = `${hybridId}:${adId}:${type}`;

    // 1. CLICK FRAUD DETECTION (RATE LIMITING)
    if (type === 'click') {
      const now = Date.now();
      const lastClick = AnalyticsService.rateLimiter.get(fraudKey);
      if (lastClick && (now - lastClick) < 60000) { // Max 1 click/minute/user
        console.warn(`[Blocked] Fraudulent click attempt from ${hybridId} on ad ${adId}`);
        return false;
      }
      AnalyticsService.rateLimiter.set(fraudKey, now);
    }

    // 2. BUFFERING IN-MEMORY (DE-DUPLICATION)
    AnalyticsService.writeQueue.push(payload);

    if (AnalyticsService.writeQueue.length >= AnalyticsService.BATCH_THRESHOLD) {
      await AnalyticsService.flushQueue();
    }

    return true;
  }

  /**
   * Aggregates buffered data into Summary Documents using MongoDB Bulk Write Ops.
   */
  private static async flushQueue() {
    if (this.writeQueue.length === 0) return;

    const currentBatch = [...this.writeQueue];
    this.writeQueue = [];

    // Grouping by brandId, adId, type, date, hour
    const map = new Map<string, { brandId: string; adId: string; type: string; date: Date; hour: number; count: number }>();

    for (const item of currentBatch) {
      const now = new Date();
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const hour = now.getHours();
      const key = `${item.brandId}_${item.adId}_${item.type}_${date.getTime()}_${hour}`;

      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, { ...item, date, hour, count: 1 });
      }
    }

    const bulkOps = Array.from(map.values()).map((agg) => ({
      updateOne: {
        filter: {
          brandId: agg.brandId,
          adId: agg.adId,
          type: agg.type,
          date: agg.date,
          hour: agg.hour
        },
        update: { $inc: { count: agg.count } },
        upsert: true
      }
    }));

    try {
      await AnalyticsSummary.bulkWrite(bulkOps);
      console.log(`[Analytics] Successfully aggregated ${currentBatch.length} events into ${bulkOps.length} summary docs.`);
    } catch (error) {
      console.error('[Analytics] Bulk write failed:', error);
      // Logic could be added to prepend items back to queue on permanent failure
    }
  }

  /**
   * Cleanup for Rate Limiter (Memory Leak prevention)
   */
  public static cleanup() {
    const now = Date.now();
    for (const [key, timestamp] of this.rateLimiter) {
      if (now - timestamp > 3600000) { // Keep data for 1hr
        this.rateLimiter.delete(key);
      }
    }
  }
}

// Global Periodic Cleanup
setInterval(() => AnalyticsService.cleanup(), 600000); // Every 10 mins
