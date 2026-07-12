const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance.controller');
const { maintenanceValidation } = require('../validations/maintenance.validation');
const { validate } = require('../middleware/validate');
const { verifyToken, authorizeRole } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', maintenanceController.getAll);
router.get('/:id', maintenanceController.getById);

router.use(authorizeRole('ADMIN', 'FLEET_MANAGER'));

router.post('/', maintenanceValidation, validate, maintenanceController.create);
router.put('/:id', maintenanceValidation, validate, maintenanceController.update);
router.delete('/:id', maintenanceController.delete);

module.exports = router;
