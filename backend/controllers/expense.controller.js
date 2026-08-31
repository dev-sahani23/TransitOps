import * as expenseService from '../services/expense.service.js';
import { success  } from '../utils/apiResponse.js';
import { buildPagination  } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { skip, take, page, limit } = buildPagination(req.query);
    const { category, vehicleId } = req.query;
    const { expenses, total } = await expenseService.getAll({ skip, take, category, vehicleId });
    return success(res, 200, 'Expenses retrieved successfully', {
      expenses, meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const expense = await expenseService.getById(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found', errors: [] });
    return success(res, 200, 'Expense retrieved successfully', expense);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.tripId === "") data.tripId = null;
    if (data.notes === "") data.notes = null;
    
    const expense = await expenseService.create(data);
    return success(res, 201, 'Expense created successfully', expense);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.tripId === "") data.tripId = null;
    if (data.notes === "") data.notes = null;

    const expense = await expenseService.update(req.params.id, data);
    return success(res, 200, 'Expense updated successfully', expense);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message, errors: [] });
    }
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await expenseService.remove(req.params.id);
    return success(res, 200, 'Expense deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
