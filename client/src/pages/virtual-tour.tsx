import { useState, useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";
// Navigation is provided by RootLayout
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Maximize2, Minimize2, MapPin, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { VIRTUAL_TOUR_LOCATIONS } from "@/lib/virtual-tour-data";

export default function VirtualTour() {
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const [overlayHotspots, setOverlayHotspots] = useState<any[]>([]);
  const [accommodationPrices, setAccommodationPrices] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const dragState = useRef<{ id?: string; offsetX?: number; offsetY?: number } | null>(null);
  const markersPluginRef = useRef<any | null>(null);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    try {
      viewerRef.current = new Viewer({
        container: containerRef.current,
        panorama: VIRTUAL_TOUR_LOCATIONS[selectedLocation].image,
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
        // useXmpData: false,
        // preload: true,
        requestHeaders: {
          'Cache-Control': 'max-age=3600'
        }
      });
      // markers plugin is optional and not installed in this repo; use overlay hotspots by default
      markersPluginRef.current = null;
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
  }, []);

  useEffect(() => {
    if (viewerRef.current) {
      try {
        const location = VIRTUAL_TOUR_LOCATIONS[selectedLocation] as any;
        viewerRef.current.setPanorama(location.image, {
          transition: true,
          showLoader: true,
        });
        const pluginClass = markersPluginRef.current;
        if (pluginClass) {
          try {
            const plugin = viewerRef.current.getPlugin(pluginClass);
            if (plugin) {
              const newMarkers = (location.hotspots || []).map((h: any) => ({
                id: h.id,
                longitude: (h.yaw * Math.PI) / 180,
                latitude: (h.pitch * Math.PI) / 180,
                width: 40,
                height: 40,
                anchor: 'center',
                tooltip: h.label,
                data: { targetId: h.targetId },
                content: `<div class="psv-hotspot-arrow" data-id="${h.id}">➤</div>`,
              }));
              (plugin as any).clearMarkers();
              (plugin as any).addMarkers(newMarkers as any);
              (plugin as any).on('select-marker', (e: any) => {
                const targetId = e.marker.data?.targetId;
                if (targetId) {
                  const idx = VIRTUAL_TOUR_LOCATIONS.findIndex((l) => l.id === targetId);
                  if (idx >= 0) setSelectedLocation(idx);
                }
              });
              setOverlayHotspots([]);
              return;
            }
          } catch (err) {
            console.warn('Markers plugin error, falling back to overlay:', err);
            // fall through to overlay
          }
        }

        // fallback overlay hotspots
        const overlays = (location.hotspots || []).map((h: any) => {
          const leftPct = h.screenX ?? 50;
          const topPct = h.screenY ?? 50;
          // determine arrow direction primarily from horizontal position, then vertical
          let arrow = '→';
          if (leftPct <= 33) arrow = '←';
          else if (leftPct >= 67) arrow = '→';
          else if (topPct <= 33) arrow = '↑';
          else if (topPct >= 67) arrow = '↓';

          return {
            id: h.id,
            left: `${leftPct}%`,
            top: `${topPct}%`,
            label: h.label,
            targetId: h.targetId,
            arrow,
            screenX: leftPct,
            screenY: topPct,
          };
        });
        setOverlayHotspots(overlays);
      } catch (error) {
        console.error("Failed to set panorama:", error);
      }
    }
  }, [selectedLocation]);

  // Fetch accommodations to derive prices for room panoramas. Fails gracefully if API isn't available.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/accommodations');
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        const map: Record<string, string> = {};
        for (const a of data) {
          if (!a || !a.name) continue;
          // normalize name for quick includes matching
          map[a.name.toLowerCase()] = a.pricePerNight ?? a.price ?? '';
        }
        setAccommodationPrices(map);
      } catch (err) {
        // ignore network errors in dev when server isn't running
        console.warn('Could not fetch accommodations for prices:', err);
      }
    })();
    return () => { mounted = false };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      fullscreenContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const goToNext = () => {
    setSelectedLocation((prev) => (prev + 1) % VIRTUAL_TOUR_LOCATIONS.length);
  };

  const goToPrevious = () => {
    setSelectedLocation((prev) => (prev - 1 + VIRTUAL_TOUR_LOCATIONS.length) % VIRTUAL_TOUR_LOCATIONS.length);
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
      {/* Inline styles specific to tour page to ensure hotspot arrows and gallery look right */}
      <style>{`.psv-hotspot-arrow{padding:6px 8px;border-radius:6px;font-weight:700;transform:rotate(90deg);}
        .gallery-thumb img{transition:transform .2s}
        .gallery-thumb:hover img{transform:scale(1.03)}
      `}</style>
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-800 dark:text-green-400 mb-2" data-testid="text-page-title">
            360° Virtual Tour
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            Explore Bukid ni Manang Farm & Resort
          </p>
        </div>

        {/* Main Tour Container */}
        <div ref={fullscreenContainerRef} className="relative">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Panorama Viewer */}
            <div className="relative lg:flex lg:items-stretch">
              <div className="flex-1 relative" style={{ height: "70vh" }}>
              <div ref={containerRef} className="w-full h-full" data-testid="panorama-viewer" />
              {/* Overlay hotspots (fallback when markers plugin isn't present) */}
              {overlayHotspots.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    const idx = VIRTUAL_TOUR_LOCATIONS.findIndex((l) => l.id === h.targetId);
                    if (idx >= 0) setSelectedLocation(idx);
                  }}
                  className="absolute z-20 p-0"
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
                    const container = containerRef.current;
                    if (!container) return;
                    const rect = container.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const left = Math.max(0, Math.min(100, (x / rect.width) * 100));
                    const top = Math.max(0, Math.min(100, (y / rect.height) * 100));
                    setOverlayHotspots((prev) => prev.map((ph) => ph.id === h.id ? { ...ph, left: `${left}%`, top: `${top}%`, screenX: left, screenY: top } : ph));
                  }}
                >
                  <div className="psv-hotspot-arrow bg-black/60 text-white">{h.arrow ?? '➤'}</div>
                </button>
              ))}
              {/* Edit UI controls (dev mode) */}
              <div className="absolute top-4 right-16 z-30">
                <div className="flex gap-2">
                  <Button size="sm" variant={isEditMode ? 'destructive' : 'secondary'} onClick={() => setIsEditMode(!isEditMode)}>
                    {isEditMode ? 'Stop Editing' : 'Edit Hotspots'}
                  </Button>
                  {isEditMode && (
                    <Button size="sm" onClick={() => {
                      // download current hotspots JSON
                      const data = VIRTUAL_TOUR_LOCATIONS.map((loc) => ({ id: loc.id, hotspots: (loc as any).hotspots || [] }));
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'hotspots.json';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}>Export Hotspots</Button>
                  )}
                </div>
              </div>
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
                      Your browser doesn't support the 3D viewer. Please view the location images below.
                    </p>
                    <img 
                      src={VIRTUAL_TOUR_LOCATIONS[selectedLocation].image}
                      alt={VIRTUAL_TOUR_LOCATIONS[selectedLocation].name}
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              )}
              
              {/* Location Label Overlay */}
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 sm:px-4 py-2 rounded-lg backdrop-blur-sm" data-testid="text-current-location">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold text-sm sm:text-base">{VIRTUAL_TOUR_LOCATIONS[selectedLocation].name}</span>
                </div>
              </div>

              {/* Price badge for room panoramas (if known) */}
              {(() => {
                const loc = VIRTUAL_TOUR_LOCATIONS[selectedLocation] as any;
                const lookupKey = (loc.accommodationName || loc.name || '').toLowerCase();
                const priceFromMap = accommodationPrices[lookupKey];
                // fallback heuristic from name
                let fallbackPrice: string | null = null;
                const lname = loc.name.toLowerCase();
                if (lname.includes('cottage')) fallbackPrice = '₱500';
                else if (lname.includes('suite') || lname.includes('family') || lname.includes('deluxe')) fallbackPrice = '₱1000';
                else if (lname.includes('standard') || lname.includes('room')) fallbackPrice = '₱500';

                const displayPrice = priceFromMap ? `₱${parseFloat(priceFromMap).toFixed(0)}` : fallbackPrice;
                return displayPrice ? (
                  <div className="absolute top-4 right-16 bg-green-600 text-white px-3 py-1 rounded-md z-40 text-sm font-semibold">
                    {displayPrice}
                  </div>
                ) : null;
              })()}

              {/* Fullscreen Toggle */}
              <Button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white backdrop-blur-sm"
                size="icon"
                data-testid="button-fullscreen-toggle"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </Button>

              {/* Navigation Arrows */}
              {/* Right-side stacked navigation arrows (both on the right outside) */}
              <div className="absolute right-2 sm:right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-40">
                <Button
                  onClick={goToPrevious}
                  className="bg-black/70 hover:bg-black/90 text-white backdrop-blur-sm h-10 w-10 sm:h-12 sm:w-12"
                  size="icon"
                  data-testid="button-previous-location"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
                <Button
                  onClick={goToNext}
                  className="bg-black/70 hover:bg-black/90 text-white backdrop-blur-sm h-10 w-10 sm:h-12 sm:w-12"
                  size="icon"
                  data-testid="button-next-location"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </div>

              </div>

              {/* Right-side gallery */}
              <div className="w-80 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-3 sm:p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Gallery</h3>
                  <Button size="sm" onClick={() => setShowThumbnails(!showThumbnails)}>{showThumbnails ? 'Hide' : 'Show'}</Button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {VIRTUAL_TOUR_LOCATIONS.map((location, index) => (
                    <div key={location.id} className={`gallery-thumb relative rounded-lg overflow-hidden cursor-pointer transition-shadow ${selectedLocation === index ? 'ring-2 ring-green-600' : ''}`} onClick={() => setSelectedLocation(index)}>
                      <img src={location.image} alt={location.name} className="w-full h-28 object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{location.name}</span>
                          {/* prefer prices fetched from server, otherwise fall back to heuristics */}
                          {(() => {
                            const price = accommodationPrices[location.name.toLowerCase()];
                            if (price) return <span className="text-sm">₱{parseFloat(price).toFixed(0)}</span>;
                            const lname = location.name.toLowerCase();
                            if (lname.includes('cottage')) return <span className="text-sm">₱500</span>;
                            if (lname.includes('suite') || lname.includes('family') || lname.includes('deluxe')) return <span className="text-sm">₱1000</span>;
                            if (lname.includes('standard') || lname.includes('room')) return <span className="text-sm">₱500</span>;
                            return <span className="text-sm">-</span>;
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* (Right-side gallery replaces the bottom thumbnails) */}
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
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm sm:text-base">Click & Drag</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Look around by clicking and dragging the view</p>
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
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm sm:text-base">Scroll to Zoom</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Use mouse wheel to zoom in and out</p>
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
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 text-sm sm:text-base">Navigate Locations</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Click thumbnails or use arrow buttons</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Counter & Back Button */}
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
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Location <span className="font-bold text-green-600 dark:text-green-400">{selectedLocation + 1}</span> of{" "}
              <span className="font-bold">{VIRTUAL_TOUR_LOCATIONS.length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
