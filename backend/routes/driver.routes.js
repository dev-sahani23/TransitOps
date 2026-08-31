import express from 'express';
const router = express.Router();
import * as driverController from '../controllers/driver.controller.js';
import { driverValidation  } from '../validations/driver.validation.js';
import { validate  } from '../middleware/validate.js';
import { verifyToken, authorizeRole  } from '../middleware/auth.js';

router.use(verifyToken);

router.get('/', driverController.getAll);
router.get('/:id', driverController.getById);

// Protected routes for Admin & Fleet Manager
router.use(authorizeRole('ADMIN', 'FLEET_MANAGER'));

router.post('/', driverValidation, validate, driverController.create);
router.put('/:id', driverValidation, validate, driverController.update);
router.delete('/:id', driverController.remove);

export default router;
