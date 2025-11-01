import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Calendar, Users, Mail, Phone, MessageSquare } from "lucide-react";
import type { Booking } from "@/data/mockData";

interface BookingManagementProps {
  booking: Booking;
  accommodationName?: string;
}

export default function AdminBookingManagement({ booking, accommodationName }: BookingManagementProps) {
  const { toast } = useToast();
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateBooking = async (status: string, reason?: string) => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const statusText = status === 'confirmed' ? 'approved' : status;
      const guestName = booking.userId; // Using userId as fallback since guestName doesn't exist in mockData
      
      toast({
        title: `Booking ${statusText}`,
        description: status === 'confirmed' 
          ? `Booking has been approved and guest has been notified via email.`
          : `Booking has been rejected and guest has been notified via email.`,
      });
      
      setIsRejectDialogOpen(false);
      setRejectionReason("");
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirm = () => {
    handleUpdateBooking('confirmed');
  };

  const handleReject = () => {
    handleUpdateBooking('rejected', rejectionReason);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const isPending = !booking.status || booking.status === 'pending';

  return (
    <Card className="glass-effect border-0 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              {booking.guestName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Booking ID: {booking.id}
            </p>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Check-in:</span>
              <span className="ml-1">{booking.checkInDate}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Check-out:</span>
              <span className="ml-1">{booking.checkOutDate}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Guests:</span>
              <span className="ml-1">{booking.guestCount}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span className="ml-1 text-blue-600">{booking.guestEmail}</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Phone:</span>
              <span className="ml-1">{booking.guestPhone}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Total:</span>
              <span className="ml-1 text-green-600 font-semibold">
                ₱{(booking.totalAmount || booking.totalPrice || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {accommodationName && (
          <div className="pt-2 border-t">
            <p className="text-sm">
              <span className="font-medium">Accommodation:</span>
              <span className="ml-1">{accommodationName}</span>
            </p>
          </div>
        )}

        {booking.specialRequests && (
          <div className="pt-2 border-t">
            <div className="flex items-start text-sm">
              <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
              <div>
                <span className="font-medium">Special Requests:</span>
                <p className="text-muted-foreground mt-1">{booking.specialRequests}</p>
              </div>
            </div>
          </div>
        )}

        {isPending && (
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleConfirm}
              disabled={isUpdating}
              className="flex-1"
              data-testid={`button-approve-${booking.id}`}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isUpdating ? "Processing..." : "Approve"}
            </Button>
            
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isUpdating}
                  className="flex-1"
                  data-testid={`button-reject-${booking.id}`}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Booking</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to reject this booking? The guest will be notified via email.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rejection-reason">Reason for rejection (optional)</Label>
                    <Textarea
                      id="rejection-reason"
                      placeholder="e.g., Fully booked for those dates, maintenance scheduled, etc."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsRejectDialogOpen(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Rejecting..." : "Reject Booking"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}