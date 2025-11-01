import { type Hotspot } from './constants';

// Main overview image of the entire resort with all clickable locations
export const RESORT_OVERVIEW_IMAGE = "/attached_assets/att.2MRun9RLKOWwKu9bUyQrtTgPcMSdaE822OIN3RTVRVo_1759384034741.jpeg";

// Detailed tour data with points of interest
export const VIRTUAL_TOUR_LOCATIONS = [
  {
    id: "gardens-pavilion",
    name: "Gardens & Pavilion",
    description: "Our centerpiece garden with elegant pavilion, perfect for weddings and events. Surrounded by lush landscaping and scenic views.",
    image: "/attached_assets/att.l0KSG7zQLujrXWlHml4ms1w_FnN3GO-sqTfbHQTbZqE_1759384034742.jpeg",
    previewImage: "/attached_assets/att.l0KSG7zQLujrXWlHml4ms1w_FnN3GO-sqTfbHQTbZqE_1759384034742.jpeg",
    pointsOfInterest: [
      { title: "Event Pavilion", description: "Spacious covered area perfect for celebrations" },
      { title: "Garden Path", description: "Scenic walkways through manicured gardens" },
      { title: "Photo Spots", description: "Multiple scenic locations for perfect pictures" }
    ],
    hotspots: [
      { 
        id: 'h-garden-pool', 
        targetId: 'pool-area', 
        yaw: -135, 
        pitch: -5, 
        label: '↙ Swimming Pool', 
        screenX: 32, 
        screenY: 55,
        description: "Head to our expansive swimming pool area"
      },
      { 
        id: 'h-garden-restaurant', 
        targetId: 'restaurant', 
        yaw: -80, 
        pitch: -2, 
        label: '← Restaurant', 
        screenX: 25, 
        screenY: 48,
        description: "Visit our Lutong Bahay Restaurant"
      },
      { 
        id: 'h-garden-rooms', 
        targetId: 'hotel-rooms', 
        yaw: 100, 
        pitch: -3, 
        label: '→ Hotel Rooms', 
        screenX: 75, 
        screenY: 48,
        description: "View our comfortable accommodations"
      },
      { 
        id: 'h-garden-sports', 
        targetId: 'sports-area', 
        yaw: 145, 
        pitch: -5, 
        label: '↗ Sports Courts', 
        screenX: 80, 
        screenY: 45,
        description: "Check out our sports and recreation facilities"
      },
      { 
        id: 'h-garden-entrance', 
        targetId: 'main-entrance', 
        yaw: 180, 
        pitch: 0, 
        label: '↓ Main Entrance', 
        screenX: 50, 
        screenY: 75,
        description: "Return to the resort entrance"
      }
    ] as (Hotspot & { screenX?: number; screenY?: number; description?: string })[]
  },
  {
    id: "pool-area",
    name: "Swimming Pool Complex",
    description: "Our resort's highlight - a stunning swimming pool complex with multiple pools, kids' area, and relaxation spots.",
    image: "/attached_assets/att.FQnkvMMN9sySdgwtKNWSV7CPr3B2QMoVgepD_Z-02TM_1759418259559.jpeg",
    previewImage: "/attached_assets/att.FQnkvMMN9sySdgwtKNWSV7CPr3B2QMoVgepD_Z-02TM_1759418259559.jpeg",
    pointsOfInterest: [
      { title: "Main Pool", description: "Large swimming pool with perfect depth" },
      { title: "Kids' Pool", description: "Shallow pool safe for children" },
      { title: "Pool Cottages", description: "Shaded rest areas around the pool" }
    ],
    hotspots: [
      { 
        id: 'h-pool-garden', 
        targetId: 'gardens-pavilion', 
        yaw: -90, 
        pitch: 0, 
        label: '← Gardens', 
        screenX: 25, 
        screenY: 50,
        description: "Return to the garden pavilion"
      },
      { 
        id: 'h-pool-restaurant', 
        targetId: 'restaurant', 
        yaw: 45, 
        pitch: -5, 
        label: '↗ Restaurant', 
        screenX: 65, 
        screenY: 45,
        description: "Visit our restaurant for refreshments"
      }
    ]
  },
  {
    id: "restaurant",
    name: "Lutong Bahay Restaurant",
    description: "Experience authentic Filipino cuisine in our cozy restaurant with indoor and outdoor seating options.",
    image: "/attached_assets/att.MOsXOmplcFEzEBxTfzLgpxdBPcSWEW64ro4oLAosNKU_1759418259559.jpeg",
    previewImage: "/attached_assets/att.MOsXOmplcFEzEBxTfzLgpxdBPcSWEW64ro4oLAosNKU_1759418259559.jpeg",
    pointsOfInterest: [
      { title: "Dining Area", description: "Air-conditioned indoor seating" },
      { title: "Outdoor Tables", description: "Al fresco dining with garden views" },
      { title: "Bar Counter", description: "Refreshing drinks and quick bites" }
    ],
    hotspots: [
      { 
        id: 'h-restaurant-pool', 
        targetId: 'pool-area', 
        yaw: -45, 
        pitch: -5, 
        label: '↙ Pool Area', 
        screenX: 35, 
        screenY: 55,
        description: "Head back to the swimming pool"
      },
      { 
        id: 'h-restaurant-garden', 
        targetId: 'gardens-pavilion', 
        yaw: 90, 
        pitch: 0, 
        label: '→ Gardens', 
        screenX: 70, 
        screenY: 50,
        description: "Explore our beautiful gardens"
      }
    ]
  },
  {
    id: "hotel-rooms",
    name: "Hotel Accommodations",
    description: "Modern, comfortable rooms with all amenities. Choose from our Standard, Deluxe, and Suite options.",
    image: "/attached_assets/att.20miQRo_3rSDHMJ8pSN9HryvVx_ilFM7mSgQvOa88wc_1759384034742.jpeg",
    previewImage: "/attached_assets/att.20miQRo_3rSDHMJ8pSN9HryvVx_ilFM7mSgQvOa88wc_1759384034742.jpeg",
    pointsOfInterest: [
      { title: "Deluxe Rooms", description: "Spacious rooms with garden views" },
      { title: "Family Suites", description: "Perfect for family stays" },
      { title: "Room Service", description: "Available during restaurant hours" }
    ],
    hotspots: [
      { 
        id: 'h-rooms-garden', 
        targetId: 'gardens-pavilion', 
        yaw: -90, 
        pitch: 0, 
        label: '← Gardens', 
        screenX: 30, 
        screenY: 50,
        description: "Return to the garden area"
      },
      { 
        id: 'h-rooms-sports', 
        targetId: 'sports-area', 
        yaw: 90, 
        pitch: 0, 
        label: '→ Sports Area', 
        screenX: 70, 
        screenY: 50,
        description: "Visit our sports facilities"
      }
    ]
  },
  {
    id: "sports-area",
    name: "Sports & Recreation",
    description: "Stay active at our sports complex featuring basketball, volleyball, and badminton courts.",
    image: "/attached_assets/att.srwY8YGtXZDSoSl3Y8JR6q2OkWT5-aRf-EIDW6g-lhE_1759418259558.jpeg",
    previewImage: "/attached_assets/att.srwY8YGtXZDSoSl3Y8JR6q2OkWT5-aRf-EIDW6g-lhE_1759418259558.jpeg",
    pointsOfInterest: [
      { title: "Basketball Court", description: "Full-size court with night lighting" },
      { title: "Volleyball Area", description: "Sand court for beach volleyball" },
      { title: "Equipment Rental", description: "Sports equipment available" }
    ],
    hotspots: [
      { 
        id: 'h-sports-rooms', 
        targetId: 'hotel-rooms', 
        yaw: -90, 
        pitch: 0, 
        label: '← Hotel Rooms', 
        screenX: 30, 
        screenY: 50,
        description: "Return to the accommodation area"
      },
      { 
        id: 'h-sports-garden', 
        targetId: 'gardens-pavilion', 
        yaw: -150, 
        pitch: -5, 
        label: '↙ Gardens', 
        screenX: 35, 
        screenY: 55,
        description: "Visit our central garden area"
      }
    ]
  },
  {
    id: "main-entrance",
    name: "Main Entrance & Welcome Area",
    description: "Welcome to Bukid ni Manang! Our grand entrance leads you to a world of relaxation and fun.",
    image: "/attached_assets/att.34eMm6OXQuLtXPiy0fz_tU8trfqt75Op95BYjTZoWAQ_1759418259558.jpeg",
    previewImage: "/attached_assets/att.34eMm6OXQuLtXPiy0fz_tU8trfqt75Op95BYjTZoWAQ_1759418259558.jpeg",
    pointsOfInterest: [
      { title: "Reception", description: "24/7 front desk service" },
      { title: "Information Board", description: "Daily activities and events" },
      { title: "Welcome Area", description: "Comfortable waiting lounge" }
    ],
    hotspots: [
      { 
        id: 'h-entrance-garden', 
        targetId: 'gardens-pavilion', 
        yaw: 0, 
        pitch: -5, 
        label: '↑ Gardens', 
        screenX: 50, 
        screenY: 30,
        description: "Explore our central gardens"
      },
      { 
        id: 'h-entrance-pool', 
        targetId: 'pool-area', 
        yaw: 45, 
        pitch: -5, 
        label: '↗ Pool Area', 
        screenX: 65, 
        screenY: 45,
        description: "Head to our swimming pools"
      }
    ]
  }
];