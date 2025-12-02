import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { VIRTUAL_TOUR_LOCATIONS } from "@/lib/virtual-tour-data-enhanced";
import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";

interface VirtualTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VirtualTourModal({ isOpen, onClose }: VirtualTourModalProps) {
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const currentLocation = VIRTUAL_TOUR_LOCATIONS[currentLocationIndex];
  const viewerRef = useRef<HTMLDivElement>(null);
  const photoSphereViewerRef = useRef<Viewer | null>(null);
  const [overlayHotspots, setOverlayHotspots] = useState<any[]>([]);
  const markersPluginRef = useRef<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const dragState = useRef<{ id?: string; offsetX?: number; offsetY?: number } | null>(null);

  useEffect(() => {
    if (isOpen && viewerRef.current && !photoSphereViewerRef.current) {
      photoSphereViewerRef.current = new Viewer({
        container: viewerRef.current,
        panorama: currentLocation.image,
        navbar: false,
        loadingImg: "",
        touchmoveTwoFingers: true,
        mousewheelCtrlKey: false,
        defaultZoomLvl: 50,
        minFov: 30,
        maxFov: 90,
        defaultYaw: 0,
        defaultPitch: 0,
        moveSpeed: 1.5,
        zoomSpeed: 1.5,
        fisheye: false,
        requestHeaders: {
          'Cache-Control': 'max-age=3600'
        },
        // markers: (currentLocation.hotspots || []).map(hotspot => ({
        //   id: hotspot.id,
        //   position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
        //   html: `<div class="psv-marker psv-marker--fixed psv-hotspot-arrow bg-black/60 text-white">${hotspot.label}</div>`,
        //   tooltip: hotspot.description,
        //   width: 32,
        //   height: 32,
        //   anchor: 'center center',
        //   style: {
        //     cursor: 'pointer',
        //     pointerEvents: 'auto'
        //   }
        // }))
      });
      // markers plugin is optional and not installed here; use overlay hotspots by default
      markersPluginRef.current = null;
    }

    return () => {
      if (photoSphereViewerRef.current) {
        photoSphereViewerRef.current.destroy();
        photoSphereViewerRef.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (photoSphereViewerRef.current && currentLocation.image) {
      photoSphereViewerRef.current.setPanorama(currentLocation.image, {
        transition: true,
      });
      const pluginClass = markersPluginRef.current;
      if (pluginClass) {
        try {
          const plugin = photoSphereViewerRef.current.getPlugin(pluginClass);
          console.log(plugin)
          // if (plugin) {
          //   const newMarkers = (currentLocation as any).hotspots?.map((h: any) => ({
          //     id: h.id,
          //     longitude: (h.yaw * Math.PI) / 180,
          //     latitude: (h.pitch * Math.PI) / 180,
          //     width: 40,
          //     height: 40,
          //     anchor: 'center',
          //     tooltip: h.label,
          //     data: { targetId: h.targetId },
          //     content: `<div class="psv-hotspot-arrow" data-id="${h.id}">➤</div>`,
          //   })) || [];
          //   plugin.clearMarkers();
          //   plugin.addMarkers(newMarkers as any);
          //   plugin.on('select-marker', (e: any) => {
          //     const targetId = e.marker.data?.targetId;
          //     if (targetId) {
          //       const idx = VIRTUAL_TOUR_LOCATIONS.findIndex((l) => l.id === targetId);
          //       if (idx >= 0) setCurrentLocationIndex(idx);
          //     }
          //   });
          //   setOverlayHotspots([]);
          //   return;
          // }
        } catch (err) {
          console.warn('Markers plugin failed in modal; falling back to overlays', err);
        }
      }

      // fallback overlays
      const overlays = (currentLocation as any).hotspots?.map((h: any) => ({
        id: h.id,
        left: `${h.screenX ?? 50}%`,
        top: `${h.screenY ?? 50}%`,
        label: h.label,
        targetId: h.targetId,
      })) || [];
      setOverlayHotspots(overlays);
    }
  }, [currentLocation.image]);

  const goToPrevious = () => {
    setCurrentLocationIndex((prev) => 
      prev === 0 ? VIRTUAL_TOUR_LOCATIONS.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentLocationIndex((prev) => 
      prev === VIRTUAL_TOUR_LOCATIONS.length - 1 ? 0 : prev + 1
    );
  };

  const goToLocation = (index: number) => {
    setCurrentLocationIndex(index);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl p-0 bg-black" data-testid="modal-virtual-tour">
        <div className="relative w-full">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            onClick={onClose}
            data-testid="button-close-tour"
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="relative aspect-video">
            <div 
              ref={viewerRef} 
              className="w-full h-full rounded-lg"
              data-testid="panorama-viewer"
            />
            {/* Overlay hotspots (fallback when markers plugin not present) */}
            {overlayHotspots.map((h) => (
              <button
                key={h.id}
                onClick={() => {
                  const idx = VIRTUAL_TOUR_LOCATIONS.findIndex((l) => l.id === h.targetId);
                  if (idx >= 0) setCurrentLocationIndex(idx);
                }}
                className="absolute z-30 p-0"
                style={{ left: h.left, top: h.top, transform: 'translate(-50%, -50%)' }}
                title={h.label}
                onMouseDown={(e) => {
                  if (!isEditMode) return;
                  e.preventDefault();
                  const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  dragState.current = { id: h.id, offsetX: x, offsetY: y };
                }}
                onMouseUp={() => {
                  if (!isEditMode) return;
                  dragState.current = null;
                }}
                onMouseMove={(e) => {
                  if (!isEditMode) return;
                  if (!dragState.current || dragState.current.id !== h.id) return;
                  const container = viewerRef.current as HTMLElement | null;
                  if (!container) return;
                  const rect = container.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const left = Math.max(0, Math.min(100, (x / rect.width) * 100));
                  const top = Math.max(0, Math.min(100, (y / rect.height) * 100));
                  setOverlayHotspots((prev) => prev.map((ph) => ph.id === h.id ? { ...ph, left: `${left}%`, top: `${top}%`, screenX: left, screenY: top } : ph));
                }}
              >
                <div className="psv-hotspot-arrow bg-black/60 text-white">➤</div>
              </button>
            ))}
            {/* Modal edit UI */}
            <div className="absolute top-4 right-20 z-40">
              <div className="flex gap-2">
                <Button size="sm" variant={isEditMode ? 'destructive' : 'secondary'} onClick={() => setIsEditMode(!isEditMode)}>
                  {isEditMode ? 'Stop Editing' : 'Edit Hotspots'}
                </Button>
                {isEditMode && (
                  <Button size="sm" onClick={() => {
                    const data = VIRTUAL_TOUR_LOCATIONS.map((loc) => ({ id: loc.id, hotspots: (loc as any).hotspots || [] }));
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'hotspots-modal.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}>Export Hotspots</Button>
                )}
              </div>
            </div>
            
            {/* Tour Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-accent"
                  onClick={goToPrevious}
                  data-testid="button-tour-prev"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="text-white text-sm font-medium" data-testid="text-tour-location">
                  {currentLocation.name} ({currentLocationIndex + 1}/{VIRTUAL_TOUR_LOCATIONS.length})
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-accent"
                  onClick={goToNext}
                  data-testid="button-tour-next"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Fullscreen Toggle */}
            <div className="absolute bottom-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-black/50 backdrop-blur-sm hover:bg-black/70"
                onClick={toggleFullscreen}
                data-testid="button-toggle-fullscreen"
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </Button>
            </div>
            
            {/* Location Selector */}
            <div className="absolute top-4 left-4 space-y-2 max-h-[80vh] overflow-y-auto z-10">
              {VIRTUAL_TOUR_LOCATIONS.map((location, index) => (
                <Button
                  key={location.id}
                  variant={index === currentLocationIndex ? "default" : "secondary"}
                  size="sm"
                  className="block text-left w-full"
                  onClick={() => goToLocation(index)}
                  data-testid={`button-tour-location-${location.id}`}
                >
                  {location.name}
                </Button>
              ))}
            </div>
            
            {/* Usage Instructions */}
            <div className="absolute top-4 right-20 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg z-10" data-testid="text-tour-instructions">
              <p className="font-semibold mb-1">🖱️ Controls:</p>
              <p>• Drag to look around</p>
              <p>• Scroll to zoom</p>
              <p>• Auto-rotate enabled</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
