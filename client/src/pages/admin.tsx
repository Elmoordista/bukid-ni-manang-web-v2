import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import AdminNavigation from "@/components/admin/admin-navigation";
import AdminDashboard from "./admin/sections/dashboard";
import RoomManagement from "./admin/sections/rooms";
import BookingManagement from "./admin/sections/bookings";
import PaymentManagement from "./admin/sections/payments";
import UserManagement from "./admin/sections/users";
import SettingsManagement from "./admin/sections/settings";
import VenueSettings from "./admin/sections/venue";
import { Routes, Route } from 'react-router-dom';

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
        <Routes>
          <Route path="" element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings">
            <Route path="venue" element={<VenueSettings />} />
            <Route path="general" element={<SettingsManagement />} />
            <Route path="profile" element={<SettingsManagement />} />
          </Route>
          <Route path="*" element={<AdminDashboard />} />
        </Routes>
      </div>
    </div>
  );
}