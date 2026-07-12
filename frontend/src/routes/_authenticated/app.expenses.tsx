import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchExpenses, fetchVehicles, fetchTrips } from "@/lib/fleet-queries";
import { api } from "@/lib/api";
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
import { Plus, Fuel, Coins, Wrench, MoreHorizontal } from "lucide-react";
import { currency } from "@/lib/fleet-ui";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/_authenticated/app/expenses")({
  head: () => ({ meta: [{ title: "Expenses — TransitOps" }] }),
  component: ExpensesPage,
});

const CAT_ICONS: Record<string, any> = {
  fuel: Fuel,
  toll: Coins,
  repair: Wrench,
  other: MoreHorizontal,
};
const CAT_COLORS: Record<string, string> = {
  fuel: "oklch(0.78 0.18 75)",
  toll: "oklch(0.65 0.19 200)",
  repair: "oklch(0.63 0.24 28)",
  other: "oklch(0.72 0.17 155)",
};

function ExpensesPage() {
  const { data: expenses = [] } = useQuery({ queryKey: ["expenses"], queryFn: fetchExpenses });
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const byCat = ["fuel", "toll", "repair", "other"].map((c) => ({
    name: c,
    value: expenses.filter((e) => e.category === c).reduce((s, e) => s + Number(e.amount), 0),
    color: CAT_COLORS[c],
  }));

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Ledger</div>
          <h1 className="font-display text-3xl font-bold">Expenses</h1>
          <p className="text-sm text-muted-foreground">
            {expenses.length} entries · {currency(total)} total
          </p>
        </div>
        <LogExpenseDialog />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <h3 className="font-display font-bold">By category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={byCat} innerRadius={40} outerRadius={75} paddingAngle={3} dataKey="value">
                {byCat.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "oklch(0.21 0.025 250)",
                  border: "1px solid oklch(0.30 0.02 250)",
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5">
            {byCat.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 capitalize">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.color }} />
                  {c.name}
                </div>
                <span className="font-mono font-bold">{currency(c.value)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="grid grid-cols-[80px_1fr_130px_120px] gap-3 border-b border-border bg-muted/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <div>Cat</div>
            <div>Vehicle / notes</div>
            <div>Date</div>
            <div className="text-right">Amount</div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {expenses.map((e) => {
              const Icon = CAT_ICONS[e.category] ?? MoreHorizontal;
              return (
                <div
                  key={e.id}
                  className="grid grid-cols-[80px_1fr_130px_120px] gap-3 border-b border-border/50 px-4 py-2.5 text-sm items-center hover:bg-accent/5"
                >
                  <div className="flex items-center gap-1.5 text-xs capitalize">
                    <Icon className="h-3.5 w-3.5" style={{ color: CAT_COLORS[e.category] }} />
                    {e.category}
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-primary">
                      {e.vehicle?.reg_number ?? "—"}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{e.notes}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(e.incurred_at), "dd MMM · HH:mm")}
                  </div>
                  <div className="text-right font-mono font-bold">{currency(Number(e.amount))}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function LogExpenseDialog() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const { data: vehicles = [] } = useQuery({ queryKey: ["vehicles"], queryFn: fetchVehicles });
  const { data: trips = [] } = useQuery({ queryKey: ["trips"], queryFn: fetchTrips });
  const [form, setForm] = useState({
    vehicle_id: "",
    trip_id: "",
    category: "fuel",
    amount: 0,
    notes: "",
  });

  const m = useMutation({
    mutationFn: async () => {
      const payload = {
        vehicleId: form.vehicle_id,
        tripId: form.trip_id,
        category: form.category,
        amount: form.amount,
        notes: form.notes,
        date: new Date().toISOString(),
      };
      const res = await api.post("/expenses", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Expense logged");
      qc.invalidateQueries();
      setOpen(false);
      setForm({ vehicle_id: "", trip_id: "", category: "fuel", amount: 0, notes: "" });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || e.response?.data?.errors?.[0]?.message || e.message || "Failed to log expense"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          Log expense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log an expense</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            m.mutate();
          }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["fuel", "toll", "repair", "other"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              />
            </div>
          </div>
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
                    {v.reg_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Trip (optional)</Label>
            <Select value={form.trip_id} onValueChange={(v) => setForm({ ...form, trip_id: v })}>
              <SelectTrigger>
                <SelectValue placeholder="No trip" />
              </SelectTrigger>
              <SelectContent>
                {trips.slice(0, 20).map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.code} · {t.origin}→{t.destination}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Notes</Label>
            <Input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={m.isPending || !form.vehicle_id}>
              Log
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
