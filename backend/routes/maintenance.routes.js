import express from 'express';
const router = express.Router();
import * as maintenanceController from '../controllers/maintenance.controller.js';
import { maintenanceValidation  } from '../validations/maintenance.validation.js';
import { validate  } from '../middleware/validate.js';
import { verifyToken, authorizeRole  } from '../middleware/auth.js';

router.use(verifyToken);

router.get('/', maintenanceController.getAll);
router.get('/:id', maintenanceController.getById);

const requirePrivilege = authorizeRole('ADMIN', 'FLEET_MANAGER');

router.post('/', requirePrivilege, maintenanceValidation, validate, maintenanceController.create);
router.put('/:id', requirePrivilege, maintenanceValidation, validate, maintenanceController.update);
router.delete('/:id', requirePrivilege, maintenanceController.remove);

export default router;
