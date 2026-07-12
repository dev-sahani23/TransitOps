import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMaintenance, fetchVehicles } from "@/lib/fleet-queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Wrench, Plus, Calendar } from "lucide-react";
import { currency } from "@/lib/fleet-ui";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/app/maintenance")({
  head: () => ({ meta: [{ title: "Maintenance — TransitOps" }] }),
  component: MaintenancePage,
});

function MaintenancePage() {
  const { data: records = [] } = useQuery({ queryKey: ["maintenance"], queryFn: fetchMaintenance });
  const total = records.reduce((s, r) => s + Number(r.cost), 0);

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Service history
          </div>
          <h1 className="font-display text-3xl font-bold">Maintenance</h1>
          <p className="text-sm text-muted-foreground">
            {records.length} records · {currency(total)} spent all-time
          </p>
        </div>
        <AddMaintenanceDialog />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-[110px_1fr_120px_120px_120px] gap-3 border-b border-border bg-muted/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <div>Date</div>
          <div>Vehicle & work</div>
          <div>Type</div>
          <div>Odometer</div>
          <div className="text-right">Cost</div>
        </div>
        {records.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-[110px_1fr_120px_120px_120px] gap-3 border-b border-border/50 px-4 py-3 text-sm items-center hover:bg-accent/5"
          >
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3 w-3" />
              {format(new Date(r.service_date), "dd MMM")}
            </div>
            <div className="min-w-0">
              <div className="font-mono text-xs text-primary">{r.vehicle?.reg_number}</div>
              <div className="text-sm truncate">{r.description}</div>
            </div>
            <div className="text-xs capitalize">{r.type}</div>
            <div className="text-xs font-mono">{r.odometer_km?.toLocaleString() ?? "—"} km</div>
            <div className="text-right font-mono font-bold">{currency(Number(r.cost))}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function AddMaintenanceDialog() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const { data: vehicles = [] } = useQuery({ queryKey: ["vehicles"], queryFn: fetchVehicles });
  const [form, setForm] = useState({
    vehicle_id: "",
    type: "scheduled",
    description: "",
    cost: 0,
    odometer_km: 0,
  });

  const m = useMutation({
    mutationFn: async () => {
      // Mock insert delay
      await new Promise((r) => setTimeout(r, 800));
    },
    onSuccess: () => {
      toast.success("Maintenance logged");
      qc.invalidateQueries();
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          Log service
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a service record</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            m.mutate();
          }}
          className="space-y-3"
        >
          <div>
            <Label>Vehicle</Label>
            <Select
              value={form.vehicle_id}
              onValueChange={(v) => setForm({ ...form, vehicle_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.reg_number} — {v.make} {v.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["scheduled", "repair", "inspection", "tire", "other"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cost (₹)</Label>
              <Input
                type="number"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Odometer (km)</Label>
            <Input
              type="number"
              value={form.odometer_km}
              onChange={(e) => setForm({ ...form, odometer_km: Number(e.target.value) })}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={m.isPending || !form.vehicle_id}>
              Save record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
