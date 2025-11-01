import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./sections/dashboard";
import RoomManagement from "./sections/rooms";
import BookingManagement from "./sections/bookings";
import PaymentManagement from "./sections/payments";
import UserManagement from "./sections/users";
import SettingsManagement from "./sections/settings";
import AdminNavigation from "@/components/admin/admin-navigation";

export default function AdminRoutes() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<SettingsManagement />} />
        </Routes>
      </div>
    </div>
  );
}