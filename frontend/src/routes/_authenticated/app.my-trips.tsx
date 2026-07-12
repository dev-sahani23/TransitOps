import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTrips, fetchDrivers } from "@/lib/fleet-queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill, currency } from "@/lib/fleet-ui";
import { useSession } from "@/hooks/use-auth";
import { toast } from "sonner";
import { PlayCircle, CheckCircle2, MapPin, Truck, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_authenticated/app/my-trips")({
  head: () => ({ meta: [{ title: "My Trips — TransitOps" }] }),
  component: MyTripsPage,
});

function MyTripsPage() {
  const qc = useQueryClient();
  const { data: user } = useSession();
  const { data: drivers = [] } = useQuery({ queryKey: ["drivers"], queryFn: fetchDrivers });
  const { data: trips = [] } = useQuery({ queryKey: ["trips"], queryFn: fetchTrips });
  const myDriver = drivers.find((d) => d.profile_id === user?.id);
  const myTrips = trips.filter((t) => t.driver?.id === myDriver?.id);

  const updateStatus = useMutation({
    mutationFn: async ({
      tripId,
      status,
    }: {
      tripId: string;
      status: "in_transit" | "completed";
    }) => {
      const patch: any = { status };
      if (status === "in_transit") patch.started_at = new Date().toISOString();
      if (status === "completed") patch.completed_at = new Date().toISOString();
      // Mock update delay
      await new Promise((r) => setTimeout(r, 800));
    },
    onSuccess: () => {
      toast.success("Trip updated");
      qc.invalidateQueries();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Driver view</div>
        <h1 className="font-display text-3xl font-bold">My Trips</h1>
        {!myDriver && (
          <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            Your account isn't linked to a driver record yet. Ask an admin to assign one.
          </div>
        )}
      </div>

      {myTrips.length === 0 && myDriver && (
        <Card className="p-8 text-center">
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
          <div className="mt-3 font-semibold">No trips assigned yet</div>
          <div className="text-sm text-muted-foreground">
            Your dispatcher will assign work soon.
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {myTrips.map((t) => (
          <Card key={t.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{t.code}</span>
                  <StatusPill status={t.status} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 font-display text-xl font-bold">
                  <span>{t.origin}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span>{t.destination}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    {t.vehicle?.reg_number ?? "—"}
                  </span>
                  <span>{t.distance_km} km</span>
                  <span>{currency(Number(t.revenue ?? 0))}</span>
                  <span>
                    Scheduled {formatDistanceToNow(new Date(t.scheduled_at), { addSuffix: true })}
                  </span>
                </div>
                {t.cargo_description && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Cargo: {t.cargo_description}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {t.status === "scheduled" && (
                  <Button
                    onClick={() => updateStatus.mutate({ tripId: t.id, status: "in_transit" })}
                  >
                    <PlayCircle className="mr-1 h-4 w-4" />
                    Start trip
                  </Button>
                )}
                {t.status === "in_transit" && (
                  <Button
                    onClick={() => updateStatus.mutate({ tripId: t.id, status: "completed" })}
                    variant="secondary"
                  >
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
