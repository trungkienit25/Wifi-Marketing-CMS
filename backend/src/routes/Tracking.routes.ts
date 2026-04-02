import { Router } from 'express';
import { TrackingController } from '../controllers/Tracking.controller.js';

const router = Router();

// Event tracking endpoint (SPA -> Backend)
router.post('/event', TrackingController.track);

// Summary performance for Brand Dashboard
router.get('/performance', TrackingController.getPerformance);

export default router;
