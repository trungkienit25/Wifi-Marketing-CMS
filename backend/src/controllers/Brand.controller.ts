import type { Request, Response, NextFunction } from 'express';
import SuccessPage from '../models/SuccessPage.js';
import { AssetOrchestrator } from '../services/AssetOrchestrator.js';
import { z } from 'zod';

// Zod Schema for Validation
const UpdateConfigSchema = z.object({
  brandId: z.string(),
  brandName: z.string().optional(),
  driveUrl: z.string().url(),
  layoutType: z.enum(['Vertical', 'Z-Pattern', 'NativeFeed']).optional(),
  partnerAds: z.array(z.object({
    adId: z.string(),
    title: z.string(),
    imageUrl: z.string(),
    targetUrl: z.string().url(),
    weight: z.number().default(1),
  })).optional(),
  strategyType: z.enum(['WeightedRandom', 'Geo', 'FillRate']).optional(),
  theme: z.object({
    primaryColor: z.string(),
    backgroundColor: z.string(),
    textColor: z.string(),
  }).optional(),
});

export class BrandController {
  /**
   * Update brand configuration and process banner image via AssetOrchestrator.
   */
  public static async updateConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const { brandId, brandName, driveUrl, layoutType, partnerAds, strategyType, theme } = UpdateConfigSchema.parse(req.body);

      // 1. Process Google Drive URL through Cloudinary to Cloudflare R2
      const processedBanner = await AssetOrchestrator.processAsset(driveUrl, brandId);

      // 2. Insert or Update configuration in MongoDB (Multi-tenant)
      const configDoc = await SuccessPage.findOneAndUpdate(
        { brandId },
        {
          brandName: brandName || 'Unnamed Brand',
          primaryBanner: {
            originalUrl: driveUrl,
            driveId: processedBanner.driveId,
            optimizedUrl: processedBanner.optimizedUrl, // This URL is now processed (WebP, <200KB) and Edge-cached on R2
          },
          layoutType: layoutType || 'Vertical',
          partnerAds: partnerAds || [],
          strategyType: strategyType || 'WeightedRandom',
          theme: theme || { primaryColor: '#007bff', backgroundColor: '#ffffff', textColor: '#333333' }
        },
        { upsert: true, new: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Success Page configuration updated successfully.',
        data: configDoc,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, errors: error.issues });
      }
      next(error);
    }
  }

  /**
   * Get target brand configuration for alogin splash page.
   */
  public static async getConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const { brandId } = req.params;
      if (!brandId || typeof brandId !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid Brand ID' });
      }
      const configDoc = await SuccessPage.findOne({ brandId });

      if (!configDoc) {
        return res.status(404).json({ success: false, message: 'Brand configuration not found.' });
      }

      return res.status(200).json({
        success: true,
        data: configDoc,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
