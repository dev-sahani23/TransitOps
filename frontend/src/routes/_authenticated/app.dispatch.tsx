import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchTrips, fetchVehicles, fetchDrivers } from "@/lib/fleet-queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusPill, currency } from "@/lib/fleet-ui";
import { LiveMap } from "@/components/live-map";
import { Radio, Plus, MapPin, User, Truck as TruckIcon, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/app/dispatch")({
  head: () => ({ meta: [{ title: "Dispatch — TransitOps" }] }),
  component: DispatchPage,
});

function DispatchPage() {
  const qc = useQueryClient();
  const { data: trips = [] } = useQuery({ queryKey: ["trips"], queryFn: fetchTrips });
  useQuery({ queryKey: ["vehicles"], queryFn: fetchVehicles });
  useQuery({ queryKey: ["drivers"], queryFn: fetchDrivers });

  useEffect(() => {
    // Mock realtime updates are disabled in this prototype
  }, [qc]);

  const cols = [
    { key: "scheduled", label: "Scheduled", icon: Clock },
    { key: "in_transit", label: "In Transit", icon: Radio },
    { key: "completed", label: "Completed", icon: MapPin },
  ] as const;

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Live operations
          </div>
          <h1 className="font-display text-3xl font-bold">Dispatch Center</h1>
        </div>
        <Button asChild>
          <Link to="/app/trips/new">
            <Plus className="mr-1 h-4 w-4" />
            New Trip
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-3 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Live map</div>
              <div className="text-sm font-semibold">
                {trips.filter((t) => t.status === "in_transit").length} active vehicles
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-success">
              <span className="signal-pulse h-2 w-2 rounded-full bg-success" /> Realtime
            </div>
          </div>
          <div className="h-[560px]">
            <LiveMap trips={trips.filter((t) => t.status === "in_transit")} />
          </div>
        </Card>

        <Card className="xl:col-span-2 flex flex-col overflow-hidden p-0">
          <Tabs defaultValue="in_transit" className="flex h-[600px] flex-col">
            <TabsList className="mx-4 mt-3 grid grid-cols-3">
              {cols.map((c) => (
                <TabsTrigger key={c.key} value={c.key} className="text-xs">
                  {c.label}{" "}
                  <span className="ml-1 font-mono">
                    {trips.filter((t) => t.status === c.key).length}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            {cols.map((c) => (
              <TabsContent key={c.key} value={c.key} className="mt-0 flex-1 overflow-y-auto p-3">
                <div className="space-y-2">
                  {trips
                    .filter((t) => t.status === c.key)
                    .map((t) => (
                      <TripCard key={t.id} trip={t} />
                    ))}
                  {trips.filter((t) => t.status === c.key).length === 0 && (
                    <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      No {c.label.toLowerCase()} trips
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

function TripCard({ trip }: { trip: any }) {
  const started = trip.started_at
    ? formatDistanceToNow(new Date(trip.started_at), { addSuffix: true })
    : null;
  const sched = formatDistanceToNow(new Date(trip.scheduled_at), { addSuffix: true });
  return (
    <motion.div layout initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-3 hover:border-primary/50 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground">{trip.code}</span>
              <StatusPill status={trip.status} />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold">
              <span className="truncate">{trip.origin}</span>
              <span className="text-muted-foreground">→</span>
              <span className="truncate">{trip.destination}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs font-bold text-primary">{currency(trip.revenue)}</div>
            <div className="text-[10px] text-muted-foreground">{trip.distance_km} km</div>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {trip.driver && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {trip.driver.full_name}
            </span>
          )}
          {trip.vehicle && (
            <span className="flex items-center gap-1">
              <TruckIcon className="h-3 w-3" />
              {trip.vehicle.reg_number}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {started ?? sched}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
