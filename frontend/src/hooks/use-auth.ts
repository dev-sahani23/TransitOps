import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type AppRole = "ADMIN" | "FLEET_MANAGER" | "DRIVER" | "SAFETY_OFFICER" | "FINANCIAL_ANALYST";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return null;

      try {
        const response = await api.get("/auth/profile");
        return response.data.data;
      } catch (error) {
        localStorage.removeItem("token");
        return null;
      }
    },
    staleTime: 0,
  });
}

export function useMyRoles() {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["my-roles", session?.role],
    queryFn: async () => {
      return session?.role ? ([session.role] as AppRole[]) : [];
    },
    enabled: !!session,
  });
}

export function useProfile() {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["profile", session?.id],
    queryFn: async () => {
      return session;
    },
    enabled: !!session,
  });
}

export function hasRole(roles: AppRole[] | undefined, want: AppRole) {
  return !!roles?.includes(want);
}
