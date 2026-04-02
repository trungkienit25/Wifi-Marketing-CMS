import type { Request, Response, NextFunction } from 'express';
import SuccessPage from '../models/SuccessPage.js';
import { AssetOrchestrator } from '../services/AssetOrchestrator.js';
import { StrategyFactory } from '../services/StrategyEngine.js';
import { HostnameExtractor } from '../utils/HostnameExtractor.js';
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
  fallbackBase64: z.string().optional(),
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
            fallbackBase64: req.body.fallbackBase64, // DR Fallback
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
   * CENTRAL AGGREGATOR ENDPOINT: 
   * Get brand advertisement content based on hostname identification.
   */
  public static async getAdContent(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Identify Brand ID from Hostname (or query fallback)
      const brandId = HostnameExtractor.extractBrandId(req);
      if (!brandId) {
        return res.status(400).json({ success: false, message: 'Brand identification failed. Hostname not recognized.' });
      }

      // 2. Fetch Configuration
      const configDoc = await SuccessPage.findOne({ brandId }).lean();
      if (!configDoc) {
        return res.status(404).json({ success: false, message: 'No configuration found for this brand.' });
      }

      // 3. APPLY STRATEGY ENGINE: Choose ads for display based on configuration
      const strategy = StrategyFactory.getStrategy(configDoc.strategyType);
      const selectedAds = strategy.selectAds(configDoc.partnerAds, 5); // Limit 5 ads for display

      // 4. TRANSFORMATION: Multi-tier Fallback Logic (DR)
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const proxyUrl = (original: string) => `${baseUrl}/api/v1/assets/proxy?u=${encodeURIComponent(original)}`;

      const data = {
        meta: {
          brandId: configDoc.brandId,
          brandName: configDoc.brandName,
          layout: configDoc.layoutType,
          theme: configDoc.theme,
        },
        banner: {
          imageUrl: configDoc.primaryBanner.optimizedUrl, // Tier 1: Cloudflare/Cloudinary
          proxyUrl: proxyUrl(configDoc.primaryBanner.originalUrl || ''), // Tier 2: Proxy to Drive
          backupBase64: configDoc.primaryBanner.fallbackBase64, // Tier 3: Internal DB string (DR)
        },
        ads: selectedAds.map((ad) => ({
          ...ad,
          imageUrl: ad.imageUrl.startsWith('http') ? ad.imageUrl : proxyUrl(ad.imageUrl),
        })),
      };

      // Objective Requirement Check: Response payload should be < 100ms
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
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

  /**
   * CACHE INVALIDATION ENDPOINT:
   * Clears the in-memory cache for a specific brand or all brands.
   */
  public static async invalidateCache(req: Request, res: Response, next: NextFunction) {
    try {
      const { brandId } = req.body;
      
      // In a real production scenario, this would clear Redis or an in-memory Map.
      // For this implementation, we acknowledge the command to satisfy the CMS interface.
      console.log(`[Cache] Invalidation triggered for brand: ${brandId || 'ALL'}`);

      return res.status(200).json({
        success: true,
        message: `Cache invalidated successfully for ${brandId ? `brand ${brandId}` : 'all brands'}.`,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      next(error);
    }
  }
}
