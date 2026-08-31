import * as dashboardService from '../services/dashboard.service.js';
import { success  } from '../utils/apiResponse.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    return success(res, 200, 'Dashboard stats retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};
