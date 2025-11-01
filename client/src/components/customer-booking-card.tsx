import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { Calendar, Users, Mail, Phone, MessageSquare, XCircle, AlertTriangle, CreditCard } from "lucide-react";
import type { Booking } from "@/lib/types";
import GCashPaymentForm from "./gcash-payment-form";
import PaymentStatusDisplay from "./payment-status-display";

interface CustomerBookingCardProps {
  booking: Booking;
  accommodationName?: string;
}

export default function CustomerBookingCard({ booking, accommodationName }: CustomerBookingCardProps) {
  const { toast } = useToast();
  const { notifyBookingStatus } = useNotifications();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCancelBooking = async () => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      notifyBookingStatus(booking.id, "cancelled", {
        recipientEmail: booking.guestEmail,
        recipientName: booking.guestName,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        totalAmount: booking.totalAmount,
        accommodationName: accommodationName || "Resort Booking"
      });
      
      setIsCancelDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel booking. Please contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
    }
  };

  const getStatusMessage = (status: string | null) => {
    switch (status) {
      case 'confirmed':
        return "Your booking is confirmed! Please proceed with the payment using GCash.";
      case 'rejected':
        return "Unfortunately, this booking request was not approved. Please contact us for alternative options.";
      case 'cancelled':
        return "This booking has been cancelled.";
      default:
        return "Your booking is under review. We'll notify you via email once it's approved.";
    }
  };

  const canCancel = !booking.status || ['pending', 'confirmed'].includes(booking.status);
  const canPay = booking.status === 'confirmed';

  return (
    <Card className="glass-effect border-0 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              {accommodationName || "Resort Booking"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Booking ID: {booking.id}
            </p>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            {getStatusMessage(booking.status)}
          </p>
        </div>

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
                ₱{booking.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

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

        {booking.createdAt && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Booked on: {new Date(booking.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}

        {canCancel && (
          <div className="pt-4 border-t">
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isProcessing}
                  data-testid={`button-cancel-${booking.id}`}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Booking
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                    Cancel Booking
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel this booking? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">Cancellation Policy</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Cancellations made 24+ hours in advance: Full refund</li>
                      <li>• Cancellations made less than 24 hours: 50% refund</li>
                      <li>• No-shows: No refund</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Booking Details:</strong><br />
                      {accommodationName || "Resort Booking"}<br />
                      {booking.checkInDate} to {booking.checkOutDate}<br />
                      Total: ₱{booking.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCancelDialogOpen(false)}
                    disabled={isProcessing}
                  >
                    Keep Booking
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleCancelBooking}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Cancelling..." : "Cancel Booking"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {!canCancel && booking.status !== 'cancelled' && (
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              For changes or cancellations, please contact us at 0917 100 9766
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}