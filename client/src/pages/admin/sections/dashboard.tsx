import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Bed, CreditCard, Settings2, Menu } from "lucide-react";
import type { Booking } from "@/data/mockData";
import { mockBookings } from "@/data/mockData";
import { useAuth } from "@/context/auth-context";
import { RESORT_INFO } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import HttpClient from "@/lib/axiosInstance.ts";
import Notiflix from "notiflix";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([])
  const [confirmedBookings, setConfirmedBookings] = useState([])
  const [available_room, setAvailableRoom] = useState([])
  const [all_rooms_counts, setAllRoomsCounts] = useState(0)
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);

  
  const [roomAvailability, setRoomAvailability] = useState({
    kubo: { total: 5, available: 3, rate: "₱2,500" },
    gazebo: { total: 3, available: 1, rate: "₱3,500" },
    function_hall: { total: 1, available: 1, rate: "₱15,000" }
  });
  const currentDate = new Date();

  useEffect(() => {
    // Simulate API calls
    fetchDashboardData();
  }, []);
  const fetchDashboardData = async (page = 1) => {
    Notiflix.Loading.standard('Loading dashboard data...');
    try {
      const res = await HttpClient.get(`/dashboard`);
      if(res.data){
        setPendingBookings(res.data.todays_booking_pending);
        setTodayBookings(res.data.todays_booking_confirmed);
        setAllRoomsCounts(res.data.all_rooms);
        setAvailableRoom(res.data.rooms_available);
        setBookings(res.data.bookings);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
      Notiflix.Loading.remove();
    }
  };
  
  // Calculate various booking statistics
  // const pendingBookings = bookings.filter(b => b.status === "pending" || !b.status);
  // const confirmedBookings = bookings.filter(b => b.status === "confirmed");
  // const todayBookings = bookings.filter(b => {
  //   const bookingDate = new Date(b.checkInDate);
  //   return bookingDate.toDateString() === currentDate.toDateString();
  // });
  
  // Calculate revenue metrics
  const totalRevenue = confirmedBookings.reduce((sum, booking) => 
    sum + (parseFloat(booking.totalAmount?.toString() || "0")), 0
  );
  const monthlyRevenue = confirmedBookings.reduce((sum, booking) => {
    const bookingDate = new Date(booking.checkInDate);
    if (bookingDate.getMonth() === currentDate.getMonth()) {
      return sum + (parseFloat(booking.totalAmount?.toString() || "0"));
    }
    return sum;
  }, 0);

  const handleUpdateBookingStatus = async (bookingId: number, newStatus: string) => {
    Notiflix.Loading.standard('Updating booking status...');
    try {
      await HttpClient.patch(`/booking/${bookingId}`, { status: newStatus });
      // Update local state
      const updatedBookings = bookings.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      );
      setBookings(updatedBookings);
      toast({
        title: "Success",
        description: "Booking status updated successfully.",
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      Notiflix.Loading.remove();
    }
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">Welcome back, {user?.firstName || "Admin"}</h1>
        <p className="text-lg text-muted-foreground">
          Here's what's happening at {RESORT_INFO.name} today
        </p>
        <div className="mt-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/amenities')}>
            View Amenities Panel
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer" 
          onClick={() => navigate('/admin/amenities')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amenities</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage</div>
            <div className="text-sm text-muted-foreground">
              Pool & Other Amenity Bookings
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer" 
          onClick={() => navigate('/admin/bookings')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayBookings.length}</div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Confirmed Reservations</span>
              <span className="text-primary font-medium">+{pendingBookings.length} pending</span>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate('/admin/rooms')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venue Availability</CardTitle>
            <Bed className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {available_room.length} Available
            </div>
            <div className="text-sm text-muted-foreground">
              Out of {all_rooms_counts} Total Venues
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate('/admin/payments')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingBookings.length} Pending
            </div>
            <div className="text-sm text-muted-foreground">
              Total Amount: ₱{(pendingBookings.reduce((sum, booking) => 
                sum + (parseFloat(booking.total_price?.toString() || "0")), 0
              )).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Venue Information Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Venue Status</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/rooms')}>
              Manage Venues
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                </div>
              ) : bookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                     onClick={() => navigate(`/admin/bookings/${booking.id}`)}>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{booking.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                    size="sm"
                    className="ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Update booking status
                      // const updatedBookings = bookings.map(b => 
                      //   b.id === booking.id 
                      //     ? { ...b, status: b.status === 'confirmed' ? 'pending' : 'confirmed' }
                      //     : b
                      // );

                      handleUpdateBookingStatus(booking.id, booking.status === 'confirmed' ? 'pending' : 'confirmed');
                      
                    }}
                  >
                    {booking.status}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Room Availability</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/rooms')}>
              Manage Rooms
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-4">
                {available_room.map((type, data) => (
                // {Object.entries(roomAvailability).map(([type, data]) => (
                  <div 
                    key={type} 
                    className="p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer"
                    onClick={() => navigate(`/admin/rooms/${type}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">
                        {type.name}
                        {/* {type.replace('_', ' ')} */}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        data.available === 0 ? 'bg-red-100 text-red-600' : 
                        data.available < data.total / 2 ? 'bg-yellow-100 text-yellow-600' : 
                        'bg-green-100 text-green-600'
                      }`}>
                        Available
                        {/* {data.available} Available */}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Rate per day</span>
                        <span className="font-medium text-foreground">₱{type.price_per_night.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Total capacity</span>
                        <span className="font-medium text-foreground">{type.max_occupancy} units</span>
                      </div>
                    </div>
                    {/* <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          data.available === 0 ? 'bg-red-500' : 
                          data.available < data.total / 2 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${((data.total - data.available) / data.total) * 100}%` }}
                      />
                    </div> */}
                  </div>
                ))}
                <div className="flex justify-end space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/admin/rooms/settings');
                    }}
                  >
                    <Settings2 className="h-4 w-4 mr-2" />
                    Venue Settings
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>


      </div>
    </div>
  );
}