import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Truck, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — TransitOps" }] }),
  component: AuthPage,
});

const DEMOS = [
  { role: "Admin", email: "admin@transitops.com", password: "Password123" },
  { role: "Fleet Manager", email: "fleet@transitops.com", password: "Password123" },
  { role: "Driver", email: "driver@transitops.com", password: "Password123" },
];

function AuthPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.data.token);
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Welcome back");
      navigate({ to: "/app/dashboard" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", { name: fullName, email, password, role: "DRIVER" });

      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.data.token);
      await queryClient.invalidateQueries({ queryKey: ["session"] });

      toast.success("Account created — signing you in");
      navigate({ to: "/app/dashboard" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    // Mock Google login
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    navigate({ to: "/app/dashboard" });
  };

  const fillDemo = (d: (typeof DEMOS)[number]) => {
    setEmail(d.email);
    setPassword(d.password);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 grid-bg bg-sidebar text-sidebar-foreground overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <div className="font-display text-lg font-bold">TransitOps</div>
            <div className="text-xs text-muted-foreground">Command Center</div>
          </div>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            Every vehicle. Every driver. Every kilometer.
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Real-time dispatch, doc-expiry alerts, maintenance timelines, and expense analytics —
            one operations surface for your entire fleet.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              ["12", "Vehicles"],
              ["10", "Drivers"],
              ["4", "Live trips"],
            ].map(([n, l]) => (
              <div
                key={l}
                className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-4"
              >
                <div className="font-display text-2xl font-bold text-primary">{n}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">© TransitOps 2026</div>
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-6">
          <div className="lg:hidden mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Truck className="h-5 w-5" />
            </div>
            <div className="font-display text-lg font-bold">TransitOps</div>
          </div>
          <h2 className="font-display text-2xl font-bold">Sign in to your fleet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Access your dispatch board and vehicle registry.
          </p>

          <Button
            onClick={handleGoogle}
            disabled={loading}
            variant="outline"
            className="mt-6 w-full"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.36.61 4.61 1.8l3.45-3.45C18.02 1.35 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.62l4.02 3.12C6.28 6.6 8.9 4.75 12 4.75z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.28 1.4-1.1 2.58-2.35 3.38l3.62 2.8c2.11-1.95 3.75-4.83 3.75-8.42z"
              />
              <path
                fill="#FBBC05"
                d="M5.31 14.32c-.24-.7-.38-1.44-.38-2.32s.14-1.62.38-2.32L1.28 6.62C.48 8.23 0 10.06 0 12s.48 3.77 1.28 5.38l4.03-3.06z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.62-2.8c-1 .68-2.31 1.09-4.32 1.09-3.1 0-5.72-1.85-6.7-4.99L1.28 17.4C3.26 21.31 7.31 24 12 24z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>

          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="mt-4 space-y-3">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Sign in
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="mt-4 space-y-3">
                <div>
                  <Label>Full name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 p-3">
            <div className="text-xs font-medium text-muted-foreground">
              Demo credentials — click to fill:
            </div>
            <div className="mt-2 grid gap-1">
              {DEMOS.map((d) => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => fillDemo(d)}
                  className="flex items-center justify-between rounded px-2 py-1 text-left text-xs hover:bg-accent/20"
                >
                  <span className="font-semibold text-foreground">{d.role}</span>
                  <span className="font-mono text-muted-foreground">{d.email}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
