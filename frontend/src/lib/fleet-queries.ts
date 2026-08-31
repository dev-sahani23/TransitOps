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
  vehicle?: Vehicle | null;
  driver?: Driver | null;
};
export type Maintenance = {
  id: string;
  vehicle_id: string;
  service_date: string;
  cost: number;
  type: string;
  description: string;
  odometer_km?: number | null;
  vehicle?: Vehicle | null;
};
export type Expense = { id: string; category: string; amount: number; incurred_at: string; notes?: string | null; vehicle?: Vehicle | null; trip?: Trip | null; };

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
    status: "in_transit",
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
    status: "completed",
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
    make: backendVehicle.make || "Unknown",
    model: backendVehicle.model || "Model",
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

const CITIES: Record<string, [number, number]> = {
  Bengaluru: [12.9716, 77.5946],
  Mysuru: [12.2958, 76.6394],
  Chennai: [13.0827, 80.2707],
  Mumbai: [19.076, 72.8777],
  Pune: [18.5204, 73.8567],
  Hyderabad: [17.385, 78.4867],
  Coimbatore: [11.0168, 76.9558],
  Kochi: [9.9312, 76.2673],
  Ahmedabad: [23.0225, 72.5714],
  Surat: [21.1702, 72.8311],
  Madurai: [9.9252, 78.1198],
  Mangaluru: [12.9141, 74.856],
  Tirupati: [13.6288, 79.4192],
  Vellore: [12.9165, 79.1325],
  Hubli: [15.3647, 75.124],
  Belagavi: [15.8497, 74.4977],
  Salem: [11.6643, 78.146],
  Nashik: [19.9975, 73.7898],
};

function getCoords(cityName: string): [number, number] {
  if (CITIES[cityName]) return CITIES[cityName];
  const keys = Object.keys(CITIES);
  const hash = cityName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return CITIES[keys[hash % keys.length]];
}

export async function fetchTrips(): Promise<Trip[]> {
  try {
    const res = await api.get("/trips");
    const statusMap: Record<string, string> = {
      DRAFT: "scheduled",
      DISPATCHED: "in_transit",
      COMPLETED: "completed",
      CANCELLED: "cancelled"
    };
    return res.data.data.trips.map((backendTrip: any) => {
      const originCoords = getCoords(backendTrip.source);
      const destCoords = getCoords(backendTrip.destination);
      return {
        id: backendTrip.id,
        code: backendTrip.id.substring(0, 8).toUpperCase(),
        status: statusMap[backendTrip.status] || backendTrip.status.toLowerCase(),
        revenue: backendTrip.revenue,
        scheduled_at: backendTrip.dispatchTime || backendTrip.createdAt,
        completed_at: backendTrip.completionTime,
        distance_km: backendTrip.plannedDistance,
        origin: backendTrip.source,
        destination: backendTrip.destination,
        origin_lat: originCoords[0],
        origin_lng: originCoords[1],
        dest_lat: destCoords[0],
        dest_lng: destCoords[1],
        cargo_description: backendTrip.cargo,
        vehicle: backendTrip.vehicle ? mapVehicle(backendTrip.vehicle) : null,
        driver: backendTrip.driver ? mapDriver(backendTrip.driver) : null,
      };
    });
  } catch (error) {
    console.warn("Failed to fetch trips from backend, falling back to mock", error);
    return mockTrips;
  }
}

export async function fetchMaintenance(): Promise<Maintenance[]> {
  try {
    const res = await api.get("/maintenance");
    return res.data.data.logs.map((backendLog: any) => ({
      id: backendLog.id,
      vehicle_id: backendLog.vehicleId,
      service_date: backendLog.startDate,
      cost: backendLog.cost,
      type: backendLog.type,
      description: backendLog.description,
      odometer_km: backendLog.odometer,
      vehicle: backendLog.vehicle ? mapVehicle(backendLog.vehicle) : null,
    }));
  } catch (error) {
    console.warn("Failed to fetch maintenance from backend, falling back to mock", error);
    return mockMaintenance as unknown as Maintenance[];
  }
}

export async function fetchExpenses(): Promise<Expense[]> {
  try {
    const res = await api.get("/expenses");
    return res.data.data.expenses.map((backendExpense: any) => ({
      id: backendExpense.id,
      category: backendExpense.category,
      amount: backendExpense.amount,
      incurred_at: backendExpense.date,
      notes: backendExpense.notes,
      vehicle: backendExpense.vehicle ? mapVehicle(backendExpense.vehicle) : null,
      trip: backendExpense.trip ? { id: backendExpense.trip.id } : null,
    }));
  } catch (error) {
    console.warn("Failed to fetch expenses from backend, falling back to mock", error);
    return mockExpenses as unknown as Expense[];
  }
}

export async function fetchDashboard() {
  try {
    const res = await api.get("/dashboard");
    return {
      vehicles: await fetchVehicles(),
      drivers: await fetchDrivers(),
      trips: await fetchTrips(),
      expenses: await fetchExpenses(),
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
