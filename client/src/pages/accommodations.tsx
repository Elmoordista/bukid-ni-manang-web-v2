import { useState, useEffect } from "react";

import RoomCard from "@/components/room-card";
import BookingModal from "@/components/booking-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { mockAccommodations, type Accommodation } from "@/data/mockData";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import HttpClient from "@/lib/axiosInstance.ts";

export default function Accommodations() {
  const { isAuthenticated } = useAuth();
  const parameters = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedRoom, setSelectedRoom] = useState<Accommodation | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [accommodations, setAccommodations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
  });

  console.log("Search Params:", searchParams);

  // ⭐ Filter State
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    guests: parameters ? parameters.get("guests") || "" : "",
    beds: parameters ? parameters.get("beds") || "" : "",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const checkIn = urlParams.get("checkIn") || "";
    const checkOut = urlParams.get("checkOut") || "";
    const guests = urlParams.get("guests") || "1";
    const bookingId = urlParams.get("booking") || null;

    setSearchParams({ checkIn, checkOut, guests });

    setIsLoading(false);

    if (bookingId && isAuthenticated) {
      const roomToOpen = mockAccommodations.find((a) => a.id === bookingId);
      if (roomToOpen) {
        setSelectedRoom(roomToOpen);
        setBookingModalOpen(true);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchRooms();
  }, []);

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

  const fetchRooms = async () => {
    setIsLoading(true)
    try {
      const res = await HttpClient.get(`/front-end/get-rooms`,{
        params: {
          min_price: filters.minPrice,
          max_price: filters.maxPrice,
          guests: filters.guests,
          beds: filters.beds,
        }
      });
      if(res.data){
        setAccommodations(res.data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load rooms.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleSearch = () => {
    fetchRooms();
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
          </div>

          {/* ⭐ Filters Section */}
      {/* ⭐ Filters Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-muted/20 mb-10 ">
        <h3 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
          🔍 Filters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* Min Price */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Min Price
            </label>
            <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2 bg-muted/10 focus-within:ring-2 focus-within:ring-primary/40 transition">
              <span className="text-muted-foreground text-sm">₱</span>
              <input
                type="number"
                className="w-full bg-transparent outline-none text-foreground"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
              />
            </div>
          </div>

          {/* Max Price */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Max Price
            </label>
            <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2 bg-muted/10 focus-within:ring-2 focus-within:ring-primary/40 transition">
              <span className="text-muted-foreground text-sm">₱</span>
              <input
                type="number"
                className="w-full bg-transparent outline-none text-foreground"
                placeholder="5000"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Guests
            </label>
            <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2 bg-muted/10 focus-within:ring-2 focus-within:ring-primary/40 transition">
              <span className="text-muted-foreground text-sm">👤</span>
              <input
                type="number"
                min="1"
                className="w-full bg-transparent outline-none text-foreground"
                placeholder="1"
                value={filters.guests}
                onChange={(e) =>
                  setFilters({ ...filters, guests: e.target.value })
                }
              />
            </div>
          </div>

          {/* Beds */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Beds
            </label>
            <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2 bg-muted/10 focus-within:ring-2 focus-within:ring-primary/40 transition">
              <span className="text-muted-foreground text-sm">🛏️</span>
              <input
                type="number"
                min="1"
                className="w-full bg-transparent outline-none text-foreground"
                placeholder="1"
                value={filters.beds}
                onChange={(e) =>
                  setFilters({ ...filters, beds: e.target.value })
                }
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              className="w-full py-3 rounded-lg bg-primary text-white font-medium shadow hover:bg-primary/90 
              transition-all duration-200 hover:shadow-md"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

        </div>
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
          ) : accommodations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {accommodations.map((room : any) => (
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
                <h2 className="text-xl font-semibold mb-4">No Accommodations Found</h2>
                <p className="text-muted-foreground">
                  Try adjusting your filters to find a matching room.
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
