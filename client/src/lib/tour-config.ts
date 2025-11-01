// Type definitions for the virtual tour
export type Hotspot = {
  id: string;
  targetId: string;
  yaw: number;    // degrees
  pitch: number;  // degrees
  label?: string;
  screenX?: number;
  screenY?: number;
};

export type Location = {
  id: string;
  name: string;
  image: string;
  hotspots: Hotspot[];
};

// Main virtual tour configuration
// Virtual Tour Locations with logical navigation flow and directional arrows
export const VIRTUAL_TOUR_LOCATIONS: Location[] = [
  {
    id: "main-entrance",
    name: "Main Entrance & Welcome Area",
    image: "/attached_assets/IMG_9890_1759418259559.jpeg",
    hotspots: [
      { id: 'h-main-1', targetId: 'water-park', yaw: 30, pitch: 0, label: '→ Water Park', screenX: 65, screenY: 48 },
      { id: 'h-main-2', targetId: 'restaurant', yaw: -60, pitch: 0, label: '← Restaurant', screenX: 28, screenY: 52 },
      { id: 'h-main-3', targetId: 'resort-grounds', yaw: 90, pitch: 0, label: '↗ Resort Grounds', screenX: 75, screenY: 45 },
    ],
  },
  {
    id: "water-park",
    name: "Water Park & Pool Area",
    image: "/attached_assets/IMG_9893_1759418259559.jpeg",
    hotspots: [
      { id: 'h-water-1', targetId: 'main-entrance', yaw: 210, pitch: 0, label: '← Main Entrance', screenX: 35, screenY: 50 },
      { id: 'h-water-2', targetId: 'resort-grounds', yaw: 120, pitch: 0, label: '→ Resort Grounds', screenX: 70, screenY: 48 },
      { id: 'h-water-3', targetId: 'recreation-area', yaw: 45, pitch: 0, label: '↗ Recreation Area', screenX: 80, screenY: 45 }
    ]
  },
  {
    id: "resort-grounds",
    name: "Resort Grounds & Gardens",
    image: "/attached_assets/att.rfPtVeaJwnebcgbjD5jlXsCNy5QOqkVLuGlJdqan_2c_1759384034742.jpeg",
    hotspots: [
      { id: 'h-grounds-1', targetId: 'water-park', yaw: -120, pitch: 0, label: '← Water Park', screenX: 30, screenY: 50 },
      { id: 'h-grounds-2', targetId: 'gardens-pavilion', yaw: 60, pitch: 0, label: '→ Gardens & Pavilion', screenX: 65, screenY: 48 },
      { id: 'h-grounds-3', targetId: 'hilltop-gazebo', yaw: 30, pitch: 10, label: '↗ Hilltop View', screenX: 75, screenY: 40 }
    ]
  },
  {
    id: "gardens-pavilion",
    name: "Gardens & Pavilion",
    image: "/attached_assets/att.l0KSG7zQLujrXWlHml4ms1w_FnN3GO-sqTfbHQTbZqE_1759384034742.jpeg",
    hotspots: [
      { id: 'h-garden-1', targetId: 'resort-grounds', yaw: -120, pitch: 0, label: '← Resort Grounds', screenX: 35, screenY: 50 },
      { id: 'h-garden-2', targetId: 'hotel-rooms', yaw: 90, pitch: 0, label: '→ Hotel Rooms', screenX: 70, screenY: 48 }
    ]
  },
  {
    id: "hotel-rooms",
    name: "Hotel Rooms & Accommodations ⭐ Click arrows to explore rooms",
    image: "/attached_assets/IMG_9192_1756782230937.jpeg",
    hotspots: [
      { id: 'h-hotel-1', targetId: 'gardens-pavilion', yaw: -90, pitch: 0, label: '← Gardens', screenX: 30, screenY: 50 },
      { id: 'h-hotel-2', targetId: 'recreation-area', yaw: 90, pitch: 0, label: '→ Recreation Area', screenX: 70, screenY: 48 },
      // All room views from central location
      { id: 'h-hotel-3', targetId: 'deluxe-room', yaw: -45, pitch: -15, label: '↖ Deluxe Room', screenX: 35, screenY: 35 },
      { id: 'h-hotel-4', targetId: 'standard-room', yaw: -15, pitch: -15, label: '↑ Standard Room', screenX: 45, screenY: 35 },
      // family-suite and garden-view removed
    ]
  },
  {
    id: "deluxe-room",
    name: "Deluxe Room Interior",
    image: "/attached_assets/IMG_9195_1756782230937.jpeg",
    hotspots: [
      { id: 'h-deluxe-back', targetId: 'hotel-rooms', yaw: 180, pitch: 10, label: '↓ Back to Room Selection', screenX: 50, screenY: 65 },
      { id: 'h-deluxe-bathroom', targetId: 'deluxe-bathroom', yaw: 90, pitch: 0, label: '→ Bathroom', screenX: 70, screenY: 50 }
    ]
  },
  {
    id: "deluxe-bathroom",
    name: "Deluxe Room Bathroom",
    image: "/attached_assets/IMG_9196_1756782230937.jpeg",
    hotspots: [
      { id: 'h-deluxe-bath-back', targetId: 'deluxe-room', yaw: -90, pitch: 0, label: '← Back to Room', screenX: 30, screenY: 50 }
    ]
  },
  {
    id: "standard-room",
    name: "Standard Room Interior",
    image: "/attached_assets/IMG_9197_1756782230937.jpeg",
    hotspots: [
      { id: 'h-standard-back', targetId: 'hotel-rooms', yaw: 180, pitch: 10, label: '↓ Back to Room Selection', screenX: 50, screenY: 65 }
    ]
  },
  // family-suite and garden-view locations removed
  {
    id: "recreation-area",
    name: "Recreation & Activity Area",
    image: "/attached_assets/att.20miQRo_3rSDHMJ8pSN9HryvVx_ilFM7mSgQvOa88wc_1759384034742.jpeg",
    hotspots: [
      { id: 'h-rec-1', targetId: 'hotel-rooms', yaw: -90, pitch: 0, label: '← Hotel Rooms', screenX: 30, screenY: 50 },
      { id: 'h-rec-2', targetId: 'sports-courts', yaw: 90, pitch: 0, label: '→ Sports Courts', screenX: 70, screenY: 48 }
    ]
  },
  {
    id: "restaurant",
    name: "Lutong Bahay Restaurant",
    image: "/attached_assets/IMG_9896_1759418259559.jpeg",
    hotspots: [
      { id: 'h-rest-1', targetId: 'main-entrance', yaw: 160, pitch: 0, label: '← Main Entrance', screenX: 35, screenY: 50 },
      { id: 'h-rest-2', targetId: 'resort-grounds', yaw: -30, pitch: 0, label: '→ Resort Grounds', screenX: 65, screenY: 48 }
    ]
  },
  {
    id: "hilltop-gazebo",
    name: "Hilltop Gazebo & View Deck",
    image: "/attached_assets/IMG_9899_1759418259559.jpeg",
    hotspots: [
      { id: 'h-hill-1', targetId: 'resort-grounds', yaw: -150, pitch: -10, label: '↙ Resort Grounds', screenX: 40, screenY: 60 },
      { id: 'h-hill-2', targetId: 'camping-area', yaw: 60, pitch: 0, label: '→ Camping Area', screenX: 65, screenY: 48 }
    ]
  },
  {
    id: "sports-courts",
    name: "Sports Courts & Recreation",
    image: "/attached_assets/IMG_9901_1759418259559.jpeg",
    hotspots: [
      { id: 'h-sports-1', targetId: 'recreation-area', yaw: -90, pitch: 0, label: '← Recreation Area', screenX: 30, screenY: 50 },
      { id: 'h-sports-2', targetId: 'camping-area', yaw: 45, pitch: 0, label: '↗ Camping Area', screenX: 75, screenY: 45 }
    ]
  },
  {
    id: "camping-area",
    name: "Camping & Bonfire Area",
    image: "/attached_assets/IMG_9902_1759418259559.jpeg",
    hotspots: [
      { id: 'h-camp-1', targetId: 'sports-courts', yaw: -135, pitch: 0, label: '↙ Sports Courts', screenX: 35, screenY: 55 },
      { id: 'h-camp-2', targetId: 'hilltop-gazebo', yaw: -60, pitch: 0, label: '← Hilltop Gazebo', screenX: 30, screenY: 48 }
    ]
  }
];