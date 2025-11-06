// Mock amenity bookings data used for local development and demos
export const mockAmenityBookings = [
  {
    id: 101,
    type: 'amenity-pool',
    amenity: 'Swimming Pool - Cottage A',
    date: '2025-11-10',
    time: '10:00 AM',
    items: [{ name: 'Cottage A', qty: 1 }],
    total: 1500.0,
    status: 'pending',
    specialRequests: 'Near the shallow end please',
    createdAt: '2025-11-01T09:12:00Z',
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+63 912 345 6789'
    }
  },
  {
    id: 102,
    type: 'amenity-restaurant',
    amenity: 'Garden Restaurant - Table 5',
    date: '2025-11-12',
    time: '18:30',
    items: [
      { name: 'Set Menu A - Grilled Fish', qty: 2, price: 450 },
      { name: 'Set Menu B - Pork Liempo', qty: 1, price: 380 },
      { name: 'Halo-halo Special', qty: 4, price: 120 },
      { name: 'Iced Tea Pitcher', qty: 1, price: 180 }
    ],
    total: 3200.5,
    status: 'confirmed',
    specialRequests: 'Birthday cake',
    createdAt: '2025-11-02T14:20:00Z',
    user: {
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '+63 917 123 4567'
    }
  },
  {
    id: 103,
    type: 'amenity-shuttle',
    amenity: 'Shuttle Service - Pickup',
    date: '2025-11-11',
    time: '08:00 AM',
    items: [],
    total: 800.0,
    status: 'rejected',
    specialRequests: '',
    createdAt: '2025-11-03T07:50:00Z',
    user: {
      name: 'Carlos Rivera',
      email: 'carlos@example.com',
      phone: '+63 918 765 4321'
    }
  },
  {
    id: 104,
    type: 'amenity-pool',
    amenity: 'Swimming Pool - Tables',
    date: '2025-11-15',
    time: '14:00 PM',
    items: [{ name: 'Table', qty: 2 }],
    total: 950.0,
    status: 'pending',
    specialRequests: 'Extra chairs please',
    createdAt: '2025-11-04T10:30:00Z',
    user: {
      name: 'Ana Reyes',
      email: 'ana@example.com',
      phone: '+63 919 234 5678'
    }
  }
];

export default mockAmenityBookings;