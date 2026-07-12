const { validationResult } = require('express-validator');
const { error } = require('../utils/apiResponse');

exports.validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    // Format errors to a simple array of messages
    const formattedErrors = result.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    return error(res, 400, 'Validation failed', formattedErrors);
  }
  next();
};
