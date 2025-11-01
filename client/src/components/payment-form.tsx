import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const paymentSchema = z.object({
  paymentMethod: z.enum(["gcash", "cash"]),
  referenceNumber: z.string().optional(),
  accountName: z.string().optional(),
});

interface PaymentFormProps {
  onSubmit: (data: z.infer<typeof paymentSchema>) => void;
  total: number;
  isProcessing?: boolean;
}

export function PaymentForm({ onSubmit, total, isProcessing = false }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("gcash");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "gcash",
      referenceNumber: "",
      accountName: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof paymentSchema>) => {
    if (values.paymentMethod === "gcash" && !values.referenceNumber) {
      toast({
        title: "Reference number required",
        description: "Please provide the GCash reference number",
        variant: "destructive",
      });
      return;
    }

    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedMethod(value);
                }}
                defaultValue={field.value}
                disabled={isProcessing}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="gcash">GCash</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedMethod === "gcash" && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-semibold mb-2">GCash Payment Instructions</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Send payment to GCash number: 0917-123-4567</li>
                <li>Save the reference number from your GCash transaction</li>
                <li>Enter the reference number below</li>
              </ol>
            </div>

            <FormField
              control={form.control}
              name="referenceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GCash Reference Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter reference number" disabled={isProcessing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GCash Account Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your GCash name" disabled={isProcessing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {selectedMethod === "cash" && (
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-semibold mb-2">Cash Payment Instructions</h4>
            <p className="text-sm">Please prepare ₱{total.toLocaleString()} in cash to be paid upon check-in.</p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Proceed with Payment"}
        </Button>
      </form>
    </Form>
  );
}