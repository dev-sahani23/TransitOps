import express from 'express';
const router = express.Router();
import * as vehicleController from '../controllers/vehicle.controller.js';
import { vehicleValidation  } from '../validations/vehicle.validation.js';
import { validate  } from '../middleware/validate.js';
import { verifyToken, authorizeRole  } from '../middleware/auth.js';

router.use(verifyToken);

router.get('/', vehicleController.getAll);
router.get('/:id', vehicleController.getById);

// Protected routes for Admin & Fleet Manager
router.use(authorizeRole('ADMIN', 'FLEET_MANAGER'));

router.post('/', vehicleValidation, validate, vehicleController.create);
router.put('/:id', vehicleValidation, validate, vehicleController.update);
router.delete('/:id', vehicleController.remove);

export default router;
