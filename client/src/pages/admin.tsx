import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import AdminNavigation from "@/components/admin/admin-navigation";
import AmenityBookingsPanel from "@/components/admin/amenity-bookings";

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Dev bypass: allow viewing the amenities panel directly at /admin/amenities when running locally
  if (import.meta.env.DEV && location.pathname.startsWith('/admin/amenities')) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AmenityBookingsPanel />
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/login");
      return;
    }
    // Redirect to dashboard if on /admin exact path
    if (location.pathname === "/admin" && !location.search && !location.hash) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, loading, user, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  );
}