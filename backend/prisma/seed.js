const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Clean existing data
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash Password
  const hashedPassword = await bcrypt.hash('Password123', 12);

  // 3. Create Users
  const users = await prisma.user.createMany({
    data: [
      { name: 'Admin User', email: 'admin@transitops.com', password: hashedPassword, role: 'ADMIN' },
      { name: 'Fleet Manager', email: 'fleet@transitops.com', password: hashedPassword, role: 'FLEET_MANAGER' },
      { name: 'Driver User', email: 'driver@transitops.com', password: hashedPassword, role: 'DRIVER' },
      { name: 'Safety Officer', email: 'safety@transitops.com', password: hashedPassword, role: 'SAFETY_OFFICER' },
      { name: 'Finance Analyst', email: 'finance@transitops.com', password: hashedPassword, role: 'FINANCIAL_ANALYST' },
    ],
  });
  console.log('Users seeded');

  // 4. Create Vehicles
  const vehicles = [];
  for (let i = 1; i <= 10; i++) {
    const v = await prisma.vehicle.create({
      data: {
        registrationNumber: `TRK-${1000 + i}`,
        vehicleName: `Volvo FH ${i}`,
        vehicleType: i % 3 === 0 ? 'Bus' : i % 2 === 0 ? 'Van' : 'Truck',
        maximumCapacity: 15000 + (i * 1000),
        odometer: 10000 + (i * 5000),
        acquisitionCost: 120000 + (i * 5000),
        status: i % 4 === 0 ? 'IN_SHOP' : i % 3 === 0 ? 'ON_TRIP' : 'AVAILABLE',
      },
    });
    vehicles.push(v);
  }
  console.log('Vehicles seeded');

  // 5. Create Drivers
  const drivers = [];
  for (let i = 1; i <= 8; i++) {
    const d = await prisma.driver.create({
      data: {
        name: `Driver ${i}`,
        licenseNumber: `LIC-${5000 + i}`,
        licenseCategory: 'HC',
        licenseExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
        phone: `+1-555-010${i}`,
        safetyScore: 90 + i,
        status: i % 3 === 0 ? 'ON_TRIP' : i % 4 === 0 ? 'OFF_DUTY' : 'AVAILABLE',
      },
    });
    drivers.push(d);
  }
  console.log('Drivers seeded');

  // 6. Create Trips
  const trips = [];
  for (let i = 0; i < 15; i++) {
    const isCompleted = i < 5;
    const isDispatched = i >= 5 && i < 10;
    
    const t = await prisma.trip.create({
      data: {
        vehicleId: vehicles[i % vehicles.length].id,
        driverId: drivers[i % drivers.length].id,
        source: `City ${i}`,
        destination: `City ${i + 1}`,
        cargoWeight: 5000 + (i * 500),
        plannedDistance: 200 + (i * 50),
        status: isCompleted ? 'COMPLETED' : isDispatched ? 'DISPATCHED' : 'DRAFT',
        dispatchTime: isCompleted || isDispatched ? new Date() : null,
        completionTime: isCompleted ? new Date() : null,
      },
    });
    trips.push(t);
  }
  console.log('Trips seeded');

  // 7. Create Maintenance Logs
  for (let i = 0; i < 5; i++) {
    await prisma.maintenanceLog.create({
      data: {
        vehicleId: vehicles[i].id,
        description: `Routine Service ${i}`,
        cost: 500 + (i * 100),
        status: 'COMPLETED',
        startDate: new Date(),
        endDate: new Date(),
      },
    });
  }
  console.log('Maintenance Logs seeded');

  // 8. Create Fuel Logs
  for (let i = 0; i < 10; i++) {
    await prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[i % vehicles.length].id,
        tripId: trips[i % trips.length].id,
        liters: 100 + (i * 10),
        cost: 300 + (i * 20),
        date: new Date(),
      },
    });
  }
  console.log('Fuel Logs seeded');

  // 9. Create Expenses
  for (let i = 0; i < 8; i++) {
    await prisma.expense.create({
      data: {
        vehicleId: vehicles[i].id,
        type: i % 2 === 0 ? 'Tolls' : 'Parking',
        amount: 50 + (i * 5),
        date: new Date(),
      },
    });
  }
  console.log('Expenses seeded');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
