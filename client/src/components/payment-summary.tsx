import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Banknote, 
  Calendar,
  Users,
  Home,
  Plus,
  Calculator,
  Receipt,
  CheckCircle
} from "lucide-react";

interface BookingItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  type: 'accommodation' | 'addon';
}

interface PaymentSummaryProps {
  bookingDetails: {
    accommodationName: string;
    checkInDate: string;
    checkOutDate: string;
    guestCount: number;
    nights: number;
    basePrice: number;
  };
  additionalItems: BookingItem[];
  onPaymentMethodChange: (method: 'online' | 'cash') => void;
  onConfirmBooking: () => void;
  selectedPaymentMethod: 'online' | 'cash';
}

export default function PaymentSummary({ 
  bookingDetails, 
  additionalItems, 
  onPaymentMethodChange, 
  onConfirmBooking,
  selectedPaymentMethod 
}: PaymentSummaryProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Calculate costs
  const accommodationTotal = bookingDetails.basePrice * bookingDetails.nights;
  const additionalTotal = additionalItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotal = accommodationTotal + additionalTotal;
  const serviceFee = subtotal * 0.05; // 5% service fee
  const taxes = subtotal * 0.12; // 12% tax
  const total = subtotal + serviceFee + taxes;

  return (
    <div className="space-y-6">
      {/* Booking Details */}
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Receipt className="h-5 w-5 text-primary" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
            <Home className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold">{bookingDetails.accommodationName}</h3>
              <p className="text-sm text-muted-foreground">
                {bookingDetails.nights} night{bookingDetails.nights > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Check-in</p>
                <p className="text-muted-foreground">{bookingDetails.checkInDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Check-out</p>
                <p className="text-muted-foreground">{bookingDetails.checkOutDate}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm">
              {bookingDetails.guestCount} Guest{bookingDetails.guestCount > 1 ? 's' : ''}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Additional Items */}
      {additionalItems.length > 0 && (
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-primary" />
              Additional Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {additionalItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                </div>
                <span className="font-semibold">₱{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Payment Method */}
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedPaymentMethod} 
            onValueChange={(value: 'online' | 'cash') => onPaymentMethodChange(value)}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/10 transition-colors">
              <RadioGroupItem value="online" id="online" />
              <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer flex-1">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Online Payment</div>
                  <div className="text-sm text-muted-foreground">Pay now with card or digital wallet</div>
                </div>
              </Label>
              <Badge variant="secondary">Secure</Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/10 transition-colors">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                <Banknote className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Cash on Arrival</div>
                  <div className="text-sm text-muted-foreground">Pay when you check in at the resort</div>
                </div>
              </Label>
              <Badge variant="outline">Popular</Badge>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle 
            className="flex items-center gap-2 text-lg cursor-pointer"
            onClick={() => setShowBreakdown(!showBreakdown)}
          >
            <Calculator className="h-5 w-5 text-primary" />
            Cost Breakdown
            <Button variant="ghost" size="sm" className="ml-auto">
              {showBreakdown ? 'Hide' : 'Show'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {showBreakdown && (
            <>
              <div className="flex justify-between">
                <span>Accommodation ({bookingDetails.nights} night{bookingDetails.nights > 1 ? 's' : ''})</span>
                <span>₱{accommodationTotal.toLocaleString()}</span>
              </div>
              
              {additionalItems.length > 0 && (
                <div className="flex justify-between">
                  <span>Additional Items</span>
                  <span>₱{additionalTotal.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₱{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Service Fee (5%)</span>
                <span>₱{serviceFee.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Taxes (12%)</span>
                <span>₱{taxes.toLocaleString()}</span>
              </div>
              
              <Separator />
            </>
          )}
          
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total</span>
            <span className="text-primary">₱{total.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Booking Button */}
      <Button 
        onClick={onConfirmBooking}
        className="w-full h-12 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        data-testid="button-confirm-booking"
      >
        <CheckCircle className="h-5 w-5 mr-2" />
        {selectedPaymentMethod === 'cash' ? 'Reserve Now (Pay on Arrival)' : 'Pay Now & Confirm Booking'}
      </Button>
      
      {selectedPaymentMethod === 'cash' && (
        <p className="text-sm text-muted-foreground text-center">
          No payment required now. Pay ₱{total.toLocaleString()} when you arrive at the resort.
        </p>
      )}
    </div>
  );
}