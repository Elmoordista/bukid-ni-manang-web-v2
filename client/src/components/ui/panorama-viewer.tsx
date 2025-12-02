import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {  Info,Users } from 'lucide-react';
// import { BookingCalendar } from './booking-calendar';
import { cn } from '@/lib/utils';

interface PanoramaViewerProps {
  panoramaUrl: string;
  locationName: string;
  description?: string;
  facilities?: string[];
  price?: string;
  maxGuests?: number;
  isAvailable?: boolean;
  onBook?: () => void;
  className?: string;
}

export function PanoramaViewer({
  panoramaUrl,
  locationName,
  description,
  facilities = [],
  price,
  maxGuests,
  isAvailable = true,
  onBook,
  className,
}: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create sphere
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    // Load panorama texture
    const texture = new THREE.TextureLoader().load(panoramaUrl);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.set(0, 0, 0.1);

    // Controls
    let lon = 0;
    let lat = 0;
    let phi = 0;
    let theta = 0;
    let isUserInteracting = false;
    let onPointerDownPointerX = 0;
    let onPointerDownPointerY = 0;
    let onPointerDownLon = 0;
    let onPointerDownLat = 0;

    function onPointerDown(event: PointerEvent) {
      isUserInteracting = true;
      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
    }

    function onPointerMove(event: PointerEvent) {
      if (!isUserInteracting) return;

      lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
      lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
    }

    function onPointerUp() {
      isUserInteracting = false;
    }

    function onWheel(event: WheelEvent) {
      const fov = camera.fov + event.deltaY * 0.05;
      camera.fov = THREE.MathUtils.clamp(fov, 30, 90);
      camera.updateProjectionMatrix();
    }

    // Event listeners
    containerRef.current.addEventListener('pointerdown', onPointerDown);
    containerRef.current.addEventListener('pointermove', onPointerMove);
    containerRef.current.addEventListener('pointerup', onPointerUp);
    containerRef.current.addEventListener('wheel', onWheel);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      if (!isUserInteracting && autoRotate) {
        lon += 0.1;
      }

      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
      camera.position.y = 100 * Math.cos(phi);
      camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    function onResize() {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    }

    window.addEventListener('resize', onResize);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('pointerdown', onPointerDown);
        containerRef.current.removeEventListener('pointermove', onPointerMove);
        containerRef.current.removeEventListener('pointerup', onPointerUp);
        containerRef.current.removeEventListener('wheel', onWheel);
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', onResize);
    };
  }, [panoramaUrl, autoRotate]);

  return (
    <div className={cn("relative w-full", className)}>
      <div 
        ref={containerRef} 
        className={cn(
          "relative w-full aspect-[16/9] bg-black rounded-lg overflow-hidden",
          isFullscreen && "fixed inset-0 z-50 aspect-auto"
        )}
      />

      {/* Controls overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? "Stop Auto-Rotate" : "Start Auto-Rotate"}
        >
          {autoRotate ? "⏸" : "▶"}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? "⤓" : "⤢"}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setShowInfo(true)}
          title="Location Information"
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>

      {/* Location info dialog */}
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <Card className="p-6 max-w-2xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold">{locationName}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={isAvailable ? "success" : "destructive"}>
                  {isAvailable ? "Available" : "Not Available"}
                </Badge>
                {price && (
                  <Badge variant="secondary">
                    ₱{price}
                  </Badge>
                )}
              </div>
            </div>
            {maxGuests && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Up to {maxGuests} guests</span>
              </div>
            )}
          </div>

          <p className="text-muted-foreground mb-6">{description}</p>

          {facilities.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Facilities & Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {facilities.map((facility) => (
                  <Badge key={facility} variant="outline">
                    {facility}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowInfo(false)}>
              Close
            </Button>
            {onBook && (
              <Button onClick={() => {
                setShowInfo(false);
                setShowBooking(true);
              }}>
                Book Now
              </Button>
            )}
          </div>
        </Card>
      </Dialog>

      {/* Booking dialog */}
      {onBook && (
        <Dialog open={showBooking} onOpenChange={setShowBooking}>
          <Card className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Book {locationName}</h2>
            {/* <BookingCalendar 
              locationId={locationName} 
              price={price} 
              maxGuests={maxGuests}
              onBook={onBook}
            /> */}
          </Card>
        </Dialog>
      )}
    </div>
  );
}