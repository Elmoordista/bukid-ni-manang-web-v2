export interface PointOfInterest {
  title: string;
  description: string;
}

export interface Hotspot {
  id: string;
  targetId: string;
  yaw: number;
  pitch: number;
  label: string;
  screenX?: number;
  screenY?: number;
  type?: string;
  description?: string;
}

export interface VirtualTourLocation {
  id: string;
  name: string;
  image: string;
  description?: string;
  pointsOfInterest?: PointOfInterest[];
  hotspots?: Hotspot[];
}

export interface Booking {
  id: string;
  accommodationId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'checked-in' | 'checked-out';
  specialRequests?: string;
  createdAt: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'gcash' | 'cash' | 'bank-transfer';
  guestId?: string;
  transactionId?: string;
  start_date?: string;
  end_date?: string;
  guest_count?: string;
  user?: {
    name: string;
    email: string;
  };
  accommodation?: {
    name: string;
    type: string;
  };
  contact_number?: string;
  guest_request?: string;
  created_at?: string;
  total_price?: number;
}