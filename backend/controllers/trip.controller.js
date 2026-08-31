import * as tripService from '../services/trip.service.js';
import { success  } from '../utils/apiResponse.js';
import { buildPagination  } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { skip, take, page, limit } = buildPagination(req.query);
    const { search, status } = req.query;
    const { trips, total } = await tripService.getAll({ skip, take, search, status });
    return success(res, 200, 'Trips retrieved successfully', {
      trips, meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const trip = await tripService.getById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found', errors: [] });
    return success(res, 200, 'Trip retrieved successfully', trip);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.cargo === "") data.cargo = null;
    if (data.revenue === "") data.revenue = null;
    if (data.dispatchTime === "") data.dispatchTime = null;
    if (data.completionTime === "") data.completionTime = null;
    
    const trip = await tripService.create(data);
    return success(res, 201, 'Trip created successfully', trip);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.cargo === "") data.cargo = null;
    if (data.revenue === "") data.revenue = null;
    if (data.dispatchTime === "") data.dispatchTime = null;
    if (data.completionTime === "") data.completionTime = null;

    const trip = await tripService.update(req.params.id, data);
    return success(res, 200, 'Trip updated successfully', trip);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message, errors: [] });
    }
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await tripService.remove(req.params.id);
    return success(res, 200, 'Trip deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
