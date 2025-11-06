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
import { Calendar, Clock, MinusCircle, PlusCircle, Bus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ShuttleBookingForm() {
  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "",
    passengers: 1,
    specialRequests: "",
    paymentMethod: ""
  });

  const adjustPassengers = (increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      passengers: increment 
        ? Math.min(prev.passengers + 1, 15) 
        : Math.max(1, prev.passengers - 1)
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <Bus className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl">Shuttle Service Reservation</CardTitle>
        </div>
        <CardDescription>Fill out the form to secure your ride</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Service Hours</h3>
            <p className="text-sm text-muted-foreground">9:00 AM to 9:00 PM (Trips every 30 mins)</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Rate</h3>
            <p className="text-sm text-muted-foreground">₱500.00 per ride (one-way)</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Capacity</h3>
            <p className="text-sm text-muted-foreground">Up to 15 passengers per trip</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Booking Info</h3>
            <p className="text-sm text-muted-foreground">Ride from city proper to Bukid ni Manang and vice versa is around 15-20 minutes.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="booking-date">Booking Date</Label>
              <div className="relative">
                <Input
                  id="booking-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-slot">Time Slot</Label>
              <Select 
                value={formData.timeSlot}
                onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}
              >
                <SelectTrigger id="time-slot">
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 25 }, (_, i) => {
                    const hour = Math.floor(i / 2) + 9;
                    const minute = i % 2 === 0 ? "00" : "30";
                    if (hour < 22) {
                      const time = `${hour.toString().padStart(2, "0")}:${minute}`;
                      return (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      );
                    }
                    return null;
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Passenger Count */}
          <div className="space-y-2">
            <Label>Number of Passengers</Label>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => adjustPassengers(false)}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{formData.passengers}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => adjustPassengers(true)}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Maximum 15 passengers</p>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="special-requests">Special Requests</Label>
            <Textarea
              id="special-requests"
              placeholder="Any special requests or notes?"
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
                <p className="text-sm text-muted-foreground">This is a flat rate per ride, regardless of passengers.</p>
              </div>
              <div className="text-2xl font-bold text-primary">₱500.00</div>
            </div>
          </div>

          <Button className="w-full">Book Now</Button>
          
          <p className="text-sm text-muted-foreground text-center">
            Note: Once booking is placed, payment is non-refundable.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}