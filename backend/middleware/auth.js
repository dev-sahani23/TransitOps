import jwt from 'jsonwebtoken';
import { secret  } from '../config/jwt.js';
import { error  } from '../utils/apiResponse.js';

export const verifyToken = (req, res, next) => {
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

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return error(res, 403, 'Forbidden: Insufficient privileges');
    }
    next();
  };
};
