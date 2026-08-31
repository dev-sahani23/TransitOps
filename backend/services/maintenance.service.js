import prisma from '../config/db.js';

export const getAll = async ({ skip, take, search, status, vehicleId }) => {
  const where = {};
  if (status) where.status = status;
  if (vehicleId) where.vehicleId = vehicleId;
  if (search) {
    where.description = { contains: search };
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

export const getById = async (id) => {
  return prisma.maintenanceLog.findUnique({
    where: { id },
    include: { vehicle: true }
  });
};

export const create = async (data) => {
  return prisma.maintenanceLog.create({ data });
};

export const update = async (id, data) => {
  const log = await prisma.maintenanceLog.findUnique({ where: { id } });
  if (!log) throw new Error('Maintenance log not found');
  return prisma.maintenanceLog.update({ where: { id }, data });
};

export const remove = async (id) => {
  return prisma.maintenanceLog.delete({ where: { id } });
};
