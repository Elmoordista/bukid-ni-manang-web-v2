import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Upload } from "lucide-react";
import { createPayment } from "@/data/mockData";

interface GCashPaymentFormProps {
  bookingId: string;
  amount: string;
  onPaymentComplete?: () => void;
}

export default function GCashPaymentForm({ bookingId, amount, onPaymentComplete }: GCashPaymentFormProps) {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [verificationImage, setVerificationImage] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitPayment = useMutation({
    mutationFn: async () => {
      // Simulate backend payment using in-memory helper
      const uploaded = verificationImage ? verificationImage.name : undefined;
      const proof = { referenceNumber, senderName, senderPhone, uploaded, amount: parseFloat(amount) };
      return createPayment(bookingId, proof);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Payment Submitted",
        description: "Your GCash payment has been submitted and is pending verification.",
      });
      onPaymentComplete?.();
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Failed to submit payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVerificationImage(file);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitPayment.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>GCash Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Pay</Label>
            <Input id="amount" value={`₱${parseFloat(amount).toLocaleString()}`} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceNumber">GCash Reference Number</Label>
            <Input
              id="referenceNumber"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Enter GCash reference number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderName">Sender's Name</Label>
            <Input
              id="senderName"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Name as shown in GCash"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderPhone">GCash Phone Number</Label>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <Input
                id="senderPhone"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="GCash registered number"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verificationImage">Payment Screenshot</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="verificationImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("verificationImage")?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Screenshot
              </Button>
              {verificationImage && (
                <span className="text-sm text-muted-foreground">
                  {verificationImage.name}
                </span>
              )}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Payment Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Open your GCash app and send payment to: 0917 100 9766</li>
              <li>Take a screenshot of the successful payment</li>
              <li>Copy the reference number from your GCash transaction</li>
              <li>Fill in the form with your payment details</li>
              <li>Upload the payment screenshot</li>
            </ol>
          </div>

          <Button type="submit" className="w-full" disabled={submitPayment.isPending}>
            {submitPayment.isPending ? "Submitting..." : "Submit Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}