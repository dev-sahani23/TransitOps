const { body } = require('express-validator');

exports.tripValidation = [
  body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
  body('driverId').notEmpty().withMessage('Driver ID is required'),
  body('source').notEmpty().withMessage('Source is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('cargoWeight').optional().isFloat({ min: 0 }).withMessage('Cargo weight must be positive'),
  body('cargo').optional({ checkFalsy: true }).isString(),
  body('revenue').optional({ checkFalsy: true }).isFloat({ min: 0 }),
  body('plannedDistance').optional().isFloat({ min: 0 }),
  body('status').optional().isIn(['DRAFT', 'DISPATCHED', 'COMPLETED', 'CANCELLED']),
  body('dispatchTime').optional({ checkFalsy: true }).isISO8601().toDate(),
  body('completionTime').optional({ checkFalsy: true }).isISO8601().toDate()
];
