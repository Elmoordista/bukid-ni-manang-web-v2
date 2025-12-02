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
import { Calendar, Clock, MinusCircle, PlusCircle, Waves } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import HttpClient from "@/lib/axiosInstance";

// Generate time slots between start and end (inclusive start, exclusive end) at given interval minutes
const generateTimeSlots = (start = '09:00', end = '21:00', intervalMinutes = 30) => {
  const pads = (n: number) => n.toString().padStart(2, '0');
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  const slots: string[] = [];
  for (let mins = startMinutes; mins < endMinutes; mins += intervalMinutes) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    slots.push(`${pads(hour12)}:${pads(m)} ${ampm}`);
  }
  return slots;
};

export default function PoolBookingForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    adults: 0,
    children: 0,
    cottages: 0,
    tables: 0,
    specialRequests: "",
    paymentMethod: "",
  });

  const calculateTotal = () => {
    const adultFee = formData.adults * 150;
    const childrenFee = formData.children * 130;
    const cottageFee = formData.cottages * 1230.97;
    const tableFee = formData.tables * 476.12;
    return adultFee + childrenFee + cottageFee + tableFee;
  };

  const adjustCount = (field: string, increment: boolean) => {
    console.log(`Adjusting ${field} ${increment ? 'up' : 'down'}`);
    // setFormData(prev => ({
    //   ...prev,
    //   [field]: increment ? prev[field] + 1 : Math.max(0, prev[field] - 1)
    // }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <Waves className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl">Pool Cottage Reservation</CardTitle>
        </div>
        <CardDescription>Fill out the form to secure your booking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Operating Hours and Fees Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Operating Hours</h3>
            <p className="text-sm text-muted-foreground">9:00 AM to 9:00 PM</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Payment Methods</h3>
            <div className="text-sm text-muted-foreground">
              <p>• Cash - Pay at the venue</p>
              <p>• GCash - Send to 09655866772</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Entrance Fees</h3>
            <div className="text-sm text-muted-foreground">
              <p>Adult: ₱150.00</p>
              <p>Children (Ages 1-5): ₱130.00</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Cottages</h3>
            <p className="text-sm text-muted-foreground">₱1,230.97/day (15-20 pax)</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Tables</h3>
            <p className="text-sm text-muted-foreground">₱476.12/day (6 pax)</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Select Date</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Select Time</Label>
              <div className="relative">
                <select
                  id="time"
                  aria-label="Select time slot"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                >
                  <option value="">-- Select Time --</option>
                  {/* Add time slots */}
                  {generateTimeSlots().map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Counters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Adults</Label>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => adjustCount("adults", false)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{formData.adults}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => adjustCount("adults", true)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Children</Label>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => adjustCount("children", false)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{formData.children}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => adjustCount("children", true)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cottages</Label>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => adjustCount("cottages", false)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{formData.cottages}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => adjustCount("cottages", true)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Number of Cottages available: 6</p>
            </div>

            <div className="space-y-2">
              <Label>Tables</Label>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => adjustCount("tables", false)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{formData.tables}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => adjustCount("tables", true)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Number of Tables available: 21</p>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="special-requests">Special Requests</Label>
            <Textarea
              id="special-requests"
              placeholder="Any special requests or notes for your swimming pool booking?"
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
                <p className="text-sm text-muted-foreground">Final amount may vary based on availability</p>
              </div>
              <div className="text-2xl font-bold text-primary">₱{calculateTotal().toFixed(2)}</div>
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={async () => {
              try {
                const bookingData = {
                  ...formData,
                  type: 'amenity-pool',
                  amenity: 'Swimming Pool',
                  total: calculateTotal(),
                };
                
                await HttpClient.post('/booking', bookingData);
                toast({
                  title: "Booking Successful",
                  description: "Your pool booking has been confirmed.",
                });
                // Reset form
                setFormData({
                  date: "",
                  time: "",
                  adults: 0,
                  children: 0,
                  cottages: 0,
                  tables: 0,
                  specialRequests: "",
                  paymentMethod: ""
                });
              } catch (error) {
                toast({
                  title: "Booking Failed",
                  description: "There was a problem booking the pool. Please try again.",
                  variant: "destructive"
                });
              }
            }}
          >
            Book Now
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            Once booking is placed, payment is non-refundable. For inquiries, please contact resort management.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}