import express from 'express';
const router = express.Router();
import * as dashboardController from '../controllers/dashboard.controller.js';
import { verifyToken  } from '../middleware/auth.js';

router.use(verifyToken);
router.get('/', dashboardController.getDashboardStats);

export default router;
