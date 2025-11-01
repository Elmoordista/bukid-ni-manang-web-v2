import { type Hotspot } from './constants';

// All resort locations with their coordinates for the clickable map
export const RESORT_LOCATIONS = [
  // Main Areas
  {
    id: "gardens-pavilion",
    name: "Gardens & Pavilion",
    description: "Beautiful gardens and events pavilion",
    coordinates: { x: 280, y: 340 },
    panoramaUrl: "/attached_assets/DJI_0915_1759384092811.html",
    thumbnail: "/attached_assets/att.l0KSG7zQLujrXWlHml4ms1w_FnN3GO-sqTfbHQTbZqE_1759384034742.jpeg",
    type: "garden"
  }
];

// Simplified tour with just the garden pavilion
export const VIRTUAL_TOUR_LOCATIONS = [
  {
    id: "gardens-pavilion",
    name: "Gardens & Pavilion",
    image: "/attached_assets/att.l0KSG7zQLujrXWlHml4ms1w_FnN3GO-sqTfbHQTbZqE_1759384034742.jpeg",
    hotspots: [
      { id: 'h-garden-pool', targetId: 'gardens-pavilion', yaw: -120, pitch: 0, label: '← Pool Area', screenX: 35, screenY: 50 },
      { id: 'h-garden-rooms', targetId: 'gardens-pavilion', yaw: 90, pitch: 0, label: '→ Hotel Rooms', screenX: 70, screenY: 48 },
      { id: 'h-garden-entrance', targetId: 'gardens-pavilion', yaw: 180, pitch: 0, label: '↓ Main Entrance', screenX: 50, screenY: 70 }
    ] as (Hotspot & { screenX?: number; screenY?: number })[]
  }
];