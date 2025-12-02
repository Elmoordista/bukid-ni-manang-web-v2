import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {  RESORT_LOCATIONS } from '@/lib/virtual-tour-data';
// import Image from 'next/image';
import { PanoramaViewer } from './ui/panorama-viewer';
import { Camera, MapPin, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ResortMapProps {
  onLocationSelect?: (locationId: string) => void;
  className?: string;
}

export function ResortMap({ onLocationSelect, className }: ResortMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  // const [selectedLocation, setSelectedLocation] = useState<typeof RESORT_LOCATIONS[0] | null>(null);
  const [selectedView, setSelectedView] = useState<'info' | 'panorama' | 'booking'>('info');

  const handleLocationClick = (location: typeof RESORT_LOCATIONS[0]) => {
    setSelectedLocation(location);
    setSelectedView('info');
    onLocationSelect?.(location.id);
  };

  const getMarkerColorByType = (type: string) => {
    switch (type) {
      case 'entrance':
        return 'bg-blue-500/90 hover:bg-blue-600 ring-blue-400/50';
      case 'recreation':
        return 'bg-green-500/90 hover:bg-green-600 ring-green-400/50';
      case 'dining':
        return 'bg-orange-500/90 hover:bg-orange-600 ring-orange-400/50';
      case 'accommodation':
        return 'bg-purple-500/90 hover:bg-purple-600 ring-purple-400/50';
      case 'garden':
        return 'bg-emerald-500/90 hover:bg-emerald-600 ring-emerald-400/50';
      default:
        return 'bg-primary/90 hover:bg-primary ring-primary/50';
    }
  };

  return (
    <div className={cn("relative max-w-5xl mx-auto", className)}>
      {/* Main Map Container */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-muted-foreground/5" />
        
        {/* Main Overview Image */}
        <div className="relative aspect-[16/9]">
          {/* <Image
            src={RESORT_OVERVIEW_IMAGE}
            alt="Resort Overview"
            fill
            className="object-cover"
            priority
          /> */}

          {/* Location Markers */}
          {RESORT_LOCATIONS.map((location) => (
            <button
              key={location.id}
              onClick={() => handleLocationClick(location)}
              className={cn(
                "absolute w-8 h-8 -ml-4 -mt-4 rounded-full",
                "flex items-center justify-center text-white",
                "shadow-lg ring-4 ring-opacity-50",
                "transform hover:scale-110 transition-all duration-200",
                "animate-pulse hover:animate-none group",
                getMarkerColorByType(location.type)
              )}
              style={{
                left: `${(location.coordinates.x / 640) * 100}%`,
                top: `${(location.coordinates.y / 480) * 100}%`,
              }}
            >
              <MapPin className="h-4 w-4" />
              <span className="sr-only">{location.name}</span>
              
              {/* Tooltip */}
              <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bottom-full mb-2 px-2 py-1 bg-background/95 text-foreground text-sm rounded shadow-lg whitespace-nowrap">
                {location.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Location Legend */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Badge variant="outline" className="flex items-center gap-2 justify-center">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Entrance</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Recreation</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 justify-center">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span>Dining</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 justify-center">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Accommodation</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2 justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Garden</span>
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Location Detail Dialog */}
      {selectedLocation && (
        <Dialog open={!!selectedLocation} onOpenChange={() => setSelectedLocation(null)}>
          <DialogContent className="max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preview Image */}
              {/* <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={selectedLocation.thumbnail}
                  alt={selectedLocation.name}
                  fill
                  className="object-cover"
                />
              </div> */}

              {/* Location Details */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-semibold mb-2">{selectedLocation.name}</h2>
                <p className="text-muted-foreground mb-4">{selectedLocation.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedLocation.type}</span>
                  </div>
                  {selectedLocation.maxGuests && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Up to {selectedLocation.maxGuests} guests</span>
                    </div>
                  )}
                </div>

                {/* Available Features */}
                {selectedLocation.facilities && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Available Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocation.facilities.map((facility: string) => (
                        <Badge key={facility} variant="secondary">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-auto flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedView('panorama')}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    View 360°
                  </Button>
                  {selectedLocation.type === 'accommodation' && (
                    <Button 
                      className="flex-1"
                      onClick={() => setSelectedView('booking')}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Panorama View Dialog */}
      {selectedLocation && selectedView === 'panorama' && (
        <Dialog open={true} onOpenChange={() => setSelectedView('info')}>
          <DialogContent className="max-w-5xl p-0">
            <PanoramaViewer
              panoramaUrl={selectedLocation.panoramaUrl}
              locationName={selectedLocation.name}
              description={selectedLocation.description}
              facilities={selectedLocation.facilities}
              price={selectedLocation.price}
              maxGuests={selectedLocation.maxGuests}
              onBook={selectedLocation.type === 'accommodation' ? () => setSelectedView('booking') : undefined}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}