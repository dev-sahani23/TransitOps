const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver.controller');
const { driverValidation } = require('../validations/driver.validation');
const { validate } = require('../middleware/validate');
const { verifyToken, authorizeRole } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', driverController.getAll);
router.get('/:id', driverController.getById);

// Protected routes for Admin & Fleet Manager
router.use(authorizeRole('ADMIN', 'FLEET_MANAGER'));

router.post('/', driverValidation, validate, driverController.create);
router.put('/:id', driverValidation, validate, driverController.update);
router.delete('/:id', driverController.delete);

module.exports = router;
