import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

export function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Rooms", href: "/rooms" },
    { name: "Amenities", href: "/amenities" },
    { name: "Virtual Tour", href: "/virtual-tour" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const userNavigation = [
    { name: "My Bookings", href: "/my-bookings" },
  ];

  const isCurrentPage = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/" className="text-xl font-bold text-green-600">
                Bukid ni Manang
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 text-sm font-medium",
                    isCurrentPage(item.href)
                      ? "border-b-2 border-green-500 text-gray-900"
                      : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/my-bookings")}
                >
                  My Bookings
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
                {user?.role === "admin" && (
                  <Button
                    variant="default"
                    onClick={() => navigate("/admin")}
                  >
                    Admin Dashboard
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </>
            )}
            <Button
              variant="default"
              onClick={() => navigate("/rooms")}
              className="bg-green-600 hover:bg-green-700"
            >
              Book Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block px-3 py-2 text-base font-medium",
                  isCurrentPage(item.href)
                    ? "bg-green-50 border-l-4 border-green-500 text-green-700"
                    : "text-gray-600 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300 hover:text-gray-800"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {userNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300 hover:text-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
                {user?.role === "admin" && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    onClick={() => {
                      navigate("/admin");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Admin Dashboard
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  onClick={() => {
                    navigate("/signup");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
            <Button
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700 mt-2"
              onClick={() => {
                navigate("/rooms");
                setMobileMenuOpen(false);
              }}
            >
              Book Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}