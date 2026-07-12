const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { vehicleValidation } = require('../validations/vehicle.validation');
const { validate } = require('../middleware/validate');
const { verifyToken, authorizeRole } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', vehicleController.getAll);
router.get('/:id', vehicleController.getById);

// Protected routes for Admin & Fleet Manager
router.use(authorizeRole('ADMIN', 'FLEET_MANAGER'));

router.post('/', vehicleValidation, validate, vehicleController.create);
router.put('/:id', vehicleValidation, validate, vehicleController.update);
router.delete('/:id', vehicleController.delete);

module.exports = router;
