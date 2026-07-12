import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchDrivers, fetchTrips } from "@/lib/fleet-queries";
import { Card } from "@/components/ui/card";
import { StatusPill, expiryBadge } from "@/lib/fleet-ui";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Star, ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import DriverForm from "@/components/ui/DriverForm";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app/drivers")({
  head: () => ({ meta: [{ title: "Drivers — TransitOps" }] }),
  component: DriversPage,
});

function DriversPage() {
  const [openDriverForm, setOpenDriverForm] = useState(false);
  const { data: drivers = [] } = useQuery({ queryKey: ["drivers"], queryFn: fetchDrivers });
  const { data: trips = [] } = useQuery({ queryKey: ["trips"], queryFn: fetchTrips });
  const liveByDriver = new Map<string, any>();
  trips
    .filter((t) => t.status === "in_transit")
    .forEach((t) => {
      if (t.driver?.id) liveByDriver.set(t.driver.id, t);
    });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between">
  <div>
    <div className="text-xs uppercase tracking-wider text-muted-foreground">
      Team
    </div>

    <h1 className="font-display text-3xl font-bold">
      Drivers
    </h1>

    <p className="text-sm text-muted-foreground">
      {drivers.length} drivers ·{" "}
      {drivers.filter((d) => d.duty_status === "on_trip").length} currently on trip
    </p>
  </div>

  <Button
  className="bg-primary text-black hover:bg-primary/90 rounded-xl"
  onClick={() => setOpenDriverForm(true)}
>
  <Plus className="mr-2 h-4 w-4" />
  Driver
</Button>
</div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {drivers.map((d) => {
          const trip = liveByDriver.get(d.id);
          const initials = d.full_name
            .split(" ")
            .map((s) => s[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          return (
            <Card key={d.id} className="p-4 transition-all hover:border-primary/50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className="bg-accent/20 text-accent font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{d.full_name}</div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="font-mono">{d.license_number}</span>
                    </div>
                  </div>
                </div>
                <StatusPill status={d.duty_status} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                {d.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {d.phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  {d.rating}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {expiryBadge(d.license_expiry, "License")}
              </div>
              {trip && (
                <div className="mt-3 rounded-lg border border-accent/40 bg-accent/10 p-2.5 text-xs">
                  <div className="text-[10px] uppercase tracking-wider text-accent">
                    On the road
                  </div>
                  <div className="mt-1 flex items-center gap-1 font-semibold">
                    <span className="truncate">{trip.origin}</span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="truncate">{trip.destination}</span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      <DriverForm
  open={openDriverForm}
  onOpenChange={setOpenDriverForm}
/>
    </div>
  );
}
