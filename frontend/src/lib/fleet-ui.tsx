import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function statusColor(s: string) {
  switch (s) {
    case "available":
    case "on_duty":
    case "completed":
      return "bg-success/20 text-success border-success/40";
    case "in_use":
    case "on_trip":
    case "in_transit":
      return "bg-accent/20 text-accent border-accent/40";
    case "maintenance":
    case "scheduled":
      return "bg-primary/20 text-primary border-primary/40";
    case "off_duty":
      return "bg-muted text-muted-foreground border-border";
    case "out_of_service":
    case "cancelled":
      return "bg-destructive/20 text-destructive border-destructive/40";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function StatusPill({ status, className }: { status: string; className?: string }) {
  const label = status.replace(/_/g, " ");
  return (
    <Badge
      variant="outline"
      className={cn(
        "border font-medium uppercase tracking-wide text-[10px]",
        statusColor(status),
        className,
      )}
    >
      {label}
    </Badge>
  );
}

export function currency(n: number | null | undefined) {
  if (n == null) return "₹0";
  return "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function daysUntil(iso: string | null | undefined) {
  if (!iso) return null;
  const d = Math.round((new Date(iso).getTime() - Date.now()) / 86400000);
  return d;
}

export function expiryBadge(iso: string | null | undefined, label: string) {
  const d = daysUntil(iso);
  if (d == null) return null;
  const tone = d < 0 ? "destructive" : d < 30 ? "warning" : "muted";
  const map: Record<string, string> = {
    destructive: "bg-destructive/15 text-destructive border-destructive/40",
    warning: "bg-primary/15 text-primary border-primary/40",
    muted: "bg-muted text-muted-foreground border-border",
  };
  const txt =
    d < 0
      ? `${label} expired ${Math.abs(d)}d ago`
      : d < 30
        ? `${label} in ${d}d`
        : `${label} in ${d}d`;
  return (
    <Badge variant="outline" className={cn("text-[10px]", map[tone])}>
      {txt}
    </Badge>
  );
}
