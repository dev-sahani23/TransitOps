const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const { tripValidation } = require('../validations/trip.validation');
const { validate } = require('../middleware/validate');
const { verifyToken, authorizeRole } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', tripController.getAll);
router.get('/:id', tripController.getById);

router.use(authorizeRole('ADMIN', 'FLEET_MANAGER', 'DISPATCHER'));

router.post('/', tripValidation, validate, tripController.create);
router.put('/:id', tripValidation, validate, tripController.update);
router.delete('/:id', tripController.delete);

module.exports = router;
