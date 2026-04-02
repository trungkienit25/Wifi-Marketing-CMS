import { Router } from 'express';
import { BrandController } from '../controllers/Brand.controller.js';

const router = Router();

// Central Aggregator: Returns brand configuration and selected ads (Identification via Hostname)
router.get('/ad-content', BrandController.getAdContent);

// Endpoint for Webhook/Admin to push config and trigger image processing
router.post('/config', BrandController.updateConfig);

// Endpoint for SPA status.html to fetch branding data
router.get('/:brandId/config', BrandController.getConfig);

// Endpoint for In-memory Cache Invalidation
router.post('/invalidate-cache', BrandController.invalidateCache);

export default router;
