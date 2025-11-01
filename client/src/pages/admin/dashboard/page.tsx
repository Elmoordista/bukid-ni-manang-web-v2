import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp, MessageSquare, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockBookings, mockAccommodations } from "@/data/mockData";
import type { Booking, Accommodation } from "@/data/mockData";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [bookings] = useState<Booking[]>(mockBookings);
  const [accommodations] = useState<Accommodation[]>(mockAccommodations);

  const pendingBookings = bookings.filter(b => b.status === "pending" || !b.status);
  const confirmedBookings = bookings.filter(b => b.status === "confirmed");
  const totalRevenue = confirmedBookings.reduce((sum, booking) => 
    sum + (parseFloat(booking.totalAmount?.toString() || "0")), 0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.firstName || user?.email}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/login")}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-total-bookings">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-bookings">
                {bookings.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {pendingBookings.length} pending
              </p>
            </CardContent>
          </Card>
          
          <Card data-testid="card-confirmed-bookings">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-confirmed-bookings">
                {confirmedBookings.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Active reservations
              </p>
            </CardContent>
          </Card>
          
          <Card data-testid="card-revenue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-revenue">
                ₱{totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                From confirmed bookings
              </p>
            </CardContent>
          </Card>
          
          <Card data-testid="card-rooms">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-rooms">
                {accommodations.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Available rooms
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}