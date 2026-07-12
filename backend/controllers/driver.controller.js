const driverService = require('../services/driver.service');
const { success } = require('../utils/apiResponse');
const { buildPagination } = require('../utils/pagination');

exports.getAll = async (req, res, next) => {
  try {
    const { skip, take, page, limit } = buildPagination(req.query);
    const { search, status, category } = req.query;

    const { drivers, total } = await driverService.getAll({ skip, take, search, status, category });
    
    return success(res, 200, 'Drivers retrieved successfully', {
      drivers,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const driver = await driverService.getById(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found', errors: [] });
    }
    return success(res, 200, 'Driver retrieved successfully', driver);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    // Convert empty strings to null for optional fields to satisfy Prisma
    if (data.email === "") data.email = null;
    if (data.dateOfBirth === "") data.dateOfBirth = null;
    if (data.joiningDate === "") data.joiningDate = null;
    if (data.safetyScore === "") data.safetyScore = null;

    const driver = await driverService.create(data);
    return success(res, 201, 'Driver created successfully', driver);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.email === "") data.email = null;
    if (data.dateOfBirth === "") data.dateOfBirth = null;
    if (data.joiningDate === "") data.joiningDate = null;
    if (data.safetyScore === "") data.safetyScore = null;

    const driver = await driverService.update(req.params.id, data);
    return success(res, 200, 'Driver updated successfully', driver);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message, errors: [] });
    }
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await driverService.delete(req.params.id);
    return success(res, 200, 'Driver deleted successfully', null);
  } catch (error) {
    if (error.message.includes('active trips')) {
      return res.status(400).json({ success: false, message: error.message, errors: [] });
    }
    next(error);
  }
};
