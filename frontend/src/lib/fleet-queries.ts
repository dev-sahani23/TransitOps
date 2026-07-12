import { api } from "./api";

// Types mapping frontend requirements to what we can extract from backend or mock
export type Vehicle = {
  id: string;
  reg_number: string;
  make: string;
  model: string;
  type: string;
  status: string;
  capacity_kg: number;
  odometer_km: number;
  last_service_date: string | null;
  insurance_expiry: string | null;
  permit_expiry: string | null;
};
export type Driver = {
  id: string;
  profile_id?: string | null;
  full_name: string;
  phone: string;
  duty_status: string;
  license_number: string;
  license_expiry: string | null;
  rating: number;
};
export type Trip = {
  id: string;
  code: string;
  status: string;
  revenue: number | null;
  scheduled_at: string;
  completed_at: string | null;
  distance_km: number | null;
  origin: string;
  destination: string;
  origin_lat: number;
  origin_lng: number;
  dest_lat: number;
  dest_lng: number;
  cargo_description: string | null;
};
export type Maintenance = {
  id: string;
  vehicle_id: string;
  service_date: string;
  cost: number;
  type: string;
  description: string;
  odometer_km?: number | null;
};
export type Expense = { id: string; category: string; amount: number; incurred_at: string; notes?: string | null };

const mockVehicles: Vehicle[] = [
  {
    id: "v1",
    reg_number: "KA01AB1234",
    make: "Tata",
    model: "Ace",
    type: "Mini Truck",
    status: "AVAILABLE",
    capacity_kg: 750,
    odometer_km: 45000,
    last_service_date: "2026-06-15",
    insurance_expiry: "2027-01-01",
    permit_expiry: "2027-01-01",
  },
  {
    id: "v2",
    reg_number: "MH12CD5678",
    make: "Ashok Leyland",
    model: "Dost",
    type: "LCV",
    status: "ON_TRIP",
    capacity_kg: 1250,
    odometer_km: 82000,
    last_service_date: "2026-05-20",
    insurance_expiry: "2026-08-15",
    permit_expiry: "2026-09-01",
  },
];

const mockDrivers: Driver[] = [
  {
    id: "d1",
    full_name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    duty_status: "ON_TRIP",
    license_number: "LIC-1234",
    license_expiry: "2028-05-10",
    rating: 4.8,
  },
];

const mockTrips: (Trip & { vehicle: Vehicle | null; driver: Driver | null })[] = [
  {
    id: "t1",
    code: "TRP-1001",
    status: "DISPATCHED",
    revenue: 15000,
    scheduled_at: "2026-07-12T08:00:00Z",
    completed_at: null,
    distance_km: 120,
    origin: "Mumbai",
    destination: "Pune",
    origin_lat: 19.076,
    origin_lng: 72.8777,
    dest_lat: 18.5204,
    dest_lng: 73.8567,
    cargo_description: null,
    vehicle: mockVehicles[1],
    driver: mockDrivers[0],
  },
  {
    id: "t2",
    code: "TRP-1000",
    status: "COMPLETED",
    revenue: 8500,
    scheduled_at: "2026-07-11T09:00:00Z",
    completed_at: "2026-07-11T14:30:00Z",
    distance_km: 85,
    origin: "Delhi",
    destination: "Noida",
    origin_lat: 28.7041,
    origin_lng: 77.1025,
    dest_lat: 28.5355,
    dest_lng: 77.391,
    cargo_description: null,
    vehicle: mockVehicles[0],
    driver: mockDrivers[0],
  },
];

const mockMaintenance: (Maintenance & { vehicle: Vehicle | null })[] = [
  {
    id: "m1",
    vehicle_id: "v2",
    service_date: "2026-07-10",
    cost: 4500,
    type: "repair",
    description: "Brake pad replacement",
    vehicle: mockVehicles[1],
  },
];

const mockExpenses: (Expense & { vehicle: Vehicle | null; trip: Trip | null })[] = [
  {
    id: "e1",
    category: "fuel",
    amount: 2500,
    incurred_at: "2026-07-12T09:30:00Z",
    vehicle: mockVehicles[1],
    trip: mockTrips[0],
  },
];

export const fleetKeys = {
  vehicles: ["vehicles"] as const,
  drivers: ["drivers"] as const,
  trips: ["trips"] as const,
  maintenance: ["maintenance"] as const,
  expenses: ["expenses"] as const,
};

// --- Mappers to bridge backend schema to frontend expectation ---
function mapVehicle(backendVehicle: any): Vehicle {
  return {
    id: backendVehicle.id,
    reg_number: backendVehicle.registrationNumber,
    make: backendVehicle.vehicleName.split(" ")[0] || "Unknown",
    model: backendVehicle.vehicleName.split(" ").slice(1).join(" ") || "Model",
    type: backendVehicle.vehicleType,
    status: backendVehicle.status.toLowerCase(), // frontend expects lowercase
    capacity_kg: backendVehicle.maximumCapacity,
    odometer_km: backendVehicle.odometer,
    last_service_date: null,
    insurance_expiry: null,
    permit_expiry: null,
  };
}

function mapDriver(backendDriver: any): Driver {
  return {
    id: backendDriver.id,
    profile_id: backendDriver.userId || null,
    full_name: backendDriver.name,
    phone: backendDriver.phone,
    duty_status: backendDriver.status.toLowerCase(),
    license_number: backendDriver.licenseNumber || "N/A",
    license_expiry: backendDriver.licenseExpiry,
    rating: backendDriver.rating ?? 4.5, // Default rating if none provided
  };
}

// --- API Calls ---

export async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    const res = await api.get("/vehicles");
    return res.data.data.vehicles.map(mapVehicle);
  } catch (error) {
    console.warn("Failed to fetch vehicles from backend, falling back to mock", error);
    return mockVehicles;
  }
}

export async function fetchDrivers(): Promise<Driver[]> {
  try {
    const res = await api.get("/drivers");
    return res.data.data.drivers.map(mapDriver);
  } catch (error) {
    console.warn("Failed to fetch drivers from backend, falling back to mock", error);
    return mockDrivers;
  }
}

// Still using mocks for the un-implemented backend routes
export async function fetchTrips() {
  return mockTrips;
}
export async function fetchMaintenance() {
  return mockMaintenance;
}
export async function fetchExpenses() {
  return mockExpenses;
}

export async function fetchDashboard() {
  try {
    const res = await api.get("/dashboard");
    return {
      vehicles: await fetchVehicles(),
      drivers: await fetchDrivers(),
      trips: mockTrips,
      expenses: mockExpenses,
      stats: res.data.data,
    };
  } catch (error) {
    console.warn("Failed to fetch dashboard from backend, falling back to mock", error);
    return {
      vehicles: mockVehicles,
      drivers: mockDrivers,
      trips: mockTrips,
      expenses: mockExpenses,
      stats: null,
    };
  }
}
