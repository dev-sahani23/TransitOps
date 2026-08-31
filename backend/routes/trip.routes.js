import express from 'express';
const router = express.Router();
import * as tripController from '../controllers/trip.controller.js';
import { tripValidation  } from '../validations/trip.validation.js';
import { validate  } from '../middleware/validate.js';
import { verifyToken, authorizeRole  } from '../middleware/auth.js';

router.use(verifyToken);

router.get('/', tripController.getAll);
router.get('/:id', tripController.getById);

router.use(authorizeRole('ADMIN', 'FLEET_MANAGER', 'DISPATCHER'));

router.post('/', tripValidation, validate, tripController.create);
router.put('/:id', tripValidation, validate, tripController.update);
router.delete('/:id', tripController.remove);

export default router;
