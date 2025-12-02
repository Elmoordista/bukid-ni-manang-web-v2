import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, Users, Home, DollarSign, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookingCancellationProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    accommodationName: string;
    guestName: string;
    checkInDate: string;
    checkOutDate: string;
    guestCount: number;
    totalAmount: number;
    status: string;
  };
  onCancelBooking: (bookingId: string, reason: string, refundAmount: number) => Promise<void>;
}

const CANCELLATION_REASONS = [
  { id: 'change_plans', label: 'Change of travel plans', refundRate: 0.8 },
  { id: 'emergency', label: 'Family emergency', refundRate: 0.9 },
  { id: 'weather', label: 'Weather concerns', refundRate: 1.0 },
  { id: 'health', label: 'Health issues', refundRate: 0.9 },
  { id: 'work', label: 'Work commitment', refundRate: 0.7 },
  { id: 'other', label: 'Other reason', refundRate: 0.5 }
];

export default function BookingCancellation({ 
  isOpen, 
  onClose, 
  booking, 
  onCancelBooking 
}: BookingCancellationProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  const selectedReasonData = CANCELLATION_REASONS.find(r => r.id === selectedReason);
  const refundAmount = selectedReasonData 
    ? Math.round(booking.totalAmount * selectedReasonData.refundRate) 
    : 0;
  const deductionAmount = booking.totalAmount - refundAmount;

  const calculateDaysUntilCheckIn = () => {
    const checkInDate = new Date(booking.checkInDate);
    const today = new Date();
    const diffTime = checkInDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilCheckIn = calculateDaysUntilCheckIn();

  const handleSubmitCancellation = async () => {
    if (!selectedReason) {
      toast({
        title: "Missing Information",
        description: "Please select a cancellation reason.",
        variant: "destructive",
      });
      return;
    }

    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reason = `${selectedReasonData?.label}${additionalNotes ? ` - ${additionalNotes}` : ''}`;
      await onCancelBooking(booking.id, reason, refundAmount);
      
      toast({
        title: "Booking Cancelled",
        description: `Your booking has been cancelled. Refund of ₱${refundAmount.toLocaleString()} will be processed within 3-5 business days.`,
      });
      
      onClose();
      setShowConfirmation(false);
      setSelectedReason('');
      setAdditionalNotes('');
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "Unable to cancel booking. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (showConfirmation) {
      setShowConfirmation(false);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {showConfirmation ? 'Confirm Cancellation' : 'Cancel Booking'}
          </DialogTitle>
        </DialogHeader>

        {!showConfirmation ? (
          <div className="space-y-6">
            {/* Booking Details */}
            <Card className="border-destructive/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{booking.accommodationName}</span>
                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                    {booking.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.checkInDate} - {booking.checkOutDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.guestCount} Guest{booking.guestCount > 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="text-xl font-bold">₱{booking.totalAmount.toLocaleString()}</span>
                </div>
                
                {daysUntilCheckIn >= 0 && (
                  <div className="flex items-center gap-2 p-2 bg-amber-50 rounded text-sm">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-amber-700">
                      {daysUntilCheckIn === 0 ? 'Check-in is today' : 
                       daysUntilCheckIn === 1 ? 'Check-in is tomorrow' :
                       `${daysUntilCheckIn} days until check-in`}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cancellation Reason */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Reason for Cancellation</Label>
              <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
                {CANCELLATION_REASONS.map((reason) => (
                  <div key={reason.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/5">
                    <RadioGroupItem value={reason.id} id={reason.id} />
                    <Label htmlFor={reason.id} className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <span>{reason.label}</span>
                        <Badge variant="outline">
                          {Math.round(reason.refundRate * 100)}% refund
                        </Badge>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Please provide any additional details about your cancellation..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Refund Calculation Preview */}
            {selectedReason && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Refund Calculation
                    </h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Original Amount:</span>
                        <span>₱{booking.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Refund Rate:</span>
                        <span>{Math.round((selectedReasonData?.refundRate || 0) * 100)}%</span>
                      </div>
                      {deductionAmount > 0 && (
                        <div className="flex justify-between text-destructive">
                          <span>Cancellation Fee:</span>
                          <span>-₱{deductionAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Refund Amount:</span>
                        <span className="text-primary">₱{refundAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Confirmation Step */
          <div className="space-y-6">
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6 text-center">
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h3 className="text-xl font-bold text-destructive mb-2">
                  Are you sure you want to cancel this booking?
                </h3>
                <p className="text-muted-foreground mb-4">
                  This action cannot be undone. Your booking will be permanently cancelled.
                </p>
                
                <div className="bg-white rounded-lg p-4 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span>Booking:</span>
                    <span className="font-medium">{booking.accommodationName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reason:</span>
                    <span className="font-medium">{selectedReasonData?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Refund Amount:</span>
                    <span className="font-bold text-primary">₱{refundAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
            {showConfirmation ? 'Back' : 'Cancel'}
          </Button>
          <Button
            variant={showConfirmation ? "destructive" : "default"}
            onClick={handleSubmitCancellation}
            disabled={!selectedReason || isSubmitting}
          >
            {isSubmitting ? (
              <>Processing...</>
            ) : showConfirmation ? (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Booking
              </>
            ) : (
              <>Continue</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}