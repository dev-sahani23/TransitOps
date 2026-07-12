const { error } = require('../utils/apiResponse');
const { Prisma } = require('@prisma/client');

exports.globalErrorHandler = (err, req, res, next) => {
  console.error(err);

  // Prisma Unique Constraint Error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return error(res, 409, `Unique constraint failed on the fields: ${err.meta?.target}`);
    }
    if (err.code === 'P2025') {
      return error(res, 404, 'Record not found');
    }
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return error(res, 401, 'Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    return error(res, 401, 'Token expired');
  }

  // Generic internal error
  const message = process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error';
  const errors = process.env.NODE_ENV === 'development' ? err.stack : [];
  
  return error(res, 500, message, errors);
};
