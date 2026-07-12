const prisma = require('../config/db');

exports.getAll = async ({ skip, take, search, status, vehicleId }) => {
  const where = {};
  if (status) where.status = status;
  if (vehicleId) where.vehicleId = vehicleId;
  if (search) {
    where.description = { contains: search, mode: 'insensitive' };
  }

  const [logs, total] = await prisma.$transaction([
    prisma.maintenanceLog.findMany({
      where, skip, take,
      include: { vehicle: true },
      orderBy: { startDate: 'desc' },
    }),
    prisma.maintenanceLog.count({ where }),
  ]);
  return { logs, total };
};

exports.getById = async (id) => {
  return prisma.maintenanceLog.findUnique({
    where: { id },
    include: { vehicle: true }
  });
};

exports.create = async (data) => {
  return prisma.maintenanceLog.create({ data });
};

exports.update = async (id, data) => {
  const log = await prisma.maintenanceLog.findUnique({ where: { id } });
  if (!log) throw new Error('Maintenance log not found');
  return prisma.maintenanceLog.update({ where: { id }, data });
};

exports.delete = async (id) => {
  return prisma.maintenanceLog.delete({ where: { id } });
};
