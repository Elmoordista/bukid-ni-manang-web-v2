import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PaymentForm } from "./payment-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { type Accommodation } from "@/data/mockData";
import { useAuth } from "@/context/auth-context";

import HttpClient from "@/lib/axiosInstance.ts";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Accommodation | null;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

interface BookingFormData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  specialRequests: string;
  paymentMethod?: string;
  paymentReference?: string;
  paymentAccountName?: string;
  accommodationId?: string;
  userId?: string;
  totalAmount?: number;
  status?: string;
}

export default function BookingModal({ isOpen, onClose, room, checkIn = "", checkOut = "", guests = "1" }: BookingModalProps) {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    guestName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "",
    guestEmail: user?.email || "",
    guestPhone: "",
    checkInDate: checkIn,
    checkOutDate: checkOut,
    guestCount: parseInt(guests.split(" ")[0]) || 1,
    specialRequests: "",
  });

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const checkInDate = new Date(formData.checkInDate);
    const checkOutDate = new Date(formData.checkOutDate);
    return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!room) return 0;
    const nights = calculateNights();
    return room.price_per_night * nights; // Use 'price' instead of 'pricePerNight'
  };

  const handleCreateBooking = async (data: BookingFormData) => {
    if (!room) {
      toast({
        title: "Error",
        description: "No room selected",
        variant: "destructive"
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign up or log in to make a booking.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Validate availability
      // const available = await checkAvailability(room.id, data.checkInDate, data.checkOutDate);
      //check if the date is valid and start date is before end date
      const start = new Date(data.checkInDate).getTime();
      const end = new Date(data.checkOutDate).getTime();
      if (start >= end) {
        toast({ title: "Invalid Dates", description: "Check-in date must be before check-out date.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      // Create booking in mock storage
      // const created = await createBooking({
      //   accommodationId: room.id,
      //   userId: user?.id || '0',
      //   checkInDate: data.checkInDate,
      //   checkOutDate: data.checkOutDate,
      //   guestCount: data.guestCount,
      //   guestName: data.guestName,
      //   guestEmail: data.guestEmail,
      //   guestPhone: data.guestPhone,
      //   specialRequests: data.specialRequests,
      //   totalAmount: calculateTotal(),
      //   status: 'pending'
      // });

      const created = await handleSubmitBooking({
        ...data,
        accommodationId: room.id,
        userId: user?.id || '0',
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        guestCount: data.guestCount,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        specialRequests: data.specialRequests,
        totalAmount: calculateTotal(),
        status: 'pending'
      });

      console.log('Created booking:', created);
      return false;

    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitBooking = async (data: BookingFormData) => {
     try {
          await HttpClient.post("/front-end/book-room", data);
          toast({ title: "Booking Successful", description: "Your booking has been created successfully." });
        } catch (error : any) {
          toast({
            title: "Error",
            description: error.response?.data?.message || "Failed to create booking.",
            variant: "destructive",
          });
        }
  }

  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.guestName || !formData.guestEmail || !formData.guestPhone || !formData.checkInDate || !formData.checkOutDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setShowPaymentForm(true);
  };

  const handlePayment = async (paymentData: any) => {
    try {
      await handleCreateBooking({
        ...formData,
        paymentMethod: paymentData.paymentMethod,
        paymentReference: paymentData.referenceNumber,
        paymentAccountName: paymentData.accountName
      });

      // if (booking && paymentData.paymentMethod !== 'cash') {
      //   await createPayment(booking.id, {
      //     referenceNumber: paymentData.referenceNumber,
      //     senderName: paymentData.accountName || formData.guestName,
      //     senderPhone: formData.guestPhone,
      //     amount: calculateTotal()
      //   });
      // }

      onClose();
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "There was a problem processing your payment.",
        variant: "destructive",
      });
    }
  };

  if (!room) return null;

  const nights = calculateNights();
  const total = calculateTotal();
  const primaryImage = room.images.length > 0 ? room.images[0].image_url : "https://images.unsplash.com/photo-1580587771525-78b9dba3b914";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-booking">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
          <DialogDescription>Book your stay at {room.name}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Room Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <img 
                src={primaryImage} 
                alt={room.name}
                className="w-16 h-16 rounded-lg object-cover"
                data-testid="img-booking-room"
              />
              <div>
                <h4 className="font-semibold text-foreground" data-testid="text-booking-room-name">
                  {room.name}
                </h4>
                <p className="text-muted-foreground text-sm" data-testid="text-booking-dates">
                  {formData.checkInDate && formData.checkOutDate 
                    ? `${new Date(formData.checkInDate).toLocaleDateString()} - ${new Date(formData.checkOutDate).toLocaleDateString()} • ${nights} night${nights !== 1 ? 's' : ''}`
                    : "Select dates"
                  }
                </p>
                <p className="text-primary font-semibold" data-testid="text-booking-total">
                  ₱{total.toLocaleString()} total
                </p>
              </div>
            </div>
          </div>
          
          {showPaymentForm ? (
            <PaymentForm
              onSubmit={handlePayment}
              total={total}
              isProcessing={isSubmitting}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Guest Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Guest Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guest-name">Full Name</Label>
                    <Input
                      id="guest-name"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      placeholder="Enter your full name"
                      required
                      data-testid="input-guest-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest-email">Email Address *</Label>
                    <Input
                      id="guest-email"
                      type="email"
                      value={formData.guestEmail}
                      onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                      placeholder="your@email.com"
                      required
                      data-testid="input-guest-email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest-phone">Phone Number *</Label>
                  <Input
                    id="guest-phone"
                    type="tel"
                    value={formData.guestPhone}
                    onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                    placeholder="+63 917 123 4567"
                    required
                    data-testid="input-guest-phone"
                  />
                </div>
              </div>
              
              {/* Booking Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Booking Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="booking-check-in">Check-in Date *</Label>
                    <Input
                      id="booking-check-in"
                      type="date"
                      value={formData.checkInDate}
                      onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                      required
                      data-testid="input-booking-check-in"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-check-out">Check-out Date *</Label>
                    <Input
                      id="booking-check-out"
                      type="date"
                      value={formData.checkOutDate}
                      onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                      required
                      data-testid="input-booking-check-out"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Guests</Label>
                    <Select
                      value={formData.guestCount.toString()}
                      onValueChange={(value) => setFormData({ ...formData, guestCount: parseInt(value) })}
                    >
                      <SelectTrigger data-testid="select-booking-guests">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: room.max_occupancy }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} Guest{num > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="special-requests">Special Requests</Label>
                  <Textarea
                    id="special-requests"
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    placeholder="Any special requirements or preferences..."
                    rows={3}
                    data-testid="textarea-special-requests"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={onClose}
                  data-testid="button-cancel-booking"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  data-testid="button-confirm-booking"
                >
                  Continue to Payment
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
