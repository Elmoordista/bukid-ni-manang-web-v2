import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import AdminProtectedRoute from "@/components/admin/admin-protected-route";
import {
  Calendar,
  Users,
  Home,
  Settings,
  CreditCard,
  Hotel,
  LogOut,
} from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/admin", icon: Home, label: "Dashboard" },
    { path: "/admin/rooms", icon: Hotel, label: "Rooms" },
    { path: "/admin/bookings", icon: Calendar, label: "Bookings" },
    { path: "/admin/payments", icon: CreditCard, label: "Payments" },
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
    <AdminProtectedRoute>
      <div className="min-h-screen bg-background">
        <nav className="bg-card border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <span className="text-lg font-semibold text-primary">Admin Panel</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.path}
                      variant={isCurrentPath(item.path) ? "secondary" : "ghost"}
                      onClick={() => navigate(item.path)}
                      className="flex items-center"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground hidden md:inline">
                  {user?.email}
                </span>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          <div className="bg-background rounded-lg">
            <Outlet />
          </div>
        </main>
      </div>
    </AdminProtectedRoute>
  );
}