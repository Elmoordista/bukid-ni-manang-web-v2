import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingManagementComponent from "@/components/admin/booking-management";
// import type { Booking } from "@/data/mockData";
// import { mockBookings } from "@/data/mockData";

import HttpClient from "@/lib/axiosInstance.ts";
// import { p } from "node_modules/@tanstack/query-core/build/modern/hydration-CeGZtiZv";

export default function BookingManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  // const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await HttpClient.get("/booking");
      setBookings(response.data.data);
      console.log("Fetched bookings:", response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
  const handleUpdateBooking = (bookingId: number, status: string, notes: string) => {
    // const old_bookings = [...bookings];
    // const index = old_bookings.findIndex((b: Booking) => b.id === bookingId);
    // if (index !== -1) {
    //   old_bookings[index] = { ...old_bookings[index], status, admin_notes: notes };
    //   setBookings(old_bookings);
    // }
    // Refetch bookings after update
    setBookings(previousBookings => {
      return previousBookings.map((booking: any) =>
        booking.id === bookingId ? { ...booking, status, admin_notes: notes } : booking
      );
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Booking Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingManagementComponent key={booking.id} booking={booking} handleUpdateBooking={handleUpdateBooking} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}