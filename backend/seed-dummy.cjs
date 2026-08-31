const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  await prisma.trip.deleteMany({
    where: { status: { in: ['DRAFT', 'DISPATCHED'] } }
  });

  const vehicles = await prisma.vehicle.findMany({ take: 5 });
  const drivers = await prisma.driver.findMany({ take: 5 });
  
  const cities = ['Bengaluru', 'Chennai', 'Mumbai', 'Pune', 'Hyderabad', 'Coimbatore'];
  
  const trips = [];
  for (let i = 0; i < 5; i++) {
    trips.push({
      vehicleId: vehicles[i].id,
      driverId: drivers[i].id,
      source: cities[i % cities.length],
      destination: cities[(i + 1) % cities.length],
      cargoWeight: 1000,
      cargo: 'Dummy Cargo',
      revenue: 5000,
      plannedDistance: 300,
      status: 'DISPATCHED',
      dispatchTime: new Date()
    });
  }
  
  await prisma.trip.createMany({ data: trips });
  console.log('Successfully added 5 moving trucks!');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
