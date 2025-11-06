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
import { Calendar, Clock, MinusCircle, PlusCircle, Utensils, Menu } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { menuCategories } from "@/lib/menu-data";
import { cn } from "@/lib/utils";
import HttpClient from "@/lib/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

export default function RestaurantBookingForm() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: 2,
    specialRequests: "",
    selectedItems: {} as Record<string, number>,
    paymentMethod: ""
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(menuCategories[0]?.name || null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const { toast } = useToast();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate time slots (every 30 minutes between 09:00 and 21:00)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    const start = 9 * 60; // 9:00 in minutes
    const end = 21 * 60; // 21:00
    for (let t = start; t <= end; t += 30) {
      const hh = Math.floor(t / 60).toString().padStart(2, "0");
      const mm = (t % 60).toString().padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();

  const adjustCount = (field: string, increment: boolean) => {
    if (field === "guests") {
      setFormData(prev => ({
        ...prev,
        guests: increment 
          ? Math.min(prev.guests + 1, 20) 
          : Math.max(2, prev.guests - 1)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedItems: {
          ...prev.selectedItems,
          [field]: increment 
            ? (prev.selectedItems[field] || 0) + 1 
            : Math.max(0, (prev.selectedItems[field] || 0) - 1)
        }
      }));
    }
  };

  const hasSelectedItems = () => {
    return Object.values(formData.selectedItems).some(quantity => quantity > 0);
  };

  const computeTotal = () => {
    let total = 0;
    for (const category of menuCategories) {
      for (const item of category.items) {
        const qty = formData.selectedItems[item.name] || 0;
        const price = (item as any).price || 0;
        total += price * qty;
      }
    }
    return total;
  };

  const submitOrder = async () => {
    if (!hasSelectedItems()) {
      alert("No items selected");
      return;
    }
    setIsSubmittingOrder(true);
    try {
      const orderItems = Object.entries(formData.selectedItems)
        .filter(([, qty]) => qty > 0)
        .map(([name, qty]) => {
          // find price from menu data
          let price = 0;
          for (const cat of menuCategories) {
            const it = cat.items.find(i => i.name === name);
            if (it && (it as any).price) { price = (it as any).price; break; }
          }
          return { name, qty, price };
        });

      const payload = {
        type: 'amenity-order',
        items: orderItems,
        total: computeTotal(),
        createdAt: new Date().toISOString(),
      };

  // POST to bookings/orders endpoint (backend expected to handle)
  await HttpClient.post('/booking', payload);
  toast({ title: 'Order submitted', description: 'Your advance order was submitted.' });
  // clear selections
  setFormData(prev => ({ ...prev, selectedItems: {} }));
    } catch (e: any) {
      console.error(e);
  toast({ title: 'Order failed', description: 'Failed to submit advance order', variant: 'destructive' });
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const submitBooking = async () => {
    // validate
    if (!formData.date) { alert('Please select a date'); return; }
    if (!formData.time) { alert('Please select a time'); return; }
    setIsSubmittingBooking(true);
    try {
      const orderItems = Object.entries(formData.selectedItems)
        .filter(([, qty]) => qty > 0)
        .map(([name, qty]) => {
          let price = 0;
          for (const cat of menuCategories) {
            const it = cat.items.find(i => i.name === name);
            if (it && (it as any).price) { price = (it as any).price; break; }
          }
          return { name, qty, price };
        });

      const payload = {
        type: 'amenity-booking',
        amenity: 'restaurant',
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        specialRequests: formData.specialRequests,
        items: orderItems,
        total: computeTotal(),
      };

  const response = await HttpClient.post('/booking', payload);
  console.log('Booking created', response.data);
  toast({ title: 'Booking submitted', description: 'Your booking request was created.' });
  // optionally clear
  setFormData({ date: '', time: '', guests: 2, specialRequests: '', selectedItems: {} });
    } catch (e: any) {
      console.error(e);
  toast({ title: 'Booking failed', description: 'Failed to submit booking', variant: 'destructive' });
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Auto-highlight category in top nav while scrolling the menu
  useEffect(() => {
    const container = document.querySelector('.menu-items-container') as HTMLElement | null;
    if (!container) return;

    const sections = Array.from(container.querySelectorAll('section[id]')) as HTMLElement[];
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver((entries) => {
      // Pick the section that has the largest intersectionRatio or isIntersecting
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = (entry.target as HTMLElement).id;
          if (id) setActiveCategory(id);
        }
      });
    }, {
      root: container,
      rootMargin: '-40% 0px -40% 0px',
      threshold: [0.01, 0.25, 0.5]
    });

    sections.forEach(s => observer.observe(s));
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <Utensils className="w-6 h-6 text-primary" />
          <CardTitle className="text-2xl">Restaurant Reservation</CardTitle>
        </div>
        <CardDescription>Fill out the form to reserve your table</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Operating Hours and Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Operating Hours</h3>
            <p className="text-sm text-muted-foreground">9:00 AM to 10:00 PM Daily</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Payment Methods</h3>
            <div className="text-sm text-muted-foreground">
              <p>• Cash - Pay at the venue</p>
              <p>• GCash - Send to 09655866772</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Booking Fee</h3>
            <p className="text-sm text-muted-foreground">No booking fees. Pre-orders are pre-paid.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Guests</h3>
            <p className="text-sm text-muted-foreground">Up to 20 guests per reservation</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Seating</h3>
            <p className="text-sm text-muted-foreground">Indoor & Al Fresco available. Walk-ins welcome.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
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
              <Label htmlFor="time">Time</Label>
              <Select
                value={formData.time}
                onValueChange={(value) => setFormData({ ...formData, time: value })}
              >
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(slot => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Number of Guests */}
          <div className="space-y-2">
            <Label>Number of Guests</Label>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => adjustCount("guests", false)}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{formData.guests}</span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => adjustCount("guests", true)}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Maximum 20 guests per booking</p>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="special-requests">Special Requests</Label>
            <Textarea
              id="special-requests"
              placeholder="Any special requests or notes for your reservation?"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            />
          </div>

          {/* Advance Order Button */}
          <div className="w-full">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  <Menu className="w-4 h-4 mr-2" />
                  Browse & Add Order to Your Booking
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[96vh] overflow-hidden flex flex-col p-6">
                <DialogHeader>
                  <DialogTitle>Advance Order Menu</DialogTitle>
                </DialogHeader>
              
              {/* Category Navigation */}
              <div className="w-full py-3 border-b category-nav-wrapper sticky top-0 z-30 bg-background">
                <div className="flex flex-wrap gap-2 px-2 category-nav">
                    {menuCategories.map((category, index) => (
                      <button
                        key={category.name}
                        aria-pressed={activeCategory === category.name}
                        className={cn(
                          "px-4 py-2 rounded-full transform active:scale-95",
                          "transition-colors duration-200 ease-in-out",
                          "hover:scale-105",
                          activeCategory === category.name ? "bg-primary text-white" : "border bg-background text-foreground",
                          "animate-slideIn"
                        )}
                        onClick={() => {
                          // set active so background toggles smoothly
                          setActiveCategory(category.name);
                          const element = document.getElementById(category.name) as HTMLElement | null;
                          const container = document.querySelector('.menu-items-container') as HTMLElement | null;
                          const nav = document.querySelector('.category-nav-wrapper') as HTMLElement | null;
                          if (element && container) {
                            const navHeight = nav ? nav.offsetHeight : 0;
                            const extraGap = 12; // small gap between nav and heading
                            // Ensure container has enough top padding so sticky nav doesn't overlap
                            try { container.style.paddingTop = `${navHeight + extraGap}px`; } catch (e) {}

                            // Compute element offset relative to the scroll container using offsetTop accumulation
                            let offset = 0;
                            let el: HTMLElement | null = element;
                            while (el && el !== container && el.offsetParent) {
                              offset += el.offsetTop;
                              el = el.offsetParent as HTMLElement | null;
                            }

                            const target = offset - navHeight - extraGap;
                            // Use rAF to ensure style change (padding) is applied before scrolling
                            requestAnimationFrame(() => {
                              container.scrollTo({ top: Math.max(0, Math.round(target)), behavior: 'smooth' });
                            });
                          }
                        }}
                      >
                        {category.name}
                      </button>
                    ))}
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto py-8 px-6 menu-items-container scroll-smooth">
                <div className="space-y-8 pt-2">
                  {menuCategories.map((category) => (
                    <section 
                      key={category.name} 
                      id={category.name} 
                      className="scroll-mt-32 transition-opacity duration-300 ease-in-out animate-fadeIn"
                    >
                      {/* Heading moved to top nav — keep accessible label only */}
                      <h3 className="sr-only">{category.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                        {category.items.map((item) => (
                              <div key={item.name} className="bg-white rounded-lg overflow-hidden border shadow-sm transform transition-all duration-200 ease-in-out hover:shadow-md animate-fadeIn">
                                {/* Image */}
                                <div className="w-full h-44 bg-muted flex items-center justify-center overflow-hidden">
                                  <img
                                    src={(item as any).image || category.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                {/* Content */}
                                <div className="p-4 flex flex-col justify-between h-44">
                                  <div>
                                    <h4 className="font-medium text-lg text-foreground">{item.name}</h4>
                                    {item.description && (
                                      <p className="text-sm text-muted-foreground mt-2 max-h-12 overflow-hidden">{item.description}</p>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between mt-4">
                                    <div className="text-primary font-semibold">
                                      {/* If price exists, show it, otherwise keep space */}
                                      {(item as any).price ? `₱${(item as any).price}` : ""}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Button 
                                        variant="outline" 
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-destructive/10 hover:bg-destructive/20 border-none"
                                        onClick={() => adjustCount(item.name, false)}
                                      >
                                        <MinusCircle className="h-4 w-4" />
                                      </Button>
                                      <span className="w-10 text-center">{formData.selectedItems[item.name] || 0}</span>
                                      <Button 
                                        variant="outline" 
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 border-none"
                                        onClick={() => adjustCount(item.name, true)}
                                      >
                                        <PlusCircle className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>

              {/* Order Summary Footer - always visible at the bottom of the dialog */}
              <div className="border-t p-4 bg-background">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">
                    Total: <span className="text-primary">₱{computeTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" onClick={() => setFormData(prev => ({ ...prev, selectedItems: {} }))}>
                      Cancel
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90" disabled={!hasSelectedItems() || isSubmittingOrder} onClick={submitOrder}>
                      {isSubmittingOrder ? 'Submitting...' : 'Confirm Order'}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
            </Dialog>
          </div>

          {/* Selected Items Summary */}
          {hasSelectedItems() && (
            <div className="rounded-lg bg-muted p-4">
              <div>
                <h4 className="font-semibold">Selected Items:</h4>
                <div className="mt-2 space-y-1">
                  {Object.entries(formData.selectedItems)
                    .filter(([_, quantity]) => quantity > 0)
                    .map(([itemName, quantity]) => (
                      <p key={itemName} className="text-sm text-muted-foreground">
                        {quantity}x {itemName}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          )}

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

          <Button className="w-full" onClick={submitBooking} disabled={isSubmittingBooking}>
            {isSubmittingBooking ? 'Booking...' : 'Book Now'}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            Note: Payments for advance orders are non-refundable.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function groupBy(array: any[], key: string) {
  return array.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
}