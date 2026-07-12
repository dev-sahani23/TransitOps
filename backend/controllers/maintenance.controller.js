const maintenanceService = require('../services/maintenance.service');
const { success } = require('../utils/apiResponse');
const { buildPagination } = require('../utils/pagination');

exports.getAll = async (req, res, next) => {
  try {
    const { skip, take, page, limit } = buildPagination(req.query);
    const { search, status, vehicleId } = req.query;
    const { logs, total } = await maintenanceService.getAll({ skip, take, search, status, vehicleId });
    return success(res, 200, 'Maintenance logs retrieved successfully', {
      logs, meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const log = await maintenanceService.getById(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'Maintenance log not found', errors: [] });
    return success(res, 200, 'Maintenance log retrieved successfully', log);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.odometer === "") data.odometer = null;
    if (data.endDate === "") data.endDate = null;
    
    const log = await maintenanceService.create(data);
    return success(res, 201, 'Maintenance log created successfully', log);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.odometer === "") data.odometer = null;
    if (data.endDate === "") data.endDate = null;

    const log = await maintenanceService.update(req.params.id, data);
    return success(res, 200, 'Maintenance log updated successfully', log);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message, errors: [] });
    }
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await maintenanceService.delete(req.params.id);
    return success(res, 200, 'Maintenance log deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
