import { useState, useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";
// Navigation provided by RootLayout
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Maximize2, Minimize2, MapPin, Home, Info } from "lucide-react";
import { VIRTUAL_TOUR_LOCATIONS } from "@/lib/virtual-tour-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function VirtualTour() {
  // Start at Gardens & Pavilion (index 0)
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPOI, setSelectedPOI] = useState<number | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const [overlayHotspots, setOverlayHotspots] = useState<any[]>([]);

  // Preload images for faster transitions
  useEffect(() => {
    const preloadImages = async () => {
      const preloadPromises = VIRTUAL_TOUR_LOCATIONS.map(location => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = location.image;
        });
      });

      try {
        await Promise.all(preloadPromises);
        console.log('All tour images preloaded successfully');
      } catch (error) {
        console.error('Failed to preload some images:', error);
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

      try {
        const viewer = new Viewer({
          container: containerRef.current,
          panorama: VIRTUAL_TOUR_LOCATIONS[selectedLocation].image,
          navbar: false,
          touchmoveTwoFingers: false,
          mousewheelCtrlKey: false,
          defaultZoomLvl: 0,
          minFov: 30,
          maxFov: 90,
          defaultYaw: 0,
          defaultPitch: 0,
          moveSpeed: 1.5,
          zoomSpeed: 1.5,
          preload: true,
          loadingImg: null,
          requestHeaders: {
            'Cache-Control': 'max-age=3600'
          },
          fisheye: false,
          markers: VIRTUAL_TOUR_LOCATIONS[selectedLocation].hotspots.map(hotspot => ({
            id: hotspot.id,
            position: { yaw: hotspot.yaw, pitch: hotspot.pitch },
            html: hotspot.type === 'location-marker' 
              ? `<div class="psv-marker psv-marker--fixed psv-location-marker"></div>` 
              : `<div class="psv-marker psv-marker--fixed psv-hotspot-arrow bg-black/60 text-white">${hotspot.label}</div>`,
            tooltip: hotspot.label,
            width: hotspot.type === 'location-marker' ? 16 : 32,
            height: hotspot.type === 'location-marker' ? 16 : 32,
            anchor: 'center center',
            style: {
              cursor: 'pointer',
              pointerEvents: 'auto'
            }
          }))
        });

        viewerRef.current = viewer;        // Add loading handlers
        viewer.addEventListener('before-render', () => setIsLoading(true));
        viewer.addEventListener('ready', () => setIsLoading(false));
        viewer.addEventListener('position-updated', () => setIsLoading(false));
        viewer.addEventListener('click', (e: any) => {
          if (e.marker) {
            const hotspot = VIRTUAL_TOUR_LOCATIONS[selectedLocation].hotspots.find(h => h.id === e.marker.id);
            if (hotspot) {
              navigateToLocation(hotspot.targetId);
            }
          }
        });

      setViewerError(null);
    } catch (error: any) {
      console.error("Failed to initialize panorama viewer:", error);
      setViewerError(error?.message || "Failed to load panorama viewer");
    }

    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          console.error("Error destroying viewer:", e);
        }
        viewerRef.current = null;
      }
    };
  }, [selectedLocation]);

  useEffect(() => {
    if (viewerRef.current) {
      try {
        setIsLoading(true);
        const location = VIRTUAL_TOUR_LOCATIONS[selectedLocation];

        // Show preview image first
        const previewImg = document.createElement('img');
        previewImg.src = location.previewImage;
        previewImg.onload = () => {
          if (viewerRef.current) {
            viewerRef.current.setPanorama(location.image, {
              transition: true,
              showLoader: true,
            });
          }
        };

        // Set up overlay hotspots
        const overlays = (location.hotspots || []).map((h: any) => {
          const leftPct = h.screenX ?? 50;
          const topPct = h.screenY ?? 50;
          // determine arrow direction from label
          let arrow = h.label.includes('→') ? '→' : 
                     h.label.includes('←') ? '←' :
                     h.label.includes('↑') ? '↑' : '↓';

          return {
            id: h.id,
            left: `${leftPct}%`,
            top: `${topPct}%`,
            label: h.label,
            targetId: h.targetId,
            description: h.description,
            arrow,
            screenX: leftPct,
            screenY: topPct,
          };
        });
        setOverlayHotspots(overlays);
        setSelectedPOI(null);
      } catch (error) {
        console.error("Failed to set panorama:", error);
        setIsLoading(false);
      }
    }
  }, [selectedLocation]);

  const navigateToLocation = (targetId: string) => {
    const idx = VIRTUAL_TOUR_LOCATIONS.findIndex(loc => loc.id === targetId);
    if (idx >= 0) {
      setSelectedLocation(idx);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      fullscreenContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Inline styles for hotspot arrows */}
      <style>{`
        .psv-hotspot-arrow {
          padding: 6px 8px;
          border-radius: 6px;
          font-weight: 700;
          transform: rotate(90deg);
          transition: all 0.2s;
        }
        .psv-hotspot-arrow:hover {
          transform: rotate(90deg) scale(1.1);
          background: rgba(0,0,0,0.8);
        }
        .psv-location-marker {
          padding: 8px;
          border-radius: 50%;
          background: rgba(0,128,0,0.6);
          border: 2px solid white;
          width: 12px;
          height: 12px;
          transition: all 0.3s ease;
        }
        .psv-location-marker:hover {
          transform: scale(1.2);
          background: rgba(0,128,0,0.8);
        }
        .location-button {
          transition: all 0.3s ease;
        }
        .location-button:hover {
          transform: translateY(-2px);
        }
      `}</style>
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-800 dark:text-green-400 mb-2" data-testid="text-page-title">
            Interactive Virtual Tour
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            {VIRTUAL_TOUR_LOCATIONS[selectedLocation].description}
          </p>
        </div>

        {/* Main Tour Container */}
        <div ref={fullscreenContainerRef} className="relative">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Panorama Viewer */}
            <div className="relative" style={{ height: "70vh" }}>
              <div ref={containerRef} className="w-full h-full" data-testid="panorama-viewer" />
              
              {/* Loading Overlay */}
              {/* Loading indicator removed */}
              
              {/* Points of Interest Panel */}
              <div className="absolute top-16 left-4 z-30 space-y-2">
                {VIRTUAL_TOUR_LOCATIONS[selectedLocation].pointsOfInterest?.map((poi, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`p-2 rounded-full ${selectedPOI === index ? 'bg-green-500 text-white' : 'bg-black/60 text-white hover:bg-black/80'}`}
                          onClick={() => setSelectedPOI(selectedPOI === index ? null : index)}
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <div>
                          <p className="font-semibold">{poi.title}</p>
                          <p className="text-sm">{poi.description}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              
              {/* Overlay hotspots */}
              {overlayHotspots.map((h) => (
                <TooltipProvider key={h.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="absolute z-20 p-0"
                        style={{ left: h.left, top: h.top, transform: 'translate(-50%, -50%)' }}
                        onClick={() => navigateToLocation(h.targetId)}
                      >
                        <div className="psv-hotspot-arrow bg-black/60 text-white">{h.arrow}</div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{h.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}

              {/* Location Label Overlay */}
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 sm:px-4 py-2 rounded-lg backdrop-blur-sm" data-testid="text-current-location">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold text-sm sm:text-base">{VIRTUAL_TOUR_LOCATIONS[selectedLocation].name}</span>
                </div>
              </div>

              {/* Fullscreen Toggle */}
              <Button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white backdrop-blur-sm"
                size="icon"
                data-testid="button-fullscreen-toggle"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </Button>

              {/* Error Fallback */}
              {viewerError && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                  <div className="text-center p-8 max-w-md">
                    <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Virtual Tour Unavailable
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Your browser doesn't support the 3D viewer. Please try a different browser.
                    </p>
                    <img 
                      src={VIRTUAL_TOUR_LOCATIONS[selectedLocation].image}
                      alt={VIRTUAL_TOUR_LOCATIONS[selectedLocation].name}
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Navigation Buttons */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {VIRTUAL_TOUR_LOCATIONS.map((location, index) => (
                <Button
                  key={location.id}
                  variant={selectedLocation === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLocation(index)}
                  className="w-full truncate location-button"
                >
                  {location.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm sm:text-base">Look Around</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Click and drag to explore the view</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm sm:text-base">Points of Interest</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Click the info buttons to learn more about each spot</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm sm:text-base">Navigate</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Click arrows or use the buttons below to move between locations</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back Button */}
          <div className="mt-4 flex items-center justify-between">
            <Button
              onClick={() => window.location.href = "/home"}
              variant="outline"
              className="flex items-center gap-2"
              data-testid="button-back-home"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}