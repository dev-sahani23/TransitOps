const prisma = require('../config/db');

exports.getDashboardStats = async () => {
  // 1. Vehicle Stats
  const totalVehicles = await prisma.vehicle.count();
  const availableVehicles = await prisma.vehicle.count({ where: { status: 'AVAILABLE' } });
  const onTripVehicles = await prisma.vehicle.count({ where: { status: 'ON_TRIP' } });
  const vehiclesInShop = await prisma.vehicle.count({ where: { status: 'IN_SHOP' } });

  // 2. Driver Stats
  const totalDrivers = await prisma.driver.count();
  const driversOnDuty = await prisma.driver.count({ where: { status: 'ON_TRIP' } });

  // 3. Trip Stats
  const pendingTrips = await prisma.trip.count({ where: { status: 'DRAFT' } });
  const activeTrips = await prisma.trip.count({ where: { status: 'DISPATCHED' } });

  // 4. Calculations
  const fleetUtilization = totalVehicles > 0 
    ? (onTripVehicles / totalVehicles) * 100 
    : 0;

  // 5. Cost Aggregations
  const fuelCostResult = await prisma.fuelLog.aggregate({
    _sum: { cost: true }
  });
  const totalFuelCost = fuelCostResult._sum.cost || 0;

  const maintenanceCostResult = await prisma.maintenanceLog.aggregate({
    _sum: { cost: true }
  });
  const totalMaintenanceCost = maintenanceCostResult._sum.cost || 0;

  const expensesResult = await prisma.expense.aggregate({
    _sum: { amount: true }
  });
  const otherExpensesCost = expensesResult._sum.amount || 0;

  const totalOperationalCost = totalFuelCost + totalMaintenanceCost + otherExpensesCost;

  return {
    vehicles: {
      total: totalVehicles,
      available: availableVehicles,
      onTrip: onTripVehicles,
      inShop: vehiclesInShop,
      fleetUtilizationPercent: Number(fleetUtilization.toFixed(2))
    },
    drivers: {
      total: totalDrivers,
      onDuty: driversOnDuty
    },
    trips: {
      pending: pendingTrips,
      active: activeTrips
    },
    costs: {
      totalFuel: totalFuelCost,
      totalMaintenance: totalMaintenanceCost,
      otherExpenses: otherExpensesCost,
      totalOperational: totalOperationalCost
    }
  };
};
