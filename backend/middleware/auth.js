const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');
const { error } = require('../utils/apiResponse');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 401, 'Unauthorized: No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 401, 'Unauthorized: Token expired');
    }
    return error(res, 401, 'Unauthorized: Invalid token');
  }
};

exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return error(res, 403, 'Forbidden: Insufficient privileges');
    }
    next();
  };
};
