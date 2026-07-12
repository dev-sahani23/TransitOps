import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchVehicles, fetchDrivers } from "@/lib/fleet-queries";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { StatusPill, expiryBadge, currency } from "@/lib/fleet-ui";
import { ArrowLeft, MapPin, Truck, User, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/trips/new")({
  head: () => ({ meta: [{ title: "New Trip — TransitOps" }] }),
  component: NewTripPage,
});

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
const CITY_NAMES = Object.keys(CITIES);

function haversine(a: [number, number], b: [number, number]) {
  const R = 6371,
    toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]),
    dLng = toRad(b[1] - a[1]);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(s)));
}

function NewTripPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: vehicles = [] } = useQuery({ queryKey: ["vehicles"], queryFn: fetchVehicles });
  const { data: drivers = [] } = useQuery({ queryKey: ["drivers"], queryFn: fetchDrivers });

  const [origin, setOrigin] = useState("Bengaluru");
  const [destination, setDestination] = useState("Chennai");
  const [vehicleId, setVehicleId] = useState<string>("");
  const [driverId, setDriverId] = useState<string>("");
  const [scheduledAt, setScheduledAt] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [cargo, setCargo] = useState("General freight");
  const [revenue, setRevenue] = useState(25000);

  const distance = useMemo(
    () => haversine(CITIES[origin], CITIES[destination]),
    [origin, destination],
  );

  const today = new Date();
  const eligibleVehicles = vehicles.filter((v) => {
    if (v.status === "maintenance" || v.status === "out_of_service") return false;
    if (v.insurance_expiry && new Date(v.insurance_expiry) < today) return false;
    if (v.permit_expiry && new Date(v.permit_expiry) < today) return false;
    return true;
  });
  const eligibleDrivers = drivers.filter((d) => {
    if (d.duty_status === "on_trip") return false;
    if (d.license_expiry && new Date(d.license_expiry) < today) return false;
    return true;
  });
  const blockedVehicles = vehicles.length - eligibleVehicles.length;
  const blockedDrivers = drivers.length - eligibleDrivers.length;

  const create = useMutation({
    mutationFn: async () => {
      const payload = {
        vehicleId,
        driverId,
        source: origin,
        destination,
        cargoWeight: 0,
        cargo,
        revenue,
        plannedDistance: distance,
        status: "DISPATCHED",
        dispatchTime: new Date(scheduledAt).toISOString(),
      };
      const res = await api.post("/trips", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Trip scheduled");
      qc.invalidateQueries();
      navigate({ to: "/app/dispatch" });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data?.errors?.[0]?.message || e.message || "Failed to schedule trip"),
  });

  const canSubmit = origin !== destination && vehicleId && driverId;

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-4 flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/app/dispatch">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">New assignment</div>
        <h1 className="font-display text-3xl font-bold">Dispatch a Trip</h1>
        <p className="text-sm text-muted-foreground">
          Business rules are enforced — only compliant vehicles and drivers are shown.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6 space-y-5">
          <div>
            <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
              Route
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-end gap-3">
              <div>
                <Label>Origin</Label>
                <Select value={origin} onValueChange={setOrigin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CITY_NAMES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mx-auto mb-2 text-muted-foreground">→</div>
              <div>
                <Label>Destination</Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CITY_NAMES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> Approx {distance} km · direct-line estimate
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                Vehicle ({eligibleVehicles.length} eligible)
              </Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleVehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      <span className="font-mono">{v.reg_number}</span> · {v.make} {v.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {blockedVehicles > 0 && (
                <div className="mt-1.5 text-[11px] text-destructive/80">
                  🚫 {blockedVehicles} hidden (maintenance / expired docs)
                </div>
              )}
            </div>
            <div>
              <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                Driver ({eligibleDrivers.length} available)
              </Label>
              <Select value={driverId} onValueChange={setDriverId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleDrivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.full_name} · ★{d.rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {blockedDrivers > 0 && (
                <div className="mt-1.5 text-[11px] text-destructive/80">
                  🚫 {blockedDrivers} hidden (on trip / expired license)
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Scheduled at</Label>
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>
            <div>
              <Label>Cargo</Label>
              <Input value={cargo} onChange={(e) => setCargo(e.target.value)} />
            </div>
            <div>
              <Label>Revenue (₹)</Label>
              <Input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              size="lg"
              disabled={!canSubmit || create.isPending}
              onClick={() => create.mutate()}
            >
              Schedule trip →
            </Button>
          </div>
        </Card>

        <Card className="p-5 h-fit">
          <h3 className="font-display font-bold">Business rules</h3>
          <p className="text-xs text-muted-foreground">Automatically enforced at insert time.</p>
          <ul className="mt-3 space-y-2 text-xs">
            {[
              "Vehicle must not be in maintenance",
              "Vehicle insurance must be valid",
              "Vehicle permit must be valid",
              "Driver license must be valid",
              "Driver cannot be on another trip",
            ].map((r) => (
              <li key={r} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg bg-muted/40 p-3 text-xs">
            <div className="text-muted-foreground">Preview</div>
            <div className="mt-1 flex items-center gap-1 font-semibold">
              <span>{origin}</span>
              <span className="text-muted-foreground">→</span>
              <span>{destination}</span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              {distance} km · {currency(revenue)}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
