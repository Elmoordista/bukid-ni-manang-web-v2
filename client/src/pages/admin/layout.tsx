import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Home,
  Settings,
  CreditCard,
  Hotel,
  LogOut,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/admin", icon: Home, label: "Dashboard" },
    { path: "/admin/reports", icon: Hotel, label: "Reports" },
    { path: "/admin/rooms", icon: Hotel, label: "Rooms" },
    { path: "/admin/bookings", icon: Calendar, label: "Bookings" },
    { path: "/admin/payments", icon: CreditCard, label: "Payments" },
    // { path: "/admin/amenities", icon: Calendar, label: "Amenities" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  const isCurrentPath = (path: string) => {
    if (path === "/admin") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-card border-r h-screen sticky top-0">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-primary">Admin Panel</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome, {user?.email}
            </p>
          </div>
          
          <nav className="flex-1 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isCurrentPath(item.path) ? "secondary" : "ghost"}
                  className="w-full justify-start mb-1"
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <div className="p-4 mt-auto border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-screen bg-background">
          <Card className="rounded-none min-h-screen">
            <div className="p-6">
              <Outlet />
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}