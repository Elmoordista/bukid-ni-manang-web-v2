import { useEffect, useRef, useState } from 'react';
// import { Loader } from '@googlemaps/js-api-loader';
import { Card } from './ui/card';

interface GoogleMapProps {
  apiKey: string;
  center: { lat: number; lng: number };
  zoom?: number;
}

export default function GoogleMap({ apiKey, center, zoom = 15 }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // const loader = new Loader({
    //   apiKey,
    //   version: "weekly",
    //   libraries: ["places"]
    // });
    let map = null;
    // let map: google.maps.Map | null = null;

    // loader.load().then(() => {
    //   if (mapRef.current) {
    //     map = new google.maps.Map(mapRef.current, {
    //       center,
    //       zoom,
    //       mapTypeControl: true,
    //       streetViewControl: true,
    //       fullscreenControl: true,
    //       zoomControl: true,
    //     });

    //     // Add marker for the resort
    //     new google.maps.Marker({
    //       position: center,
    //       map,
    //       title: "Bukid ni Manang Farm & Resort"
    //     });

    //     setIsLoading(false);
    //   }
    // }).catch((error: any) => {
    //   console.error("Error loading Google Maps:", error);
    //   setLoadError("Failed to load Google Maps. Please try again later.");
    //   setIsLoading(false);
    // });

    useEffect(() => {
      setIsLoading(true);
      setLoadError(null);
    }, []);

    return () => {
      // Cleanup if needed
      if (map) {
        // map.unbindAll();
      }
    };
  }, [apiKey, center, zoom]);

  if (loadError) {
    return (
      <Card className="p-4 text-center text-destructive bg-destructive/10">
        {loadError}
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="space-y-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}