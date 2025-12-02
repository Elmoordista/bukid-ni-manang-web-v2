"use client";

import { Users, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Accommodation } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";

interface RoomCardProps {
  room: Accommodation;
  onBookNow: (room: Accommodation) => void;
}

export default function RoomCard({ room, onBookNow }: RoomCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  // Determine primary image (prefer provided images, otherwise fallback to Unsplash)
  const primaryImage = room.images && room.images.length > 0 ? room.images[0].image_url : "https://images.unsplash.com/photo-1580587771525-78b9dba3b914";
  const amenities = Array.isArray(room.amenities) ? room.amenities : [];

  // Build responsive srcset for external Unsplash images to serve optimized sizes and webp
  const isExternal = primaryImage.startsWith("http");
  const srcSet = isExternal
    ? [400, 800, 1200].map((w) => `${primaryImage}?auto=format&fit=crop&w=${w}&q=80 ${w}w`).join(", ")
    : undefined;
  const webpSrcSet = isExternal
    ? [400, 800, 1200].map((w) => `${primaryImage}?auto=format&fit=crop&w=${w}&q=80&fm=webp ${w}w`).join(", ")
    : undefined;

  return (
    <Card className="overflow-hidden shadow-lg border border-border card-hover">
      {/* Responsive/lazy image: prefer webp when supported, fall back to original */}
      {isExternal ? (
        <picture>
          <source type="image/webp" srcSet={webpSrcSet} sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" />
          <source srcSet={srcSet} sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" />
          <img
            src={primaryImage}
            alt={room.name}
            className="w-full h-48 object-cover"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            data-testid={`img-room-${room.id}`}
          />
        </picture>
      ) : (
        <img
          src={primaryImage}
          alt={room.name}
          className="w-full h-48 object-cover"
          loading="lazy"
          decoding="async"
          data-testid={`img-room-${room.id}`}
        />
      )}
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-card-foreground" data-testid={`text-room-name-${room.id}`}>
            {room.name}
          </h3>
          {/* <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm text-muted-foreground" data-testid={`text-rating-${room.id}`}>
              {room.rating}
            </span>
          </div> */}
        </div>
        
        <p className="text-muted-foreground mb-4" data-testid={`text-description-${room.id}`}>
          {room.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span data-testid={`text-guests-${room.id}`}>{room.max_occupancy} guest{room.max_occupancy > 1 ? 's' : ''}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Bed className="h-4 w-4" />
                <span data-testid={`text-beds-${room.id}`}>{(room.number_of_beds ?? 1)} bed{(room.number_of_beds ?? 1) > 1 ? 's' : ''}</span>
              </span>
            </div>
        </div>

        {/* Amenities Section */}
        {amenities.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity: string, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-md border"
                  data-testid={`amenity-${room.id}-${index}`}
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-foreground" data-testid={`text-price-${room.id}`}>
              ₱{Number(room.price_per_night).toLocaleString()}
            </span>
            <span className="text-muted-foreground">/night</span>
          </div>
          <Button 
            onClick={() => {
              if (!isAuthenticated) {
                toast({
                  title: "Login Required",
                  description: "Please log in to book this room.",
                  variant: "destructive"
                });
                navigate(`/login?next=/accommodations?booking=${room.id}`);
                return;
              }
              onBookNow(room);
            }}
            data-testid={`button-book-room-${room.id}`}
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
