import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, Menu, X, LogIn, UserPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { RESORT_INFO } from "@/lib/constants";

interface NavigationProps {
  adminMode?: boolean;
}

export default function Navigation({ adminMode = false }: NavigationProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();

  const userNavItems = [
    { href: "/home", label: "Home" },
    { href: "/accommodations", label: "Rooms" },
    { href: "/amenities", label: "Amenities" },
    { href: "/virtual-tour", label: "Virtual Tour" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  const adminNavItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/bookings", label: "Bookings" },
    { href: "/admin/rooms", label: "Rooms" },
    { href: "/admin/payments", label: "Payments" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/settings", label: "Settings" },
  ].filter(() => user?.role === "admin");

  const navItems = adminMode ? adminNavItems : userNavItems;

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  // Redirect non-admin users away from admin pages
  useEffect(() => {
    if (adminMode && user?.role !== "admin") {
      window.location.href = "/home";
    }
  }, [adminMode, user]);

  return (
    <nav className="nav-header w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to={adminMode ? "/admin" : "/home"} 
            className="flex items-center space-x-3" 
            data-testid={adminMode ? "link-admin" : "link-home"}
          >
            <Leaf className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">{RESORT_INFO.name}</span>
              {adminMode && <span className="text-sm text-muted-foreground">Admin Panel</span>}
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`transition-colors ${
                  isActive(item.href)
                    ? "text-primary font-medium"
                    : "text-foreground hover:text-primary"
                }`}
                data-testid={`link-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                {item.label}
              </Link>
            ))}
            {adminMode ? (
              <Button 
                variant="destructive" 
                onClick={async () => {
                  await logout();
                  window.location.href = "/login";
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              ) : !loading && !isAuthenticated && !adminMode ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" data-testid="button-login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button data-testid="button-register">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {user?.role === 'admin' ? (
                  <Link to="/admin">
                    <Button variant="outline" data-testid="button-admin">
                      Admin Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/my-bookings">
                      <Button variant="outline" data-testid="button-my-bookings">
                        My Bookings
                      </Button>
                    </Link>
                    <Link to="/accommodations">
                      <Button data-testid="button-book-now">Book Now</Button>
                    </Link>
                  </>
                )}
                <Button 
                  variant="destructive" 
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-2 py-2 transition-colors ${
                    isActive(item.href)
                      ? "text-primary font-medium"
                      : "text-foreground hover:text-primary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-link-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  {item.label}
                </Link>
              ))}
              {adminMode ? (
                <Button 
                  variant="destructive" 
                  className="w-full mt-4"
                  onClick={async () => {
                    await logout();
                    window.location.href = "/login";
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : !loading && !isAuthenticated && !adminMode ? (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full" data-testid="mobile-button-login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" data-testid="mobile-button-register">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Register
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full" data-testid="mobile-button-my-bookings">
                      My Bookings
                    </Button>
                  </Link>
                  {!adminMode && (
                    <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full" data-testid="mobile-button-book-now">
                        Book Now
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={async () => {
                      await logout();
                      window.location.href = "/login";
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
