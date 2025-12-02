import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useToast } from "@/hooks/use-toast";
import { RESORT_INFO } from "@/lib/constants";
const heroImage = "/images/IMG_9191_1756782230937.jpeg";

export default function HeroSection() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    guests: "1",
    beds: "1",
  });

  const handleSearchAvailability = () => {
    if ( !bookingData.guests || !bookingData.beds) {
      toast({
        title: "Missing Information",
        description: "Please fill in all booking details.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Searching Availability",
      description: "Searching for available accommodations at " + RESORT_INFO.name + "...",
    });

    // Navigate to accommodations with search params
    navigate(`/accommodations?beds=${encodeURIComponent(bookingData.beds)}&guests=${encodeURIComponent(bookingData.guests)}`);
    // navigate(`/accommodations?checkIn=${bookingData.checkIn}&checkOut=${bookingData.checkOut}&guests=${encodeURIComponent(bookingData.guests)}`);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 parallax-bg" 
        style={{
          backgroundImage: `url(${heroImage})`
        }}
      />
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Discover Paradise at<br />
          <span className="text-accent">Bukid ni Manang</span> Farm & Resort
        </h1>
        <p className="text-xl sm:text-2xl mb-8 text-white/90">
          The Perfect Venue for Family & Community Gatherings in Calbayog City, Samar
        </p>
        
        {/* Booking Widget */}
        <div className="booking-widget rounded-xl p-6 sm:p-8 border border-border/20 max-w-4xl mx-auto mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            {/* <div className="space-y-2">
              <Label htmlFor="check-in" className="text-sm font-medium text-muted-foreground">Check-in</Label>
              <div className="relative">
                <Input
                  id="check-in"
                  type="date"
                  value={bookingData.checkIn}
                  onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                  className="w-full"
                  data-testid="input-check-in"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="check-out" className="text-sm font-medium text-muted-foreground">Check-out</Label>
              <div className="relative">
                <Input
                  id="check-out"
                  type="date"
                  value={bookingData.checkOut}
                  onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                  className="w-full"
                  data-testid="input-check-out"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div> */}
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Beds</Label>
              <Input
                  id="beds"
                  type="text"
                  value={bookingData.beds}
                  onChange={(e) => setBookingData({ ...bookingData, beds: e.target.value })}
                  className="w-full text-center"
                  placeholder="Input number of beds"
                  data-testid="input-beds"
              />
              {/* <Select
                value={bookingData.guests}
                onValueChange={(value) => setBookingData({ ...bookingData, guests: value })}
              >
                <SelectTrigger data-testid="select-guests">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 Guest">1 Guest</SelectItem>
                  <SelectItem value="2 Guests">2 Guests</SelectItem>
                  <SelectItem value="3 Guests">3 Guests</SelectItem>
                  <SelectItem value="4+ Guests">4+ Guests</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Guests</Label>
              <Input
                  id="guests"
                  type="text"
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
                  className="w-full text-center"
                  placeholder="Input number of guests"
                  data-testid="input-guests"
              />
              {/* <Select
                value={bookingData.guests}
                onValueChange={(value) => setBookingData({ ...bookingData, guests: value })}
              >
                <SelectTrigger data-testid="select-guests">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 Guest">1 Guest</SelectItem>
                  <SelectItem value="2 Guests">2 Guests</SelectItem>
                  <SelectItem value="3 Guests">3 Guests</SelectItem>
                  <SelectItem value="4+ Guests">4+ Guests</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
            
            <Button 
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={handleSearchAvailability}
              data-testid="button-search-availability"
            >
              Search Availability
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
