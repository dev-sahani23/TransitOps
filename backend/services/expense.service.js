import prisma from '../config/db.js';

export const getAll = async ({ skip, take, category, vehicleId }) => {
  const where = {};
  if (category) where.category = category;
  if (vehicleId) where.vehicleId = vehicleId;

  const [expenses, total] = await prisma.$transaction([
    prisma.expense.findMany({
      where, skip, take,
      include: { vehicle: true, trip: true },
      orderBy: { date: 'desc' },
    }),
    prisma.expense.count({ where }),
  ]);
  return { expenses, total };
};

export const getById = async (id) => {
  return prisma.expense.findUnique({
    where: { id },
    include: { vehicle: true, trip: true }
  });
};

export const create = async (data) => {
  return prisma.expense.create({ data });
};

export const update = async (id, data) => {
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense) throw new Error('Expense not found');
  return prisma.expense.update({ where: { id }, data });
};

export const remove = async (id) => {
  return prisma.expense.delete({ where: { id } });
};
