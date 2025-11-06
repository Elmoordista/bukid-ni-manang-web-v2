import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PaymentMethodSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function PaymentMethodSelect({ value, onValueChange }: PaymentMethodSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="payment-method">Payment Method</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="payment-method">
          <SelectValue placeholder="Select payment method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cash">Cash - Pay at the venue</SelectItem>
          <SelectItem value="gcash">GCash - Send to 09655866772</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}