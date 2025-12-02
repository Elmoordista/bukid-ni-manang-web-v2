// import type { Accommodation } from '@shared/schema';

export const ACCOMMODATION_DATA: Partial<any>[] = [
  {
    name: "Deluxe Room",
    description: "Spacious and modern room with premium amenities, perfect for couples or small families.",
    pricePerNight: "3500.00",
    maxGuests: 4,
    bedCount: 2,
    amenities: [
      "Air Conditioning",
      "Starlink WiFi",
      "55\" Smart TV",
      "Hot & Cold Shower",
      "Mini Refrigerator",
      "Coffee Maker",
      "Free Access to All Amenities"
    ],
    images: [
      "/attached_assets/IMG_9192_1756782230937.jpeg",
      "/attached_assets/IMG_9195_1756782230937.jpeg",
      "/attached_assets/IMG_9196_1756782230937.jpeg"
    ],
    rating: "4.9",
    reviewCount: 45,
    isAvailable: "true"
  },
  {
    name: "Standard Room",
    description: "Comfortable and cozy room with essential amenities for a relaxing stay.",
    pricePerNight: "2500.00",
    maxGuests: 2,
    bedCount: 1,
    amenities: [
      "Air Conditioning",
      "Starlink WiFi",
      "43\" Smart TV",
      "Hot & Cold Shower",
      "Free Access to All Amenities"
    ],
    images: [
      "/attached_assets/IMG_9200_1756782230937.jpeg",
      "/attached_assets/IMG_9201_1756782230937.jpeg",
      "/attached_assets/IMG_9203_1756782230937.jpeg"
    ],
    rating: "4.7",
    reviewCount: 52,
    isAvailable: "true"
  }
];