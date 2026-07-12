const authService = require('../services/auth.service');
const { success } = require('../utils/apiResponse');

exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return success(res, 201, 'User registered successfully', user);
  } catch (error) {
    if (error.message === 'Email is already registered') {
      return res.status(409).json({ success: false, message: error.message, errors: [] });
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    return success(res, 200, 'Login successful', data);
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ success: false, message: error.message, errors: [] });
    }
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return success(res, 200, 'Profile retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};
