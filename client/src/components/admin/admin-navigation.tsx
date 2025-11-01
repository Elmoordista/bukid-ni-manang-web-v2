import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Leaf,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  CalendarRange,
  Home,
  CreditCard,
  Users,
  Settings,
  Bell,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { RESORT_INFO } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";

export default function AdminNavigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [pendingBookings, setPendingBookings] = useState(3);
  const [pendingPayments, setPendingPayments] = useState(2);

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "View analytics, stats & resort overview",
      onClick: () => {
        navigate("/admin");
      },
      shortcut: "Alt+D",
    },
    {
      href: "/admin/bookings",
      label: "Bookings",
      icon: CalendarRange,
      description: "Manage reservations & guest schedules",
      badge: pendingBookings ? `${pendingBookings} new` : null,
      onClick: () => {
        setPendingBookings(0);
      },
      shortcut: "Alt+B",
    },
    {
      href: "/admin/rooms",
      label: "Rooms",
      icon: Home,
      description: "Property management",
      onClick: () => {},
    },
    {
      href: "/admin/payments",
      label: "Payments",
      icon: CreditCard,
      description: "Transaction history",
      badge: pendingPayments ? `${pendingPayments} pending` : null,
      onClick: () => {
        // Reset the pending payments badge when visiting the page
        setPendingPayments(0);
      },
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
      description: "User management",
      onClick: () => {
        // Reset any user management related states
      },
      badge: null,
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
      description: "System configuration",
      badge: null,
      isSettings: true,
      onClick: () => {
        navigate("/admin/settings");
      },
    },
  ];

  const isActive = (href: string) => {
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const handleNotificationClick = () => {
    toast({
      title: `${unreadNotifications} new notifications`,
      description: "Click to view all notifications",
      action: (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            setUnreadNotifications(0);
            // Navigate to notifications page or open notifications panel
          }}
        >
          View All
        </Button>
      ),
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'd':
            navigate('/admin');
            break;
          case 'b':
            navigate('/admin/bookings');
            break;
          case 'r':
            navigate('/admin/rooms');
            break;
          case 'p':
            navigate('/admin/payments');
            break;
          case 'u':
            navigate('/admin/users');
            break;
          case 's':
            navigate('/admin/settings');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/admin" className="flex items-center space-x-4 px-2 py-1 rounded-lg hover:bg-accent/50 transition-colors group">
            <Leaf className="h-9 w-9 text-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground tracking-tight">{RESORT_INFO.name}</span>
              <span className="text-sm text-muted-foreground">Admin Dashboard</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.isSettings ? (
                <Link
                  key={item.href}
                  to={`${item.href}/general`}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors group relative`}
                >
                  <item.icon className={`h-4 w-4 ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-primary"
                  }`} />
                  <span className={`transition-colors ${
                    isActive(item.href)
                      ? "text-primary font-medium"
                      : "text-foreground group-hover:text-primary"
                  }`}>
                    {item.label}
                  </span>
                  <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground px-3 py-1.5 rounded-md text-sm transition-all duration-200 whitespace-nowrap shadow-md">
                    {item.description}
                  </div>
                </Link>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 group relative px-3 py-2 rounded-md transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-primary/10"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <item.icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-primary"
                  }`} />
                  <span className={`transition-colors ${
                    isActive(item.href)
                      ? "text-primary font-medium"
                      : "text-foreground group-hover:text-primary"
                  }`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 animate-pulse">
                      {item.badge}
                    </Badge>
                  )}
                  {item.shortcut && (
                    <span className="hidden lg:inline-block text-xs text-muted-foreground ml-2">
                      {item.shortcut}
                    </span>
                  )}
                  <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground px-3 py-1.5 rounded-md text-sm transition-all duration-200 whitespace-nowrap shadow-md">
                    {item.description}
                  </div>
                </Link>
              )
            ))}
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNotificationClick}
                className="relative group"
              >
                <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground animate-bounce">
                    {unreadNotifications}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
                <span className="absolute hidden group-hover:block bottom-[-40px] left-1/2 transform -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded shadow-lg whitespace-nowrap">
                  {unreadNotifications} new notifications
                </span>
              </Button>

              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL || ""} alt={user?.firstName || "User"} />
                      <AvatarFallback>{user?.firstName?.[0] || user?.email?.[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.firstName || user?.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden absolute left-0 right-0 top-[80px] bg-background border-t border-border transform transition-all duration-300 ${
          mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}>
          <div className="py-4 px-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
            {navItems.map((item, index) => (
              item.isSettings ? (
                <Link
                  key={item.href}
                  to={`${item.href}/general`}
                  className={`flex items-center px-2 py-2 text-sm ${
                    isActive(item.href)
                      ? "text-primary font-medium"
                      : "text-foreground hover:text-primary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.label}</span>
                </Link>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center px-2 py-2 text-sm ${
                    isActive(item.href)
                      ? "text-primary font-medium"
                      : "text-foreground hover:text-primary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            ))}
            <div className="pt-4 mt-4 border-t border-border">
              <div className="flex items-center px-2 py-2">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={user?.photoURL || ""} alt={user?.firstName || "User"} />
                  <AvatarFallback>{user?.firstName?.[0] || user?.email?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.firstName || user?.email}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </div>
              <Button 
                variant="destructive" 
                className="w-full mt-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}