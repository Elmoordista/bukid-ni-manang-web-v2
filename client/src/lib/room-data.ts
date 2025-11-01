export const ROOMS = [
  {
    id: 'double-twin',
    name: 'Double Twin Room',
    description: 'Spacious room with two double beds',
    capacity: 4,
    quantity: 4,
    amenities: [
      'Air Conditioning',
      'Private Bathroom',
      'TV',
      'Mini Fridge',
      'Coffee Maker',
      'Free WiFi'
    ],
    price: 3500,
    images: [
      '/images/rooms/double-twin-1.jpg',
      '/images/rooms/double-twin-2.jpg'
    ],
    size: '30 sqm'
  },
  {
    id: 'double',
    name: 'Double Room',
    description: 'Cozy room with one double bed',
    capacity: 2,
    quantity: 4,
    amenities: [
      'Air Conditioning',
      'Private Bathroom',
      'TV',
      'Mini Fridge',
      'Coffee Maker',
      'Free WiFi'
    ],
    price: 2500,
    images: [
      '/images/rooms/double-1.jpg',
      '/images/rooms/double-2.jpg'
    ],
    size: '25 sqm'
  }
];

export const BOOKING_RULES = {
  checkInTime: '14:00',
  checkOutTime: '12:00',
  minStay: 1,
  maxStay: 30,
  maxGuests: 4,
  depositRequired: true,
  depositAmount: 50, // percentage
  cancellationPolicy: '48 hours before check-in for full refund',
  childrenPolicy: 'Children under 7 stay free when using existing bedding',
  petPolicy: 'No pets allowed',
  acceptedPaymentMethods: [
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'GCash'
  ]
};

export type Room = typeof ROOMS[0];
export type BookingRules = typeof BOOKING_RULES;