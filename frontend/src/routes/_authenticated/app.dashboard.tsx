import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard, fleetKeys } from "@/lib/fleet-queries";
import { Card } from "@/components/ui/card";
import { currency, StatusPill } from "@/lib/fleet-ui";
import { Truck, Users, Radio, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — TransitOps" }] }),
  component: Dashboard,
});

function KpiCard({ label, value, icon: Icon, tone = "primary", sub }: any) {
  const toneMap: Record<string, string> = {
    primary: "text-primary bg-primary/10",
    accent: "text-accent bg-accent/10",
    success: "text-success bg-success/10",
    destructive: "text-destructive bg-destructive/10",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-2 font-display text-3xl font-bold">{value}</div>
            {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
          </div>
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${toneMap[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    refetchInterval: 30000,
  });

  if (isLoading || !data)
    return <div className="p-8 text-muted-foreground">Loading operations…</div>;

  const { vehicles, drivers, trips, expenses } = data;
  const activeTrips = trips.filter((t) => t.status === "in_transit").length;
  const totalVehicles = vehicles.length;
  const available = vehicles.filter((v) => v.status === "available").length;
  const inUse = vehicles.filter((v) => v.status === "in_use").length;
  const inMaint = vehicles.filter(
    (v) => v.status === "maintenance" || v.status === "out_of_service",
  ).length;
  const utilization = totalVehicles ? Math.round((inUse / totalVehicles) * 100) : 0;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthExp = expenses
    .filter((e) => new Date(e.incurred_at) >= monthStart)
    .reduce((s, e) => s + Number(e.amount), 0);
  const monthRev = trips
    .filter((t) => t.completed_at && new Date(t.completed_at) >= monthStart)
    .reduce((s, t) => s + Number(t.revenue ?? 0), 0);

  const soon = new Date();
  soon.setDate(soon.getDate() + 30);
  const expiring = [
    ...vehicles
      .filter((v) => v.insurance_expiry && new Date(v.insurance_expiry) < soon)
      .map((v) => ({ type: "Vehicle Insurance", id: v.id })),
    ...vehicles
      .filter((v) => v.permit_expiry && new Date(v.permit_expiry) < soon)
      .map((v) => ({ type: "Vehicle Permit", id: v.id })),
    ...drivers
      .filter((d) => d.license_expiry && new Date(d.license_expiry) < soon)
      .map((d) => ({ type: "Driver License", id: d.id })),
  ].length;

  const utilData = [
    { name: "In use", value: inUse, color: "oklch(0.65 0.19 200)" },
    { name: "Available", value: available, color: "oklch(0.72 0.17 155)" },
    { name: "Maintenance", value: inMaint, color: "oklch(0.78 0.18 75)" },
  ];

  // last 7 days trips
  const trend: any[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const done = trips.filter(
      (t) => t.completed_at && new Date(t.completed_at) >= d && new Date(t.completed_at) < next,
    ).length;
    const rev = trips
      .filter(
        (t) => t.completed_at && new Date(t.completed_at) >= d && new Date(t.completed_at) < next,
      )
      .reduce((s, t) => s + Number(t.revenue ?? 0), 0);
    trend.push({
      day: d.toLocaleDateString("en", { weekday: "short" }),
      trips: done,
      revenue: Math.round(rev / 1000),
    });
  }

  const costByCat = ["fuel", "toll", "repair", "other"].map((c) => ({
    name: c,
    total: expenses
      .filter((e) => e.category === c && new Date(e.incurred_at) >= monthStart)
      .reduce((s, e) => s + Number(e.amount), 0),
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Overview</div>
          <h1 className="font-display text-3xl font-bold">Command Center</h1>
        </div>
        <div className="text-xs text-muted-foreground">
          Last refreshed just now · auto-updates every 30s
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Active trips"
          value={activeTrips}
          icon={Radio}
          tone="accent"
          sub={`${trips.filter((t) => t.status === "scheduled").length} scheduled next`}
        />
        <KpiCard
          label="Fleet utilization"
          value={`${utilization}%`}
          icon={TrendingUp}
          tone="primary"
          sub={`${inUse} of ${totalVehicles} in use`}
        />
        <KpiCard
          label="Revenue this month"
          value={currency(monthRev)}
          icon={DollarSign}
          tone="success"
          sub={`${currency(monthExp)} spent`}
        />
        <KpiCard
          label="Expiring docs"
          value={expiring}
          icon={AlertTriangle}
          tone="destructive"
          sub="Insurance, permits, licenses (30d)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold">Trip trend</h3>
              <p className="text-xs text-muted-foreground">
                Completed trips & revenue (₹ thousands) — last 7 days
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.02 250)" />
              <XAxis dataKey="day" stroke="oklch(0.66 0.02 250)" fontSize={11} />
              <YAxis stroke="oklch(0.66 0.02 250)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.21 0.025 250)",
                  border: "1px solid oklch(0.30 0.02 250)",
                  borderRadius: 8,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="trips"
                stroke="oklch(0.65 0.19 200)"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="oklch(0.78 0.18 75)"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-lg font-bold">Fleet status</h3>
          <p className="text-xs text-muted-foreground">Live vehicle utilization</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={utilData}
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {utilData.map((d, i) => (
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
          <div className="mt-2 space-y-1.5">
            {utilData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                  {d.name}
                </div>
                <span className="font-mono font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <h3 className="font-display text-lg font-bold">Cost breakdown this month</h3>
          <p className="text-xs text-muted-foreground">By category (₹)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={costByCat}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.02 250)" />
              <XAxis dataKey="name" stroke="oklch(0.66 0.02 250)" fontSize={11} />
              <YAxis stroke="oklch(0.66 0.02 250)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.21 0.025 250)",
                  border: "1px solid oklch(0.30 0.02 250)",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="total" fill="oklch(0.78 0.18 75)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">Live trips</h3>
            <Link to="/app/dispatch" className="text-xs text-primary hover:underline">
              Open dispatch →
            </Link>
          </div>
          <div className="space-y-2">
            {trips
              .filter((t) => t.status === "in_transit")
              .slice(0, 5)
              .map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-border p-2.5"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold">{(t as any).origin ?? "—"}</div>
                  </div>
                  <StatusPill status={t.status} />
                </div>
              ))}
            {trips.filter((t) => t.status === "in_transit").length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                No live trips
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
