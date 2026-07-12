const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { expenseValidation } = require('../validations/expense.validation');
const { validate } = require('../middleware/validate');
const { verifyToken, authorizeRole } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', expenseController.getAll);
router.get('/:id', expenseController.getById);

router.use(authorizeRole('ADMIN', 'FLEET_MANAGER', 'DISPATCHER'));

router.post('/', expenseValidation, validate, expenseController.create);
router.put('/:id', expenseValidation, validate, expenseController.update);
router.delete('/:id', expenseController.delete);

module.exports = router;
