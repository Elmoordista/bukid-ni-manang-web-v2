import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import type { Booking } from "@/data/mockData";
import { mockBookings, mockAccommodations, mockUsers } from "@/data/mockData";

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setBookings(mockBookings);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getUserById = (userId: string) => {
    return mockUsers.find(user => user.id === userId) || { firstName: 'Unknown', lastName: 'User', email: 'unknown@email.com' };
  };

  const getAccommodationById = (accommodationId: string) => {
    return mockAccommodations.find(acc => acc.id === accommodationId) || { name: 'Unknown Accommodation' };
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      cancelled: "destructive",
      completed: "outline",
    };

    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Accommodation</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  {booking.id.slice(0, 8)}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{getUserById(booking.userId).firstName} {getUserById(booking.userId).lastName}</div>
                    <div className="text-sm text-muted-foreground">{getUserById(booking.userId).email}</div>
                  </div>
                </TableCell>
                <TableCell>{getAccommodationById(booking.accommodationId).name}</TableCell>
                <TableCell>{format(new Date(booking.checkIn), "MMM d, yyyy")}</TableCell>
                <TableCell>{format(new Date(booking.checkOut), "MMM d, yyyy")}</TableCell>
                <TableCell>₱{booking.totalPrice.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                    {booking.status === "pending" && (
                      <>
                        <Button size="sm" variant="default">
                          <CheckCircle className="w-4 h-4 mr-1" /> Confirm
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}