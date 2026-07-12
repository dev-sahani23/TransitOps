const dashboardService = require('../services/dashboard.service');
const { success } = require('../utils/apiResponse');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    return success(res, 200, 'Dashboard stats retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};
