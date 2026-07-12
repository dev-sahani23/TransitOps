const vehicleService = require('../services/vehicle.service');
const { success } = require('../utils/apiResponse');
const { buildPagination } = require('../utils/pagination');

exports.getAll = async (req, res, next) => {
  try {
    const { skip, take, page, limit } = buildPagination(req.query);
    const { search, status, type } = req.query;

    const { vehicles, total } = await vehicleService.getAll({ skip, take, search, status, type });
    
    return success(res, 200, 'Vehicles retrieved successfully', {
      vehicles,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found', errors: [] });
    }
    return success(res, 200, 'Vehicle retrieved successfully', vehicle);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.create(req.body);
    return success(res, 201, 'Vehicle created successfully', vehicle);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.update(req.params.id, req.body);
    return success(res, 200, 'Vehicle updated successfully', vehicle);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message, errors: [] });
    }
    if (error.message.includes('Cannot retire')) {
      return res.status(400).json({ success: false, message: error.message, errors: [] });
    }
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await vehicleService.delete(req.params.id);
    return success(res, 200, 'Vehicle deleted successfully', null);
  } catch (error) {
    if (error.message.includes('active trips')) {
      return res.status(400).json({ success: false, message: error.message, errors: [] });
    }
    next(error);
  }
};
