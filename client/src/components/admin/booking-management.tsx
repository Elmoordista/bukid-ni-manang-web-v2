import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { mockBookings } from "@/data/mockData";
import type { Booking } from "@/data/mockData";

interface BookingActionDialogProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  action: "confirm" | "reject";
}

function BookingActionDialog({ booking, isOpen, onClose, action }: BookingActionDialogProps) {
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { notifyBookingStatus } = useNotifications();

  const handleAction = async () => {
    setIsProcessing(true);
    try {
      // In a real app, this would be an API call
      const status = action === "confirm" ? "confirmed" : "rejected";
      const updatedBooking = {
        ...booking,
        status,
        adminNotes: notes,
        updatedAt: new Date().toISOString(),
      };

      // Update mock storage
      const index = mockBookings.findIndex(b => b.id === booking.id);
      if (index !== -1) {
        mockBookings[index] = updatedBooking;
      }

      // Send notifications
      notifyBookingStatus(booking.id, status, {
        recipientEmail: booking.guestEmail || "",
        recipientName: booking.guestName || "",
        checkInDate: booking.checkInDate || "",
        checkOutDate: booking.checkOutDate || "",
        totalAmount: booking.totalAmount || 0,
        accommodationName: "Room Booking", // TODO: Get actual room name
      });

      toast({
        title: `Booking ${status}`,
        description: `Successfully ${status} booking for ${booking.guestName}`,
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to process booking action",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "confirm" ? "Confirm Booking" : "Reject Booking"}
          </DialogTitle>
          <DialogDescription>
            {action === "confirm"
              ? "Confirm this booking and notify the guest?"
              : "Reject this booking and notify the guest of cancellation?"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Booking Details</Label>
            <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
              <p><strong>Guest:</strong> {booking.guestName}</p>
              <p><strong>Dates:</strong> {booking.checkInDate} to {booking.checkOutDate}</p>
              <p><strong>Guests:</strong> {booking.guestCount}</p>
              <p><strong>Total:</strong> ₱{booking.totalAmount?.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Admin Notes (optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={action === "confirm" ? "Any special instructions..." : "Reason for rejection..."}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant={action === "confirm" ? "default" : "destructive"}
            onClick={handleAction}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : action === "confirm" ? "Confirm Booking" : "Reject Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function BookingManagement({ booking }: { booking: Booking }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  return (
    <div className="p-4 border rounded-lg bg-card space-y-4">
      {/* Booking Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Guest</p>
          <p className="text-foreground">{booking.guestName}</p>
          <p className="text-xs text-muted-foreground">{booking.guestEmail}</p>
          <p className="text-xs text-muted-foreground">{booking.guestPhone}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Stay Duration</p>
          <p className="text-foreground">Check-in: {new Date(booking.checkInDate || "").toLocaleDateString()}</p>
          <p className="text-foreground">Check-out: {new Date(booking.checkOutDate || "").toLocaleDateString()}</p>
          <p className="text-xs text-muted-foreground">{booking.guestCount} guests</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Payment</p>
          <p className="text-foreground">₱{booking.totalAmount?.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Status: {booking.paymentStatus || "pending"}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Booking Status</p>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            booking.status === "confirmed" ? "bg-green-100 text-green-800" :
            booking.status === "rejected" ? "bg-red-100 text-red-800" :
            booking.status === "cancelled" ? "bg-gray-100 text-gray-800" :
            "bg-yellow-100 text-yellow-800"
          }`}>
            {booking.status}
          </div>
        </div>
      </div>

      {/* Special Requests */}
      {booking.specialRequests && (
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">Special Requests</p>
          <p className="text-sm text-foreground mt-1">{booking.specialRequests}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 mt-4">
        <Button
          size="sm"
          onClick={() => setIsConfirmOpen(true)}
          disabled={booking.status === "confirmed" || booking.status === "cancelled"}
        >
          Confirm
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setIsRejectOpen(true)}
          disabled={booking.status === "rejected" || booking.status === "cancelled"}
        >
          Reject
        </Button>
      </div>

      {/* Payment Details if available */}
      {booking.paymentProof && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium text-muted-foreground">Payment Information</p>
          <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
            <div>
              <p className="text-muted-foreground">Reference Number</p>
              <p>{booking.paymentProof.referenceNumber || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Sender Name</p>
              <p>{booking.paymentProof.senderName || "N/A"}</p>
            </div>
          </div>
        </div>
      )}

      <BookingActionDialog
        booking={booking}
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        action="confirm"
      />
      <BookingActionDialog
        booking={booking}
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        action="reject"
      />
    </div>
  );
}