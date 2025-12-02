"use client";

import { useEffect } from "react";
// import { useRouter } from "react-router-dom";
import { useNavigate  } from "react-router-dom";
import { useAuth } from "@/hooks/auth-provider";
import { toast } from "@/components/ui/use-toast";

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
    window.location.href = "/login";
      toast({
        title: "Unauthorized",
        description: "Admin access required.",
        variant: "destructive",
      });
      // router.replace("/login");
      navigate("/login", { replace: true });
      
    }
  }, [isLoading, isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}