const prisma = require('../config/db');

exports.getAll = async ({ skip, take, category, vehicleId }) => {
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

exports.getById = async (id) => {
  return prisma.expense.findUnique({
    where: { id },
    include: { vehicle: true, trip: true }
  });
};

exports.create = async (data) => {
  return prisma.expense.create({ data });
};

exports.update = async (id, data) => {
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense) throw new Error('Expense not found');
  return prisma.expense.update({ where: { id }, data });
};

exports.delete = async (id) => {
  return prisma.expense.delete({ where: { id } });
};
