const { body } = require('express-validator');

exports.maintenanceValidation = [
  body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
  body('type').notEmpty().withMessage('Type is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('cost').notEmpty().withMessage('Cost is required').isFloat({ min: 0 }).withMessage('Cost must be positive'),
  body('odometer').optional({ checkFalsy: true }).isFloat({ min: 0 }),
  body('status').optional().isIn(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED']),
  body('startDate').notEmpty().withMessage('Start date is required').isISO8601().toDate(),
  body('endDate').optional({ checkFalsy: true }).isISO8601().toDate()
];
