import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
// import { useNotifications } from "@/hooks/use-notifications";
import { useToast } from "@/hooks/use-toast";

import HttpClient from "@/lib/axiosInstance.ts";

import CustomerBookingCard from "@/components/customer-booking-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Plus } from "lucide-react";
import {  mockAccommodations,  type Accommodation } from "@/data/mockData";

export default function MyBookings() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load static data
    // setBookings(mockBookings);
    // setBookings(mockBookings.filter(booking => booking.userId === user?.id));
    setAccommodations(mockAccommodations);
    fetchMyBookings();
  }, [user]);

  // const bookingList = bookings || [];
  const accommodationList = accommodations || [];
  console.log("Accommodation List:", accommodationList);

  // const getAccommodationName = (accommodationId: string) => {
  //   const accommodation = accommodationList.find((acc: any) => acc.id === accommodationId);
  //   return accommodation?.name;
  // };

  const fetchMyBookings = async () => {
      setIsLoading(true);

    try {
      const res = await HttpClient.get(`/front-end/get-my-bookings`);
      if(res.data){
        setBookings(res.data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load rooms.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen modern-gradient">
        
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <Calendar className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to view your bookings and manage your reservations.
            </p>
            <Link to="/login">
              <Button data-testid="button-login">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleFetchBookings = () => {
    fetchMyBookings();
  };

  return (
    <div className="min-h-screen modern-gradient">
      
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">
              Manage your reservations at Bukid ni Manang Farm & Resort
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="glass-effect border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-6">
              {bookings
                .sort((a: any, b: any) => 
                  new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                )
                .map((booking: any) => (
                  <CustomerBookingCard
                    key={booking.id}
                    booking={booking}
                    handleFetchBookings={handleFetchBookings}
                    accommodationName={''}
                    // accommodationName={getAccommodationName(booking.accommodationId)}
                  />
                ))}
            </div>
          ) : (
            <Card className="glass-effect border-0 shadow-lg text-center">
              <CardHeader>
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <CardTitle>No Bookings Yet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  You haven't made any bookings yet. Start planning your perfect getaway!
                </p>
                <Link to="/accommodations">
                  <Button data-testid="button-make-booking">
                    <Plus className="h-4 w-4 mr-2" />
                    Make Your First Booking
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center">
            <Card className="glass-effect border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Have questions about your booking or need to make changes?
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>📞 Call us:</strong> 0917 100 9766
                  </p>
                  <p className="text-sm">
                    <strong>📧 Email:</strong> reservations@bukidnimanang.com
                  </p>
                  <p className="text-sm">
                    <strong>⏰ Hours:</strong> Daily 6:00 AM - 10:00 PM
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}