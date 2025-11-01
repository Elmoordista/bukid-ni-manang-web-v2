import { type Hotspot } from './constants';

// Main overview image of the entire resort with all clickable locations
export const RESORT_OVERVIEW_IMAGE = "/attached_assets/att.2MRun9RLKOWwKu9bUyQrtTgPcMSdaE822OIN3RTVRVo_1759384034741.jpeg";

// Optimized tour data with fast-loading previews
export const VIRTUAL_TOUR_LOCATIONS = [
  {
    id: "gardens-pavilion",
    name: "Gardens & Pavilion",
    description: "Beautiful gardens and events pavilion area",
    image: "/attached_assets/att.l0KSG7zQLujrXWlHml4ms1w_FnN3GO-sqTfbHQTbZqE_1759384034742.jpeg",
    previewImage: "/attached_assets/att.l0KSG7zQLujrXWlHml4ms1w_FnN3GO-sqTfbHQTbZqE_1759384034742.jpeg",
    hotspots: [
      { 
        id: 'h-garden-pool', 
        targetId: 'pool-area', 
        yaw: -120, 
        pitch: 0, 
        label: '← Swimming Pool', 
        screenX: 35, 
        screenY: 50 
      },
      { 
        id: 'h-garden-restaurant', 
        targetId: 'restaurant', 
        yaw: -60, 
        pitch: 0, 
        label: '↖ Restaurant', 
        screenX: 25, 
        screenY: 45 
      },
      { 
        id: 'h-garden-rooms', 
        targetId: 'hotel-rooms', 
        yaw: 90, 
        pitch: 0, 
        label: '→ Hotel Rooms', 
        screenX: 70, 
        screenY: 48 
      },
      { 
        id: 'h-garden-sports', 
        targetId: 'sports-area', 
        yaw: 120, 
        pitch: 0, 
        label: '↗ Sports Courts', 
        screenX: 75, 
        screenY: 45 
      },
      { 
        id: 'h-garden-entrance', 
        targetId: 'main-entrance', 
        yaw: 180, 
        pitch: 0, 
        label: '↓ Main Entrance', 
        screenX: 50, 
        screenY: 70 
      }
    ] as (Hotspot & { screenX?: number; screenY?: number })[]
  },
  {
    id: "pool-area",
    name: "Swimming Pool",
    description: "Our expansive water park with multiple pools",
    image: "/attached_assets/IMG_9893_1759418259559.jpeg",
    previewImage: "/attached_assets/IMG_9893_1759418259559.jpeg",
    hotspots: [
      { 
        id: 'h-pool-garden', 
        targetId: 'gardens-pavilion', 
        yaw: -90, 
        pitch: 0, 
        label: '← Gardens', 
        screenX: 30, 
        screenY: 50 
      },
      { 
        id: 'h-pool-restaurant', 
        targetId: 'restaurant', 
        yaw: 45, 
        pitch: 0, 
        label: '↗ Restaurant', 
        screenX: 65, 
        screenY: 45 
      }
    ]
  },
  {
    id: "restaurant",
    name: "Lutong Bahay Restaurant",
    description: "Our cozy restaurant serving local cuisine",
    image: "/attached_assets/IMG_9896_1759418259559.jpeg",
    previewImage: "/attached_assets/IMG_9896_1759418259559.jpeg",
    hotspots: [
      { 
        id: 'h-restaurant-pool', 
        targetId: 'pool-area', 
        yaw: -45, 
        pitch: 0, 
        label: '↙ Pool Area', 
        screenX: 35, 
        screenY: 55 
      },
      { 
        id: 'h-restaurant-garden', 
        targetId: 'gardens-pavilion', 
        yaw: 90, 
        pitch: 0, 
        label: '→ Gardens', 
        screenX: 70, 
        screenY: 50 
      }
    ]
  },
  {
    id: "hotel-rooms",
    name: "Hotel Accommodations",
    description: "Comfortable rooms and suites",
    image: "/attached_assets/IMG_9192_1756782230937.jpeg",
    previewImage: "/attached_assets/IMG_9192_1756782230937.jpeg",
    hotspots: [
      { 
        id: 'h-rooms-garden', 
        targetId: 'gardens-pavilion', 
        yaw: -90, 
        pitch: 0, 
        label: '← Gardens', 
        screenX: 30, 
        screenY: 50 
      },
      { 
        id: 'h-rooms-sports', 
        targetId: 'sports-area', 
        yaw: 90, 
        pitch: 0, 
        label: '→ Sports Area', 
        screenX: 70, 
        screenY: 50 
      }
    ]
  },
  {
    id: "sports-area",
    name: "Sports & Recreation",
    description: "Sports courts and recreation facilities",
    image: "/attached_assets/IMG_9901_1759418259559.jpeg",
    previewImage: "/attached_assets/IMG_9901_1759418259559.jpeg",
    hotspots: [
      { 
        id: 'h-sports-rooms', 
        targetId: 'hotel-rooms', 
        yaw: -90, 
        pitch: 0, 
        label: '← Hotel Rooms', 
        screenX: 30, 
        screenY: 50 
      },
      { 
        id: 'h-sports-garden', 
        targetId: 'gardens-pavilion', 
        yaw: -150, 
        pitch: 0, 
        label: '↙ Gardens', 
        screenX: 35, 
        screenY: 55 
      }
    ]
  },
  {
    id: "main-entrance",
    name: "Main Entrance",
    description: "Welcome to Bukid ni Manang",
    image: "/attached_assets/IMG_9890_1759418259559.jpeg",
    previewImage: "/attached_assets/IMG_9890_1759418259559.jpeg",
    hotspots: [
      { 
        id: 'h-entrance-garden', 
        targetId: 'gardens-pavilion', 
        yaw: 0, 
        pitch: 0, 
        label: '↑ Gardens', 
        screenX: 50, 
        screenY: 30 
      },
      { 
        id: 'h-entrance-pool', 
        targetId: 'pool-area', 
        yaw: 45, 
        pitch: 0, 
        label: '↗ Pool Area', 
        screenX: 65, 
        screenY: 45 
      }
    ]
  }
];