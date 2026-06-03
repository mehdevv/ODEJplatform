import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!user) setLocation("/portal");
      else if (user.role === "club") setLocation("/club");
      else if (user.role !== "admin" && user.role !== "super_admin") {
        setLocation("/dashboard");
      }
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return null;
  }

  return <>{children}</>;
}
