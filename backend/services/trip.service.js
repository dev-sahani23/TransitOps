const prisma = require('../config/db');

exports.getAll = async ({ skip, take, search, status }) => {
  const where = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { source: { contains: search, mode: 'insensitive' } },
      { destination: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [trips, total] = await prisma.$transaction([
    prisma.trip.findMany({
      where, skip, take,
      include: { vehicle: true, driver: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.trip.count({ where }),
  ]);
  return { trips, total };
};

exports.getById = async (id) => {
  return prisma.trip.findUnique({
    where: { id },
    include: { vehicle: true, driver: true }
  });
};

exports.create = async (data) => {
  return prisma.trip.create({ data });
};

exports.update = async (id, data) => {
  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) throw new Error('Trip not found');
  return prisma.trip.update({ where: { id }, data });
};

exports.delete = async (id) => {
  return prisma.trip.delete({ where: { id } });
};
