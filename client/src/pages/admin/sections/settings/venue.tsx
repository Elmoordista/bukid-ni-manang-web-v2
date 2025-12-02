import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
// import Notiflix from "notiflix";
import HttpClient from "@/lib/axiosInstance.ts";
import { useEffect } from "react";

const venueSettingsSchema = z.object({
  venueName: z.string().min(1, "Venue name is required"),
  address: z.string().min(1, "Address is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Valid phone number required"),
  description: z.string().min(1, "Description is required"),
  checkInTime: z.string().min(1, "Check-in time is required"),
  checkOutTime: z.string().min(1, "Check-out time is required"),
  gcashNumber: z.string().min(10, "Valid GCash number required"),
  policies: z.string().min(1, "Policies are required"),
});

type VenueSettingsData = z.infer<typeof venueSettingsSchema>;

export default function VenueSettings() {
  const { toast } = useToast();
  const form = useForm<VenueSettingsData>({
    resolver: zodResolver(venueSettingsSchema),
    defaultValues: {
      venueName: "Bukid ni Manang",
      address: "123 Sample St., Silay City",
      contactEmail: "contact@bukidnimanang.com",
      contactPhone: "+63 917 123 4567",
      description: "A peaceful retreat in the heart of nature...",
      checkInTime: "14:00",
      checkOutTime: "12:00",
      gcashNumber: "0917 123 4567",
      policies: "1. No smoking inside rooms\n2. Quiet hours from 10 PM to 6 AM\n3. No pets allowed\n4. Maximum occupancy must be strictly followed",
    },
  });

   useEffect(() => {
      fetchSettings();
  }, []);

  const fetchSettings = async () =>{
    // Loading settings...
    try {
      // Replace with actual API call
      const response = await HttpClient.get('/settings?type=venue');
      if(response.data?.data){
        const fetchedSettings = response.data.data;
        const setting = fetchedSettings? JSON.parse(fetchedSettings.settings) : null;
        if(setting){
          form.reset(setting);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Notiflix.Loading.remove();
    }
  }

  const onSubmit = async (data: VenueSettingsData) => {
    // Saving settings...
    try {
      // Replace with actual API call
      await HttpClient.post('/settings', {
        settings: data,
        type: 'venue',
      });
      toast({
        title: "Settings Saved",
        description: "Your venue settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Notiflix.Loading.remove();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Venue Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="venueName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkInTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-in Time</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkOutTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-out Time</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gcashNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GCash Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="policies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue Policies</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}