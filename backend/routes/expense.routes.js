import express from 'express';
const router = express.Router();
import * as expenseController from '../controllers/expense.controller.js';
import { expenseValidation  } from '../validations/expense.validation.js';
import { validate  } from '../middleware/validate.js';
import { verifyToken, authorizeRole  } from '../middleware/auth.js';

router.use(verifyToken);

router.get('/', expenseController.getAll);
router.get('/:id', expenseController.getById);

router.use(authorizeRole('ADMIN', 'FLEET_MANAGER', 'DISPATCHER'));

router.post('/', expenseValidation, validate, expenseController.create);
router.put('/:id', expenseValidation, validate, expenseController.update);
router.delete('/:id', expenseController.remove);

export default router;
