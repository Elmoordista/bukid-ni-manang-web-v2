import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, Menu, X, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { RESORT_INFO } from "@/lib/constants";

export function MainNav() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/virtual-tour", label: "Virtual Tour" },
    { href: "/accommodations", label: "Rooms" },
    { href: "/amenities", label: "Amenities" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="w-full">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="flex items-center space-x-3" data-testid="link-home">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">{RESORT_INFO.name}</span>
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
            {!isLoading && !isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" data-testid="button-login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button data-testid="button-register">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {user?.role === 'admin' ? (
                  // Admin: show admin area links only
                  <Link to="/admin">
                    <Button variant="outline" data-testid="button-admin">
                      Admin Dashboard
                    </Button>
                  </Link>
                ) : (
                  // Regular authenticated user
                  <>
                    <Link to="/my-bookings">
                      <Button variant="outline" data-testid="button-my-bookings">
                        My Bookings
                      </Button>
                    </Link>
                  </>
                )}
                <Button variant="ghost" onClick={logout} data-testid="button-logout">
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
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' ? (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full" variant="outline">Admin Dashboard</Button>
                    </Link>
                  ) : (
                    <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full" variant="outline">My Bookings</Button>
                    </Link>
                  )}
                  <Button className="w-full" variant="ghost" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" variant="ghost">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}