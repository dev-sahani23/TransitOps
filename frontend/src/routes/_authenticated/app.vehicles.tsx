import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchVehicles, fetchMaintenance } from "@/lib/fleet-queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill, expiryBadge, currency } from "@/lib/fleet-ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Truck, Gauge, Calendar, Wrench } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/vehicles")({
  head: () => ({ meta: [{ title: "Vehicles — TransitOps" }] }),
  component: VehiclesPage,
});

function VehiclesPage() {
  const { data: vehicles = [] } = useQuery({ queryKey: ["vehicles"], queryFn: fetchVehicles });
  const { data: maint = [] } = useQuery({ queryKey: ["maintenance"], queryFn: fetchMaintenance });

  const maintByVehicle = new Map<string, number>();
  maint.forEach((m) => {
    if (m.vehicle?.id)
      maintByVehicle.set(m.vehicle.id, (maintByVehicle.get(m.vehicle.id) ?? 0) + Number(m.cost));
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Fleet registry
          </div>
          <h1 className="font-display text-3xl font-bold">Vehicles</h1>
        </div>
        <AddVehicleDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {vehicles.map((v) => (
          <Card key={v.id} className="p-4 transition-all hover:border-primary/50 hover:shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-sm font-bold truncate">{v.reg_number}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {v.make} {v.model} · {v.type}
                    </div>
                  </div>
                </div>
              </div>
              <StatusPill status={v.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Gauge className="h-3 w-3" />
                {v.odometer_km.toLocaleString()} km
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Wrench className="h-3 w-3" />
                {currency(maintByVehicle.get(v.id) ?? 0)} lifetime
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {v.capacity_kg} kg cap
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                Last srv {v.last_service_date ?? "—"}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {expiryBadge(v.insurance_expiry, "Insurance")}
              {expiryBadge(v.permit_expiry, "Permit")}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AddVehicleDialog() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const [form, setForm] = useState({
    reg_number: "",
    make: "",
    model: "",
    type: "LCV",
    capacity_kg: 1000,
  });
  const m = useMutation({
    mutationFn: async () => {
      // Mock insert delay
      await new Promise((r) => setTimeout(r, 800));
    },
    onSuccess: () => {
      toast.success("Vehicle added (Mock)");
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      setOpen(false);
      setForm({ reg_number: "", make: "", model: "", type: "LCV", capacity_kg: 1000 });
    },
    onError: (e: any) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register a vehicle</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            m.mutate();
          }}
          className="space-y-3"
        >
          <div>
            <Label>Registration</Label>
            <Input
              required
              value={form.reg_number}
              onChange={(e) => setForm({ ...form, reg_number: e.target.value.toUpperCase() })}
              placeholder="KA01AB0000"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Make</Label>
              <Input
                required
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
              />
            </div>
            <div>
              <Label>Model</Label>
              <Input
                required
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Mini Truck", "LCV", "Pickup", "Medium Truck", "Heavy Truck"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Capacity (kg)</Label>
              <Input
                type="number"
                value={form.capacity_kg}
                onChange={(e) => setForm({ ...form, capacity_kg: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={m.isPending}>
              Add vehicle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
