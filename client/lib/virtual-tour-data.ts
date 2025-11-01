import { VirtualTourLocation } from "./types";

// Main overview image of the entire resort with all clickable locations
export const RESORT_OVERVIEW_IMAGE = "/attached_assets/att.2MRun9RLKOWwKu9bUyQrtTgPcMSdaE822OIN3RTVRVo_1759384034741.jpeg";

// All resort locations array
export const VIRTUAL_TOUR_LOCATIONS: VirtualTourLocation[] = [
  {
    id: "gardens-pavilion",
    name: "Gardens & Pavilion",
    description: "Welcome to Bukid ni Manang's centerpiece - our beautiful Gardens & Events Pavilion. From here, you can explore all areas of our resort.",
    image: "/attached_assets/att.l0KSG7zQLujrXWlHml4ms1w_FnN3GO-sqTfbHQTbZqE_1759384034742.jpeg",
    pointsOfInterest: [
      { title: "Main Pavilion", description: "Our grand pavilion perfect for events and celebrations" },
      { title: "Central Garden", description: "Beautifully landscaped gardens with scenic pathways" },
      { title: "Photo Spots", description: "Multiple picture-perfect locations around the garden" }
    ]
  },
  {
    id: "main-entrance",
    name: "Main Entrance & Welcome Area",
    image: "/attached_assets/IMG_9890_1759418259559.jpeg",
    description: "Our welcoming entrance area, your gateway to a memorable stay."
  },
  {
    id: "water-park",
    name: "Water Park & Pool Area",
    image: "/attached_assets/IMG_9893_1759418259559.jpeg",
    description: "Our expansive water park with multiple pools and recreation areas."
  },
  {
    id: "resort-grounds",
    name: "Resort Grounds & Gardens",
    image: "/attached_assets/att.rfPtVeaJwnebcgbjD5jlXsCNy5QOqkVLuGlJdqan_2c_1759384034742.jpeg",
    description: "Beautiful landscaped grounds and garden paths throughout the resort."
  },
  {
    id: "hotel-rooms",
    name: "Hotel Rooms & Accommodations",
    image: "/attached_assets/IMG_9192_1756782230937.jpeg",
    description: "Comfortable and well-appointed rooms for your stay."
  },
  {
    id: "recreation-area",
    name: "Recreation & Activity Area",
    image: "/attached_assets/att.20miQRo_3rSDHMJ8pSN9HryvVx_ilFM7mSgQvOa88wc_1759384034742.jpeg",
    description: "Multi-purpose area for various recreational activities."
  },
  {
    id: "restaurant",
    name: "Lutong Bahay Restaurant",
    image: "/attached_assets/IMG_9896_1759418259559.jpeg",
    description: "Our cozy restaurant serving delicious local cuisine."
  },
  {
    id: "hilltop-gazebo",
    name: "Hilltop Gazebo & View Deck",
    image: "/attached_assets/IMG_9899_1759418259559.jpeg",
    description: "Panoramic viewpoint perfect for photos and relaxation."
  },
  {
    id: "sports-courts",
    name: "Sports Courts & Recreation",
    image: "/attached_assets/IMG_9901_1759418259559.jpeg",
    description: "Active recreation area with sports facilities."
  },
  {
    id: "camping-area",
    name: "Camping & Bonfire Area",
    image: "/attached_assets/IMG_9902_1759418259559.jpeg",
    description: "Outdoor camping and bonfire spot for gatherings."
  }
];