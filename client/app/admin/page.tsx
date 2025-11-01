"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import AdminProtectedRoute from "@/components/admin/admin-protected-route";
import Admin from "@/pages/admin";
import Navigation from "@/components/navigation";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        toast({
          title: "Unauthorized",
          description: "This page is only accessible to administrators.",
          variant: "destructive",
        });
        router.push("/");
      }
    }
  }, [user, loading, router, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <>
      <AdminProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navigation adminMode />
          <Admin />
        </div>
      </AdminProtectedRoute>
    </>
  );
}