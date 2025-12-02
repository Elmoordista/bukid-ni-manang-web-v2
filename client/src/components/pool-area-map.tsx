import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
// import { POOL_OVERVIEW_IMAGE, POOL_LOCATIONS } from '@/lib/virtual-tour-data';
import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import { any } from 'zod';

export interface PoolAreaMapProps {
  onLocationSelect?: (locationId: string) => void;
}

export function PoolAreaMap({ onLocationSelect }: PoolAreaMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // const POOL_OVERVIEW_IMAGE = '/images/pool-overview.jpg';
  const POOL_LOCATIONS = [
    {
      id: 'location1',
      name: 'Main Pool',
      description: 'The main swimming pool area with lounge chairs and umbrellas.',
      coordinates: { x: 400, y: 300 },
      thumbnail: '/images/pool-main.jpg',
      panoramaUrl: 'https://example.com/panorama/main-pool',
    },
  ];
  // const [POOL_LOCATIONS, setPoolLocations] = useState<any>(null);
  // const [POOL_LOCATIONS, setPoolLocations] = useState<any>(null);

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location);
    setDialogOpen(true);
    onLocationSelect?.(location.id);
  };

  return (
    <div className="relative w-full aspect-[16/9] bg-muted rounded-lg overflow-hidden">
      {/* Main overview image */}
      {/* <Image
        src={POOL_OVERVIEW_IMAGE ? POOL_OVERVIEW_IMAGE : '/images/pool-overview-placeholder.jpg'}
        alt="Pool Area Overview"
        width={1600}
        height={900}
        className="object-cover"
      /> */}

      {/* Clickable location markers */}
      {POOL_LOCATIONS?.map((location: any) => (
        <button
          key={location.id}
          onClick={() => handleLocationClick(location)}
          className="absolute w-8 h-8 -ml-4 -mt-4 bg-primary/80 hover:bg-primary rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-transform cursor-pointer"
          style={{
            left: `${location.coordinates.x}px`,
            top: `${location.coordinates.y}px`,
          }}
          title={location.name}
        >
          <span className="sr-only">{location.name}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </button>
      ))}

      {/* Location detail dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div className="p-6">
          {selectedLocation && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">{selectedLocation.name}</h2>
              <p className="text-muted-foreground mb-4">{selectedLocation.description}</p>
              
              {/* <div className="mb-4">
                <Image
                  src={selectedLocation.thumbnail}
                  alt={selectedLocation.name}
                  width={800}
                  height={450}
                  className="rounded-lg"
                />
              </div> */}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    window.open(selectedLocation.panoramaUrl, '_blank');
                    setDialogOpen(false);
                  }}
                >
                  View 360° Tour
                </Button>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}