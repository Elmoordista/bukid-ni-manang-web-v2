import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/auth-provider";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CalendarDays,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";

export default function AdminNavigation() {
  const { logout } = useAuth();

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">BM</span>
              </div>
              <span className="font-semibold text-foreground">Admin Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/admin/dashboard">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            
            <Link to="/admin/bookings">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>Bookings</span>
              </Button>
            </Link>
            
            <Link to="/admin/payments">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Payments</span>
              </Button>
            </Link>

            <Link to="/admin/amenities">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>Amenities</span>
              </Button>
            </Link>
            
            <Link to="/admin/settings">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}