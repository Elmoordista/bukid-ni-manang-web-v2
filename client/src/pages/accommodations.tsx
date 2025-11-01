import { useState, useEffect } from "react";

import RoomCard from "@/components/room-card";
import BookingModal from "@/components/booking-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { mockAccommodations, type Accommodation } from "@/data/mockData";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Accommodations() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedRoom, setSelectedRoom] = useState<Accommodation | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
  });

  // Parse URL search params on mount and when auth state changes; load accommodations
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const checkIn = urlParams.get("checkIn") || "";
    const checkOut = urlParams.get("checkOut") || "";
    const guests = urlParams.get("guests") || "1";
    const bookingId = urlParams.get("booking") || null;

    setSearchParams({ checkIn, checkOut, guests });

    // Load accommodations data immediately
    setAccommodations(mockAccommodations);
    setIsLoading(false);

    // If there's a booking intent in the URL and the user is authenticated, open the modal
    if (bookingId && isAuthenticated) {
      const roomToOpen = mockAccommodations.find((a) => a.id === bookingId);
      if (roomToOpen) {
        setSelectedRoom(roomToOpen);
        setBookingModalOpen(true);
      }
    }
  }, [isAuthenticated]);
  const handleBookNow = (room: Accommodation) => {
    if (!isAuthenticated) {
      toast({ title: "Sign up required", description: "Please sign up or log in to make a booking." });
      const next = encodeURIComponent(`/accommodations?booking=${room.id}`);
      navigate(`/login?next=${next}`);
      return;
    }
    setSelectedRoom(room);
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
    setSelectedRoom(null);
  };

  if (false) { // Remove error handling for static data
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold text-destructive mb-4">Failed to Load Accommodations</h1>
              <p className="text-muted-foreground">
                We're having trouble loading our room information. Please try again later.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              Choose Your Perfect Stay
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From cozy farm cottages to luxury suites, find the perfect accommodation for your getaway
            </p>
            {searchParams.checkIn && searchParams.checkOut && (
              <div className="mt-6 text-sm text-muted-foreground">
                <p data-testid="text-search-params">
                  Showing availability for {new Date(searchParams.checkIn).toLocaleDateString()} - {new Date(searchParams.checkOut).toLocaleDateString()} 
                  for {searchParams.guests} guest{searchParams.guests !== "1" ? "s" : ""}
                </p>
              </div>
            )}
          </div>
          
          {/* Room Listings */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }, (_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-9 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : accommodations && accommodations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {accommodations.map((room) => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onBookNow={handleBookNow} 
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <h2 className="text-xl font-semibold mb-4">No Accommodations Available</h2>
                <p className="text-muted-foreground">
                  We currently don't have any rooms available. Please check back later.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={closeBookingModal}
        room={selectedRoom}
        checkIn={searchParams.checkIn}
        checkOut={searchParams.checkOut}
        guests={searchParams.guests}
      />
    </div>
  );
}
