const { body } = require('express-validator');

exports.driverValidation = [
  body('name')
    .notEmpty().withMessage('Driver name is required'),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Must be a valid email'),
  body('dateOfBirth')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Must be a valid ISO date')
    .toDate(),
  body('joiningDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Must be a valid ISO date')
    .toDate(),
  body('licenseNumber')
    .notEmpty().withMessage('License number is required'),
  body('licenseCategory')
    .notEmpty().withMessage('License category is required'),
  body('licenseExpiry')
    .notEmpty().withMessage('License expiry date is required')
    .isISO8601().withMessage('Must be a valid ISO date')
    .toDate(),
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[0-9\s-]+$/).withMessage('Must be a valid phone number pattern'),
  body('safetyScore')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Safety score must be between 0 and 100'),
  body('status')
    .optional()
    .isIn(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED'])
    .withMessage('Invalid driver status')
];
