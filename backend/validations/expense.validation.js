const { body } = require('express-validator');

exports.expenseValidation = [
  body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
  body('tripId').optional({ checkFalsy: true }).isString(),
  body('category').notEmpty().withMessage('Category is required'),
  body('amount').notEmpty().withMessage('Amount is required').isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('date').notEmpty().withMessage('Date is required').isISO8601().toDate(),
  body('notes').optional({ checkFalsy: true }).isString()
];
