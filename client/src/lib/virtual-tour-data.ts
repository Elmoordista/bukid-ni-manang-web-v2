import { type Hotspot } from './constants';

// Main overview image of the entire resort with all clickable locations
export const RESORT_OVERVIEW_IMAGE = "/attached_assets/att.2MRun9RLKOWwKu9bUyQrtTgPcMSdaE822OIN3RTVRVo_1759384034741.jpeg";

// All resort locations with their coordinates for the clickable map
export const RESORT_LOCATIONS = [
  // Main Areas
  {
    id: "main-entrance",
    name: "Main Entrance & Welcome Area",
    description: "Welcome to Bukid ni Manang! Our grand entrance and reception area.",
    coordinates: { x: 320, y: 480 },
    panoramaUrl: "/attached_assets/DJI_0906_1759384092811.html",
    thumbnail: "/attached_assets/IMG_9890_1759418259559.jpeg",
    type: "entrance"
  },
  {
    id: "water-park",
    name: "Water Park & Pool Area",
    description: "Our expansive water park featuring multiple pools and cottages",
    coordinates: { x: 380, y: 280 },
    panoramaUrl: "/attached_assets/DJI_0908_1759384092811.html",
    thumbnail: "/attached_assets/IMG_9893_1759418259559.jpeg",
    type: "recreation",
    cottageIds: ["pool-cottage-1", "pool-cottage-2"]
  },
  {
    id: "restaurant",
    name: "Lutong Bahay Restaurant",
    description: "Our cozy restaurant serving delicious local cuisine",
    coordinates: { x: 220, y: 420 },
    panoramaUrl: "/attached_assets/DJI_0910_1759384092811.html",
    thumbnail: "/attached_assets/IMG_9896_1759418259559.jpeg",
    type: "dining"
  },
  {
    id: "hotel-rooms",
    name: "Hotel Accommodation Area",
    description: "Comfortable rooms and suites for your stay",
    coordinates: { x: 450, y: 380 },
    panoramaUrl: "/attached_assets/DJI_0915_1759384092811.html",
    thumbnail: "/attached_assets/IMG_9192_1756782230937.jpeg",
    type: "accommodation",
    rooms: ["deluxe-room", "standard-room", "suite-room"]
  },
  // Recreation Areas
  {
    id: "hilltop-gazebo",
    name: "Hilltop Gazebo & View Deck",
    description: "Panoramic viewpoint perfect for photos and relaxation",
    coordinates: { x: 180, y: 160 },
    panoramaUrl: "/attached_assets/DJI_0915%20-%20Copy_1759384092811.html",
    thumbnail: "/attached_assets/IMG_9899_1759418259559.jpeg",
    type: "recreation"
  },
  {
    id: "sports-courts",
    name: "Sports & Recreation Area",
    description: "Active recreation area with sports facilities",
    coordinates: { x: 520, y: 220 },
    panoramaUrl: "/attached_assets/DJI_0915_1759384092811.html",
    thumbnail: "/attached_assets/IMG_9901_1759418259559.jpeg",
    type: "recreation"
  },
  {
    id: "camping-area",
    name: "Camping & Bonfire Area",
    description: "Outdoor camping and bonfire spot for gatherings",
    coordinates: { x: 150, y: 280 },
    panoramaUrl: "/attached_assets/DJI_0915_1759384092811.html",
    thumbnail: "/attached_assets/IMG_9902_1759418259559.jpeg",
    type: "recreation"
  },
  // Garden Areas
  {
    id: "gardens-pavilion",
    name: "Gardens & Pavilion",
    description: "Beautiful gardens and events pavilion",
    coordinates: { x: 280, y: 340 },
    panoramaUrl: "/attached_assets/DJI_0915_1759384092811.html",
    thumbnail: "/attached_assets/att.l0KSG7zQLujrXWlHml4ms1w_FnN3GO-sqTfbHQTbZqE_1759384034742.jpeg",
    type: "garden"
  },
  {
    id: "garden-path",
    name: "Scenic Garden Path",
    description: "Peaceful walking paths through our gardens",
    coordinates: { x: 350, y: 320 },
    panoramaUrl: "/attached_assets/DJI_0915_1759384092811.html",
    thumbnail: "/attached_assets/IMG_9207_1756782230937.jpeg",
    type: "garden"
  },
  // Additional Areas
  {
    id: "recreation-area",
    name: "Recreation & Activity Area",
    description: "Multi-purpose recreation space for various activities",
    coordinates: { x: 420, y: 180 },
    panoramaUrl: "/attached_assets/DJI_0915_1759384092811.html",
    thumbnail: "/attached_assets/att.20miQRo_3rSDHMJ8pSN9HryvVx_ilFM7mSgQvOa88wc_1759384034742.jpeg",
    type: "recreation"
  }
];

