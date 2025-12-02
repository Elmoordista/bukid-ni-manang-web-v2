// Static mock data for accommodations
export interface Accommodation {
  id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  images: {
    image_url: string;
  }[]; // ✅ a
  amenities: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  rating: number;
  reviews: number;
  available: boolean;
  price_per_night: number;
  max_occupancy: number;
  number_of_beds: number;
  number_of_bathrooms: number;
  status: 'available' | 'unavailable';
}

export const mockAccommodations: Accommodation[] = [
  // // Double Single Bed Rooms (4 rooms)
  // ...Array.from({ length: 4 }, (_, i) => ({
  //   id: `double-single-${i + 1}`,
  //   name: `Double Single Bed Room ${i + 1}`,
  //   description: "Comfortable room with two single beds, perfect for friends or family. Features air conditioning and a private bathroom.",
  //   price: 2500,
  //   location: "Main Building",
  //   images: [
  //     "/images/IMG_9191_1756782230937.jpeg",
  //     "/images/IMG_9192_1756782230937.jpeg",
  //     "/images/IMG_9193_1756782230937.jpeg"
  //   ],
  //   amenities: [
  //     "Air Conditioning",
  //     "Private Bathroom",
  //     "2 Single Beds",
  //     "TV",
  //     "Free WiFi",
  //     "Daily Housekeeping"
  //   ],
  //   maxGuests: 2,
  //   bedrooms: 1,
  //   bathrooms: 1,
  //   rating: 4.5,
  //   reviews: 28,
  //   available: true
  // })),
  // // Single Double Bed Rooms (4 rooms)
  // ...Array.from({ length: 4 }, (_, i) => ({
  //   id: `single-double-${i + 1}`,
  //   name: `Single Double Bed Room ${i + 1}`,
  //   description: "Cozy room with one double bed, ideal for couples. Features air conditioning and a private bathroom.",
  //   price: 2000,
  //   location: "Main Building",
  //   images: [
  //     "/images/IMG_9194_1756782230937.jpeg",
  //     "/images/IMG_9195_1756782230937.jpeg",
  //     "/images/IMG_9196_1756782230937.jpeg"
  //   ],
  //   amenities: [
  //     "Air Conditioning",
  //     "Private Bathroom",
  //     "1 Double Bed",
  //     "TV",
  //     "Free WiFi",
  //     "Daily Housekeeping"
  //   ],
  //   maxGuests: 2,
  //   bedrooms: 1,
  //   bathrooms: 1,
  //   rating: 4.5,
  //   reviews: 25,
  //   available: true
  // }))
];

// Mock user data
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export const mockUsers: User[] = [
  {
    id: "1",
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan@example.com",
    role: "user"
  },
  {
    id: "2",
    firstName: "Maria",
    lastName: "Santos",
    email: "maria@example.com",
    role: "admin"
  }
];

// Mock booking data
export interface Booking {
  id: string;
  accommodationId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
  createdAt: string;
  // Additional fields for admin interface
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: number;
  totalAmount?: number;
  specialRequests?: string;
  start_date?: string;
  end_date?: string;
  guest_count?: number;
  total_price?: number;
  contact_number?: string;
  guest_request?: string;
  payment?: {
    amount?: number;
    payment_method?: string;
    reference_number?: string;
    payment_status?: 'pending' | 'paid';
  };
  // Expanded user info
  userId?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }
  // Payment fields
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    name: string;
  };
  paymentStatus?: 'pending' | 'paid';
  paymentProof?: {
    referenceNumber?: string;
    senderName?: string;
    senderPhone?: string;
    uploaded?: string;
  } | null;
}

export const mockBookings: Booking[] = [
 
];

// Helper functions to simulate API calls with static data
export const getAccommodations = (): Promise<Accommodation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAccommodations), 500);
  });
};

export const getAccommodationById = (id: string): Promise<Accommodation | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const accommodation = mockAccommodations.find(acc => acc.id === id);
      resolve(accommodation || null);
    }, 300);
  });
};

export const getBookings = (): Promise<Booking[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockBookings), 400);
  });
};

export const getUserProfile = (userId: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.id === userId);
      resolve(user || null);
    }, 200);
  });
};

// Check availability for an accommodation between two ISO date strings (inclusive start, exclusive end)
export const checkAvailability = (accommodationId: string, checkIn: string, checkOut: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = new Date(checkIn).getTime();
      const end = new Date(checkOut).getTime();

      // If dates invalid, return false
      if (isNaN(start) || isNaN(end) || end <= start) return resolve(false);

      // Consider bookings with status 'pending' or 'confirmed' as blocking
      const blocking = mockBookings.filter(b => b.accommodationId === accommodationId && (b.status === 'pending' || b.status === 'confirmed'));

      const overlaps = blocking.some(b => {
        const bStart = new Date(b.checkInDate || b.checkIn).getTime();
        const bEnd = new Date(b.checkOutDate || b.checkOut).getTime();
        // overlap if start < bEnd && end > bStart
        return start < bEnd && end > bStart;
      });

      resolve(!overlaps);
    }, 200);
  });
};

// Create a booking (in-memory) after validation. Returns created booking or throws Error.
export const createBooking = (booking: Omit<Booking, 'id' | 'createdAt'> & { status?: Booking['status'] }): Promise<Booking> => {
  return new Promise(( reject) => {
    setTimeout(() => {
      const { accommodationId, checkInDate = booking.checkIn, checkOutDate = booking.checkOut } = booking as any;

      // Validate availability
      checkAvailability(accommodationId, checkInDate!, checkOutDate!).then(() => {
        // if (!available) return reject(new Error('Selected dates are not available for this accommodation.'));

        // const id = (mockBookings.length + 1).toString();
        // const createdAt = new Date().toISOString();
        // const newBooking: Booking = {
        //   id,
        //   accommodationId: booking.accommodationId,
        //   userId: booking.userId || '0',
        //   checkIn: booking.checkInDate || booking.checkIn || '',
        //   checkOut: booking.checkOutDate || booking.checkOut || '',
        //   guests: booking.guestCount || booking.guests || 1,
        //   totalPrice: booking.totalAmount || booking.totalPrice || 0,
        //   status: booking.status || 'pending',
        //   createdAt,
        //   guestName: booking.guestName,
        //   guestEmail: booking.guestEmail,
        //   guestPhone: booking.guestPhone,
        //   checkInDate: booking.checkInDate,
        //   checkOutDate: booking.checkOutDate,
        //   guestCount: booking.guestCount,
        //   totalAmount: booking.totalAmount,
        //   specialRequests: booking.specialRequests,
        // };

        // mockBookings.push(newBooking);
        // resolve(newBooking);
      }).catch(reject);
    }, 300);
  });
};

// Simulate payment submission for a booking and attach proof; marks paymentStatus as 'paid'
export const createPayment = (bookingId: string, proof: { referenceNumber?: string; senderName?: string; senderPhone?: string; uploaded?: string; amount?: number; }): Promise<Booking> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booking = mockBookings.find(b => b.id === bookingId);
      if (!booking) return reject(new Error('Booking not found'));

      booking.paymentStatus = 'paid';
      booking.paymentProof = {
        referenceNumber: proof.referenceNumber,
        senderName: proof.senderName,
        senderPhone: proof.senderPhone,
        uploaded: proof.uploaded,
      };

      // Keep booking status as confirmed when paid
      if (booking.status === 'pending') booking.status = 'confirmed';

      resolve(booking);
    }, 500);
  });
};