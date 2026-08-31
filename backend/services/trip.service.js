import prisma from '../config/db.js';

export const getAll = async ({ skip, take, search, status }) => {
  const where = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { source: { contains: search } },
      { destination: { contains: search } },
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

export const getById = async (id) => {
  return prisma.trip.findUnique({
    where: { id },
    include: { vehicle: true, driver: true }
  });
};

export const create = async (data) => {
  return prisma.trip.create({ data });
};

export const update = async (id, data) => {
  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) throw new Error('Trip not found');
  return prisma.trip.update({ where: { id }, data });
};

export const remove = async (id) => {
  return prisma.trip.delete({ where: { id } });
};