export const VIRTUAL_TOUR_LOCATIONS = [
  {
    id: "gardens-pavilion",
    name: "Gardens & Pavilion",
    description: "Welcome to Bukid ni Manang's centerpiece - our beautiful Gardens & Events Pavilion. From here, you can explore all areas of our resort.",
    image: "/attached_assets/att.l0KSG7zQLujrXWlHml4ms1w_FnN3GO-sqTfbHQTbZqE_1759384034742.jpeg",
    pointsOfInterest: [
      { title: "Main Pavilion", description: "Our grand pavilion perfect for events and celebrations" },
      { title: "Central Garden", description: "Beautifully landscaped gardens with scenic pathways" },
      { title: "Photo Spots", description: "Multiple picture-perfect locations around the garden" }
    ],
    hotspots: [
      // Main Navigation Group 1 - Front Section
      { 
        id: 'h-garden-entrance', 
        targetId: 'main-entrance', 
        yaw: 180, 
        pitch: 0, 
        label: 'Main Entrance',
        screenX: 50,
        screenY: 85,
        type: 'nav-marker',
        description: "Welcome Area & Reception"
      },
      { 
        id: 'h-garden-restaurant', 
        targetId: 'restaurant', 
        yaw: -140, 
        pitch: 0, 
        label: 'Restaurant',
        screenX: 20,
        screenY: 50,
        type: 'nav-marker',
        description: "Lutong Bahay Restaurant"
      },
      
      // Main Navigation Group 2 - Left Section
      { 
        id: 'h-garden-pool', 
        targetId: 'water-park', 
        yaw: -90, 
        pitch: 0, 
        label: 'Pool Area',
        screenX: 15,
        screenY: 50,
        type: 'nav-marker',
        description: "Swimming Pool & Cottages"
      },
      
      // Main Navigation Group 3 - Right Section
      { 
        id: 'h-garden-rooms', 
        targetId: 'hotel-rooms', 
        yaw: 90, 
        pitch: 0, 
        label: 'Accommodations',
        screenX: 85,
        screenY: 50,
        type: 'nav-marker',
        description: "Hotel Rooms & Suites"
      },
      
      // Main Navigation Group 4 - Upper Section
      { 
        id: 'h-garden-recreation', 
        targetId: 'recreation-area', 
        yaw: 45, 
        pitch: -10, 
        label: 'Recreation',
        screenX: 75,
        screenY: 25,
        type: 'nav-marker',
        description: "Recreation & Activities"
      },
      { 
        id: 'h-garden-hilltop', 
        targetId: 'hilltop-gazebo', 
        yaw: 0, 
        pitch: -15, 
        label: 'Hilltop',
        screenX: 50,
        screenY: 15,
        type: 'nav-marker',
        description: "Hilltop Gazebo & Views"
      },
      
      // Main Navigation Group 5 - Additional Areas
      { 
        id: 'h-garden-sports', 
        targetId: 'sports-courts', 
        yaw: 135, 
        pitch: -5, 
        label: 'Sports',
        screenX: 80,
        screenY: 40,
        type: 'nav-marker',
        description: "Sports Courts & Facilities"
      },
      { 
        id: 'h-garden-grounds', 
        targetId: 'resort-grounds', 
        yaw: -45, 
        pitch: -5, 
        label: 'Grounds',
        screenX: 20,
        screenY: 40,
        type: 'nav-marker',
        description: "Scenic Resort Grounds"
      }
    ]
  },
  {
    id: "main-entrance",
    name: "Main Entrance & Welcome Area",
    image: "/attached_assets/IMG_9890_1759418259559.jpeg",
    description: "Our welcoming entrance area, your gateway to a memorable stay.",
    hotspots: [
      { id: 'h-main-1', targetId: 'gardens-pavilion', yaw: 0, pitch: -5, label: '◉ Return to Gardens', screenX: 50, screenY: 45, type: 'location-marker' },
      { id: 'h-main-2', targetId: 'restaurant', yaw: -60, pitch: 0, label: '→ To Restaurant', screenX: 65, screenY: 48 },
      { id: 'h-main-3', targetId: 'water-park', yaw: 30, pitch: 0, label: '← To Water Park', screenX: 35, screenY: 48 }
    ] as (Hotspot & { screenX?: number; screenY?: number })[],
  },
  {
    id: "water-park",
    name: "Water Park & Pool Area",
    image: "/attached_assets/IMG_9893_1759418259559.jpeg",
    hotspots: [
      { id: 'h-water-1', targetId: 'main-entrance', yaw: 210, pitch: 0, label: '← To Main Entrance', screenX: 35, screenY: 50 },
      { id: 'h-water-2', targetId: 'resort-grounds', yaw: 120, pitch: 0, label: '→ To Resort Grounds', screenX: 70, screenY: 48 },
      { id: 'h-water-3', targetId: 'recreation-area', yaw: 45, pitch: 0, label: '↗ To Recreation Area', screenX: 80, screenY: 45 }
    ]
  },
  {
    id: "resort-grounds",
    name: "Resort Grounds & Gardens",
    image: "/attached_assets/att.rfPtVeaJwnebcgbjD5jlXsCNy5QOqkVLuGlJdqan_2c_1759384034742.jpeg",
    hotspots: [
      { id: 'h-grounds-1', targetId: 'water-park', yaw: -120, pitch: 0, label: '← To Water Park', screenX: 30, screenY: 50 },
      { id: 'h-grounds-2', targetId: 'gardens-pavilion', yaw: 60, pitch: 0, label: '→ To Gardens & Pavilion', screenX: 65, screenY: 48 },
      { id: 'h-grounds-3', targetId: 'hilltop-gazebo', yaw: 30, pitch: 10, label: '↗ To Hilltop View', screenX: 75, screenY: 40 }
    ]
  },
  {
    id: "gardens-pavilion",
    name: "Gardens & Pavilion",
    image: "/attached_assets/att.l0KSG7zQLujrXWlHml4ms1w_FnN3GO-sqTfbHQTbZqE_1759384034742.jpeg",
    hotspots: [
      // Main navigation arrows
      { id: 'h-garden-1', targetId: 'resort-grounds', yaw: -120, pitch: 0, label: '← Previous: Resort Grounds', screenX: 35, screenY: 50 },
      { id: 'h-garden-2', targetId: 'hotel-rooms', yaw: 90, pitch: 0, label: '→ Next: Hotel Rooms', screenX: 70, screenY: 48 },
      
      // Location markers for different spots in the garden
      { 
        id: 'spot-pavilion', 
        targetId: 'gardens-pavilion', 
        yaw: 0, 
        pitch: -10, 
        label: '◉ Main Pavilion Area',
        screenX: 50,
        screenY: 45,
        type: 'location-marker'
      },
      { 
        id: 'spot-pool', 
        targetId: 'water-park', 
        yaw: -150, 
        pitch: -5, 
        label: '◉ Swimming Pool',
        screenX: 25,
        screenY: 52,
        type: 'location-marker'
      },
      { 
        id: 'spot-restaurant', 
        targetId: 'restaurant', 
        yaw: -90, 
        pitch: -5, 
        label: '◉ Restaurant',
        screenX: 30,
        screenY: 48,
        type: 'location-marker'
      },
      { 
        id: 'spot-garden-path', 
        targetId: 'resort-grounds', 
        yaw: -45, 
        pitch: -5, 
        label: '◉ Garden Path',
        screenX: 40,
        screenY: 55,
        type: 'location-marker'
      },
      { 
        id: 'spot-recreation', 
        targetId: 'recreation-area', 
        yaw: 135, 
        pitch: -5, 
        label: '◉ Recreation Area',
        screenX: 75,
        screenY: 52,
        type: 'location-marker'
      },
      { 
        id: 'spot-hilltop', 
        targetId: 'hilltop-gazebo', 
        yaw: 45, 
        pitch: -15, 
        label: '◉ Hilltop View',
        screenX: 65,
        screenY: 35,
        type: 'location-marker'
      }
    ]
  },
  {
    id: "hotel-rooms",
    name: "Hotel Rooms & Accommodations",
    image: "/attached_assets/IMG_9192_1756782230937.jpeg",
    hotspots: [
      { id: 'h-hotel-1', targetId: 'gardens-pavilion', yaw: -90, pitch: 0, label: '← To Gardens', screenX: 30, screenY: 50 },
      { id: 'h-hotel-2', targetId: 'recreation-area', yaw: 90, pitch: 0, label: '→ To Recreation Area', screenX: 70, screenY: 48 }
    ]
  },
  {
    id: "recreation-area",
    name: "Recreation & Activity Area",
    image: "/attached_assets/att.20miQRo_3rSDHMJ8pSN9HryvVx_ilFM7mSgQvOa88wc_1759384034742.jpeg",
    hotspots: [
      { id: 'h-rec-1', targetId: 'hotel-rooms', yaw: -90, pitch: 0, label: '← To Hotel Rooms', screenX: 30, screenY: 50 },
      { id: 'h-rec-2', targetId: 'sports-courts', yaw: 90, pitch: 0, label: '→ To Sports Courts', screenX: 70, screenY: 48 }
    ]
  },
  {
    id: "restaurant",
    name: "Lutong Bahay Restaurant",
    image: "/attached_assets/IMG_9896_1759418259559.jpeg",
    hotspots: [
      { id: 'h-rest-1', targetId: 'main-entrance', yaw: 160, pitch: 0, label: '← To Main Entrance', screenX: 35, screenY: 50 },
      { id: 'h-rest-2', targetId: 'resort-grounds', yaw: -30, pitch: 0, label: '→ To Resort Grounds', screenX: 65, screenY: 48 }
    ]
  },
  {
    id: "hilltop-gazebo",
    name: "Hilltop Gazebo & View Deck",
    image: "/attached_assets/IMG_9899_1759418259559.jpeg",
    hotspots: [
      { id: 'h-hill-1', targetId: 'resort-grounds', yaw: -150, pitch: -10, label: '↙ To Resort Grounds', screenX: 40, screenY: 60 },
      { id: 'h-hill-2', targetId: 'camping-area', yaw: 60, pitch: 0, label: '→ To Camping Area', screenX: 65, screenY: 48 }
    ]
  },
  {
    id: "sports-courts",
    name: "Sports Courts & Recreation",
    image: "/attached_assets/IMG_9901_1759418259559.jpeg",
    hotspots: [
      { id: 'h-sports-1', targetId: 'recreation-area', yaw: -90, pitch: 0, label: '← To Recreation Area', screenX: 30, screenY: 50 },
      { id: 'h-sports-2', targetId: 'camping-area', yaw: 45, pitch: 0, label: '↗ To Camping Area', screenX: 75, screenY: 45 }
    ]
  },
  {
    id: "camping-area",
    name: "Camping & Bonfire Area",
    image: "/attached_assets/IMG_9902_1759418259559.jpeg",
    hotspots: [
      { id: 'h-camp-1', targetId: 'sports-courts', yaw: -135, pitch: 0, label: '↙ To Sports Courts', screenX: 35, screenY: 55 },
      { id: 'h-camp-2', targetId: 'hilltop-gazebo', yaw: -60, pitch: 0, label: '← To Hilltop Gazebo', screenX: 30, screenY: 48 }
    ]
  }
];