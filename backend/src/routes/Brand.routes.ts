import { Router } from 'express';
import { BrandController } from '../controllers/Brand.controller.js';

const router = Router();

// Endpoint for Webhook/Admin to push config and trigger image processing
router.post('/config', BrandController.updateConfig);

// Endpoint for SPA status.html to fetch branding data
router.get('/:brandId/config', BrandController.getConfig);

export default router;
