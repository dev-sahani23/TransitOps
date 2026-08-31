import express from 'express';
const router = express.Router();
import * as maintenanceController from '../controllers/maintenance.controller.js';
import { maintenanceValidation  } from '../validations/maintenance.validation.js';
import { validate  } from '../middleware/validate.js';
import { verifyToken, authorizeRole  } from '../middleware/auth.js';

router.use(verifyToken);

router.get('/', maintenanceController.getAll);
router.get('/:id', maintenanceController.getById);

router.use(authorizeRole('ADMIN', 'FLEET_MANAGER'));

router.post('/', maintenanceValidation, validate, maintenanceController.create);
router.put('/:id', maintenanceValidation, validate, maintenanceController.update);
router.delete('/:id', maintenanceController.remove);

export default router;
