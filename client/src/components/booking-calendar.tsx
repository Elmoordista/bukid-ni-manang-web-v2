import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { addDays, format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const bookingFormSchema = z.object({
  startDate: z.date({
    required_error: "Please select a check-in date.",
  }),
  endDate: z.date({
    required_error: "Please select a check-out date.",
  }),
  guestCount: z.string().min(1, "Please select number of guests."),
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  specialRequests: z.string().optional(),
});

interface BookingCalendarProps {
  locationId: string;
  price?: string;
  maxGuests?: number;
  onBook: () => void;
}

export function BookingCalendar({ locationId, price, maxGuests = 4, onBook }: BookingCalendarProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guestCount: "1",
      specialRequests: "",
    },
  });

  async function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    setIsSubmitting(true);
    try {
      // Here you would typically make an API call to create the booking
      console.log("Booking values:", values);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      onBook();
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const guestOptions = Array.from({ length: maxGuests }, (_, i) => (
    <SelectItem key={i + 1} value={String(i + 1)}>
      {i + 1} {i === 0 ? "Guest" : "Guests"}
    </SelectItem>
  ));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Dates */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-in Date</FormLabel>
                <FormControl>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-out Date</FormLabel>
                <FormControl>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => 
                      date < (form.getValues("startDate") || new Date()) ||
                      date > addDays(form.getValues("startDate") || new Date(), 14)
                    }
                    className="rounded-md border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Guest Count */}
        <FormField
          control={form.control}
          name="guestCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Guests</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of guests" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {guestOptions}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Special Requests */}
        <FormField
          control={form.control}
          name="specialRequests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Requests</FormLabel>
              <FormControl>
                <Input placeholder="Any special requests or requirements?" {...field} />
              </FormControl>
              <FormDescription>
                Optional: Let us know if you have any special requirements.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Summary */}
        {price && (
          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-semibold mb-2">Price Summary</h3>
            <div className="flex justify-between items-center">
              <span>Rate per day:</span>
              <span>₱{price}</span>
            </div>
            {form.watch("startDate") && form.watch("endDate") && (
              <div className="flex justify-between items-center mt-2 pt-2 border-t">
                <span className="font-medium">Total:</span>
                <span className="font-medium">
                  ₱{Number(price) * Math.ceil(
                    (form.getValues("endDate").getTime() - form.getValues("startDate").getTime()) / 
                    (1000 * 60 * 60 * 24)
                  )}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </form>
    </Form>
  );
}