import { validationResult  } from 'express-validator';
import { error  } from '../utils/apiResponse.js';

export const validate = (req, res, next) => {
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
