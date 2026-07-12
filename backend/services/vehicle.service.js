const prisma = require('../config/db');

exports.getAll = async ({ skip, take, search, status, type }) => {
  const where = {};
  
  if (search) {
    where.OR = [
      { registrationNumber: { contains: search, mode: 'insensitive' } },
      { make: { contains: search, mode: 'insensitive' } },
      { model: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  if (status) {
    where.status = status;
  }
  
  if (type) {
    where.vehicleType = type;
  }

  const [vehicles, total] = await prisma.$transaction([
    prisma.vehicle.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.vehicle.count({ where }),
  ]);

  return { vehicles, total };
};

exports.getById = async (id) => {
  return prisma.vehicle.findUnique({
    where: { id },
    include: {
      _count: {
        select: { trips: true }
      }
    }
  });
};

exports.create = async (data) => {
  return prisma.vehicle.create({
    data
  });
};

exports.update = async (id, data) => {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  if (vehicle.status === 'ON_TRIP' && data.status === 'RETIRED') {
    throw new Error('Cannot retire a vehicle that is currently on a trip');
  }

  return prisma.vehicle.update({
    where: { id },
    data
  });
};

exports.delete = async (id) => {
  const activeTrips = await prisma.trip.count({
    where: {
      vehicleId: id,
      status: {
        in: ['DRAFT', 'DISPATCHED']
      }
    }
  });

  if (activeTrips > 0) {
    throw new Error('Cannot delete vehicle with active trips');
  }

  return prisma.vehicle.delete({
    where: { id }
  });
};
