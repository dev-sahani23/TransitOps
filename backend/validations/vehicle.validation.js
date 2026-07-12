const { body } = require('express-validator');

exports.vehicleValidation = [
  body('registrationNumber')
    .notEmpty().withMessage('Registration number is required')
    .matches(/^[A-Za-z0-9-]+$/).withMessage('Registration number must be alphanumeric'),
  body('make')
    .notEmpty().withMessage('Make is required'),
  body('model')
    .notEmpty().withMessage('Model is required'),
  body('vehicleType')
    .notEmpty().withMessage('Vehicle type is required'),
  body('maximumCapacity')
    .notEmpty().withMessage('Maximum capacity is required')
    .isFloat({ gt: 0 }).withMessage('Maximum capacity must be greater than 0'),
  body('odometer')
    .optional()
    .isFloat({ min: 0 }).withMessage('Odometer must be a positive number'),
  body('acquisitionCost')
    .optional()
    .isFloat({ min: 0 }).withMessage('Acquisition cost must be a positive number'),
  body('status')
    .optional()
    .isIn(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'])
    .withMessage('Invalid vehicle status')
];
