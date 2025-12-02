import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Car, Clock, Route, Phone, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoogleMapsProps {
  className?: string;
}

export default function GoogleMaps({ className = "" }: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [showDirections, setShowDirections] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const { toast } = useToast();

  // Get API key from environment variable
  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (key) {
      setApiKey(key);
    } else {
      console.warn('Google Maps API key not found in environment variables');
    }
  }, []);

  useEffect(() => {
    if (!apiKey) {
      console.warn('Google Maps API key not available');
      return;
    }

    const loadGoogleMaps = () => {
      if (!window.google?.maps?.Map) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initGoogleMap`;
        script.async = true;
        script.defer = true;
        
        // Create a global callback function
        (window as any).initGoogleMap = () => {
          console.log('Google Maps loaded successfully');
          initializeMap();
        };
        
        script.onerror = (error) => {
          console.error('Failed to load Google Maps:', error);
          toast({
            title: "Map Loading Error",
            description: "Unable to load Google Maps. Please check your internet connection.",
            variant: "destructive",
          });
        };
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      // Bukid ni Manang Farm & Resort coordinates (Brgy. Guinbaoyan Norte, Calbayog City, Samar)
      const resortLocation = { lat: 12.0676, lng: 124.5930 };

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: userLocation ? 12 : 15,
        center: userLocation || resortLocation,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle?.HORIZONTAL_BAR || 0,
          position: window.google.maps.ControlPosition?.TOP_CENTER || 2,
        },
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition?.RIGHT_CENTER || 6,
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
          position: window.google.maps.ControlPosition?.RIGHT_TOP || 1,
        },
        fullscreenControl: true,
        gestureHandling: 'auto',
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ color: "#f0f8f0" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#a2d2ff" }],
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [{ color: "#e8f5e8" }],
          },
          {
            featureType: "poi.business",
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "transit",
            stylers: [{ visibility: "on" }],
          },
        ],
      });

      // Resort marker with enhanced info
      const resortMarker = new window.google.maps.Marker({
        position: resortLocation,
        map,
        title: "Bukid ni Manang Farm & Resort",
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23059669'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
          scaledSize: new window.google.maps.Size(50, 50),
          anchor: new window.google.maps.Point(25, 50),
        },
        optimized: false,
      });

      // User location marker with pulse animation
      let userMarker: any = null;
      if (userLocation) {
        userMarker = new window.google.maps.Marker({
          position: userLocation,
          map,
          title: "Your Location",
          animation: window.google.maps.Animation.BOUNCE,
          icon: {
            url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'%3E%3Ccircle cx='12' cy='12' r='10' fill='%232563eb' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='12' r='4' fill='white'/%3E%3C/svg%3E",
            scaledSize: new window.google.maps.Size(24, 24),
            anchor: new window.google.maps.Point(12, 12),
          },
          optimized: false,
        });
        
        // Stop bouncing after 3 seconds
        setTimeout(() => {
          if (userMarker) {
            userMarker.setAnimation(null);
          }
        }, 3000);
      }

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family: system-ui; padding: 12px; max-width: 300px;">
            <h3 style="margin: 0 0 8px 0; color: #059669; font-weight: 600;">Bukid ni Manang Farm & Resort</h3>
            <p style="margin: 0 0 4px 0; color: #374151;">Brgy. Guinbaoyan Norte, Calbayog City, Samar</p>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Call: 0917 100 9766</p>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <button onclick="window.open('tel:09171009766')" style="background: #059669; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">Call Now</button>
              <button onclick="window.open('https://maps.google.com/maps/dir/?api=1&destination=12.0676,124.5930')" style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">Get Directions</button>
            </div>
          </div>
        `,
      });

      resortMarker.addListener("click", () => {
        infoWindow.open(map, resortMarker);
      });

      // Set up directions service with error handling
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#059669',
          strokeWeight: 4,
          strokeOpacity: 0.8
        }
      });

      // If user location is available, calculate directions
      if (userLocation && showDirections) {
        directionsService.route(
          {
            origin: userLocation,
            destination: resortLocation,
            travelMode: window.google.maps.TravelMode.DRIVING,
            avoidHighways: false,
            avoidTolls: false
          },
          (result: any, status: any) => {
            if (status === 'OK' && result?.routes?.length > 0) {
              directionsRenderer.setDirections(result);
              const route = result.routes[0];
              if (route?.legs?.length > 0) {
                setDistance(route.legs[0].distance.text);
                setDuration(route.legs[0].duration.text);
              }
            } else {
              // Fallback: Calculate straight-line distance
              const distance = calculateStraightLineDistance(userLocation, resortLocation);
              setDistance(`~${distance.toFixed(1)} km`);
              setDuration('~' + Math.round(distance * 2) + ' min');
              
              toast({
                title: "Directions Unavailable",
                description: "Showing approximate distance. Use 'Open in Google Maps' for detailed directions.",
                variant: "default",
              });
            }
          }
        );
      }
    };

    loadGoogleMaps();
  }, [apiKey, userLocation, showDirections]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({
            title: "Location Found",
            description: "Your location has been detected. Click 'Show Directions' to get driving directions.",
          });
        },
        () => {
          toast({
            title: "Location Access Denied",
            description: "Unable to access your location. You can still view the resort location on the map.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
    }
  };

  // Calculate straight-line distance between two points
  const calculateStraightLineDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toggleDirections = () => {
    if (!userLocation) {
      getUserLocation();
      return;
    }
    setShowDirections(!showDirections);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Location Controls */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={getUserLocation}
          disabled={!!userLocation}
          className="flex items-center gap-2"
          data-testid="button-get-location"
        >
          <MapPin className="h-4 w-4" />
          {userLocation ? 'Location Found' : 'Find My Location'}
        </Button>
        
        {userLocation && (
          <Button
            variant={showDirections ? "default" : "outline"}
            onClick={toggleDirections}
            className="flex items-center gap-2"
            data-testid="button-directions"
          >
            <Navigation className="h-4 w-4" />
            {showDirections ? 'Hide Directions' : 'Show Directions'}
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={() => window.open('https://maps.google.com/maps/dir/?api=1&destination=12.0676,124.5930')}
          className="flex items-center gap-2"
          data-testid="button-external-directions"
        >
          <ExternalLink className="h-4 w-4" />
          Open in Google Maps
        </Button>
        
        <Button
          variant="outline"
          onClick={() => window.open('tel:09171009766')}
          className="flex items-center gap-2"
          data-testid="button-call-resort"
        >
          <Phone className="h-4 w-4" />
          Call Resort
        </Button>
      </div>

      {/* Trip Information */}
      {userLocation && showDirections && distance && duration && (
        <Card className="glass-effect border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Driving Directions</p>
                  <p className="text-sm text-muted-foreground">From your current location</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Route className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{duration}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="mt-1">
                  Estimated driving time
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Container */}
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg border border-border shadow-lg"
          data-testid="google-maps"
        />
        {!apiKey && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading Google Maps...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Resort Information */}
      <Card className="glass-effect border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">Brgy. Guinbaoyan Norte</p>
                <p className="text-sm text-muted-foreground">Calbayog City, Samar</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Contact</p>
                <p className="text-sm text-muted-foreground">0917 100 9766</p>
                <p className="text-sm text-muted-foreground">Available 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Check-in</p>
                <p className="text-sm text-muted-foreground">2:00 PM - 10:00 PM</p>
                <p className="text-sm text-muted-foreground">Check-out: 12:00 PM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

declare global {
  interface Window {
    google: any;
  }
}