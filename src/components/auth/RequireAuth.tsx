import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserRole } from "@/lib/api";

export function RequireAuth({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth/login/youth");
    } else if (!isLoading && user && allowedRoles?.length) {
      if (!allowedRoles.includes(user.role)) {
        if (user.role === "club") setLocation("/club");
        else if (user.role === "admin" || user.role === "super_admin") setLocation("/admin");
        else setLocation("/dashboard");
      }
    } else if (!isLoading && user?.role === "club") {
      setLocation("/club");
    }
  }, [user, isLoading, setLocation, allowedRoles]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) return null;
  if (allowedRoles?.length && !allowedRoles.includes(user.role)) return null;
  if (user.role === "club" && !allowedRoles?.includes("club")) return null;

  return <>{children}</>;
}
