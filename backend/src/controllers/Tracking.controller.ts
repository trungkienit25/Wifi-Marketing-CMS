import type { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/Analytics.service.js';
import { z } from 'zod';

const TrackSchema = z.object({
  brandId: z.string(),
  adId: z.string(),
  type: z.enum(['impression', 'click']),
  fingerprint: z.string().optional(),
});

export class TrackingController {
  /**
   * Tracks an advertisement event (impression or click).
   * Uses Hybrid ID (MAC from MikroTik + Fingerprint from Browser).
   */
  public static async track(req: Request, res: Response, next: NextFunction) {
    try {
      const { brandId, adId, type, fingerprint } = TrackSchema.parse(req.body);

      // Extract MAC Address from Header (Provided by MikroTik as x-client-mac in some setups, or custom header)
      // Fallback to IP if not provided
      const macAddress = req.header('x-client-mac') || req.ip || 'unknown-mac';
      const userFingerprint = fingerprint || 'generic-fp';

      // Pass to service for fraud detection and buffering
      const success = await AnalyticsService.track({
        brandId,
        adId,
        type,
        macAddress,
        fingerprint: userFingerprint
      });

      if (!success) {
        // We still respond with 200/204 to avoid revealing fraud detection to the potential attacker
        return res.status(200).json({ success: true, message: 'Event received (Ignored)' });
      }

      return res.status(200).json({ success: true, message: 'Event tracked successfully.' });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, errors: error.issues });
      }
      next(error);
    }
  }

  /**
   * Endpoint for Dashboard to fetch aggregated ROI data.
   * Optimized to query AnalyticsSummary (Summary Document).
   */
  public static async getPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const { brandId } = req.query;
      if (!brandId) return res.status(400).json({ success: false, message: 'Brand ID required.' });

      // Aggregate hourly data into daily for ROI overview
      // This query hits a summary collection, hence sub-100ms
      const summary = await import('../models/AnalyticsSummary.js').then(m => m.default.find({ 
        brandId: brandId as string 
      }).sort({ date: -1, hour: -1 }).limit(100));

      return res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error: any) {
      next(error);
    }
  }
}
