import { Router } from 'express';
import { AssetProxyController } from '../controllers/AssetProxy.controller.js';

const router = Router();

// Endpoint for the proxy
router.get('/proxy', AssetProxyController.proxy);

export default router;
