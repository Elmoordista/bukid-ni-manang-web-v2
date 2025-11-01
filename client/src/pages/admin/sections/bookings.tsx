import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingManagementComponent from "@/components/admin/booking-management";
import type { Booking } from "@/data/mockData";
import { mockBookings } from "@/data/mockData";

export default function BookingManagement() {
  const [bookings] = useState<Booking[]>(mockBookings);

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
              <BookingManagementComponent key={booking.id} booking={booking} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}