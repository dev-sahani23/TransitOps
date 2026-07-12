const prisma = require('../config/db');

exports.getAll = async ({ skip, take, search, status, category }) => {
  const where = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { licenseNumber: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  if (status) {
    where.status = status;
  }
  
  if (category) {
    where.licenseCategory = category;
  }

  const [drivers, total] = await prisma.$transaction([
    prisma.driver.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.driver.count({ where }),
  ]);

  return { drivers, total };
};

exports.getById = async (id) => {
  return prisma.driver.findUnique({
    where: { id },
    include: {
      _count: {
        select: { trips: true }
      }
    }
  });
};

exports.create = async (data) => {
  return prisma.driver.create({
    data
  });
};

exports.update = async (id, data) => {
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) {
    throw new Error('Driver not found');
  }

  return prisma.driver.update({
    where: { id },
    data
  });
};

exports.delete = async (id) => {
  const activeTrips = await prisma.trip.count({
    where: {
      driverId: id,
      status: {
        in: ['DRAFT', 'DISPATCHED']
      }
    }
  });

  if (activeTrips > 0) {
    throw new Error('Cannot delete driver with active trips');
  }

  return prisma.driver.delete({
    where: { id }
  });
};
