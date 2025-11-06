import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MinusCircle, PlusCircle, PartyPopper } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function EventsBookingForm() {
  const [formData, setFormData] = useState({
    date: "",
    eventType: "",
    duration: "",
    package: "no-package",
    guests: 20,
    specialRequests: "",
    paymentMethod: ""
  });

  const adjustGuests = (increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      guests: increment 
        ? Math.min(prev.guests + 1, 200) 
        : Math.max(10, prev.guests - 1)
    }));
  };

  const calculateTotal = () => {
    const basePrice = 15000;
    // Add package price calculation logic here
    return basePrice;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <PartyPopper className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl">Event Reservation</CardTitle>
        </div>
        <CardDescription>Fill out the form to secure your booking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Venue Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Venue Details</h3>
            <p className="text-sm text-muted-foreground">Perfect for birthdays, weddings, and corporate functions</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Payment Methods</h3>
            <div className="text-sm text-muted-foreground">
              <p>• Cash - Pay at the venue</p>
              <p>• GCash - Send to 09655866772</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Rate</h3>
            <p className="text-sm text-muted-foreground">₱15,000.00 base rate</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Capacity</h3>
            <p className="text-sm text-muted-foreground">Up to 200 guests • Customizable seating</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Inclusions</h3>
            <p className="text-sm text-muted-foreground">Venue, tables, chairs, basic sound system</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-date">Event Date</Label>
              <div className="relative">
                <Input
                  id="event-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select 
                value={formData.eventType}
                onValueChange={(value) => setFormData({ ...formData, eventType: value })}
              >
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="corporate">Corporate Event</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Event Duration</Label>
              <Select 
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="half-day">Half Day (6 hours)</SelectItem>
                  <SelectItem value="full-day">Full Day (12 hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="package">Package (optional)</Label>
              <Select 
                value={formData.package}
                onValueChange={(value) => setFormData({ ...formData, package: value })}
              >
                <SelectTrigger id="package">
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-package">No package</SelectItem>
                  <SelectItem value="basic">Basic Package</SelectItem>
                  <SelectItem value="premium">Premium Package</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Guest Count */}
          <div className="space-y-2">
            <Label>Total Guests</Label>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => adjustGuests(false)}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{formData.guests}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => adjustGuests(true)}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Minimum 10, Maximum 200 guests</p>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="special-requests">Special Requests</Label>
            <Textarea
              id="special-requests"
              placeholder="Any special requests or notes for your event?"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            />
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
            >
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash - Pay at the venue</SelectItem>
                <SelectItem value="gcash">GCash - Send to 09655866772</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Total */}
          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Estimated Total:</h4>
                <p className="text-sm text-muted-foreground">Base price + optional package</p>
              </div>
              <div className="text-2xl font-bold text-primary">₱{calculateTotal().toFixed(2)}</div>
            </div>
          </div>

          <Button className="w-full">Book Now</Button>
          
          <p className="text-sm text-muted-foreground text-center">
            Note: Once booking is placed, payment is non-refundable. For inquiries, please contact resort management.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}