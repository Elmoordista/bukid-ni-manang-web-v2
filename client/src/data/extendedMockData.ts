// Additional mock data for comprehensive static frontend
import { mockAccommodations, mockUsers, mockBookings, type Accommodation, type User, type Booking } from './mockData';

// Mock Reviews Data
export interface Review {
  id: string;
  accommodationId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export const mockReviews: Review[] = [
  {
    id: "1",
    accommodationId: "1",
    userId: "1", 
    userName: "Juan Dela Cruz",
    rating: 5,
    comment: "Amazing experience! The mountain cabin was perfect for our family getaway.",
    date: "2024-09-15T10:30:00Z"
  },
  {
    id: "2",
    accommodationId: "1",
    userId: "2",
    userName: "Maria Santos", 
    rating: 4,
    comment: "Beautiful location and very peaceful. Highly recommend!",
    date: "2024-09-10T14:20:00Z"
  },
  {
    id: "3",
    accommodationId: "2", 
    userId: "1",
    userName: "Juan Dela Cruz",
    rating: 5,
    comment: "Loved the farm experience. Kids enjoyed interacting with animals.",
    date: "2024-08-25T09:15:00Z"
  }
];

// Mock Inquiries Data
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  accommodationId?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  status: 'pending' | 'responded' | 'resolved';
  createdAt: string;
}

export const mockInquiries: Inquiry[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com", 
    phone: "09123456789",
    message: "Interested in weekend booking for mountain cabin",
    accommodationId: "1",
    checkIn: "2024-10-20",
    checkOut: "2024-10-22",
    guests: 4,
    status: "pending",
    createdAt: "2024-10-12T08:30:00Z"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "09234567890", 
    message: "Planning a group retreat, need availability for 15 people",
    accommodationId: "2",
    checkIn: "2024-11-05",
    checkOut: "2024-11-07",
    guests: 15,
    status: "responded",
    createdAt: "2024-10-11T15:45:00Z"
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "09345678901",
    message: "Looking for a quiet place for writing retreat",
    accommodationId: "3",
    checkIn: "2024-12-01",
    checkOut: "2024-12-05", 
    guests: 2,
    status: "resolved",
    createdAt: "2024-10-10T12:15:00Z"
  }
];

// Mock Payment Data  
export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: 'gcash' | 'bank_transfer' | 'cash';
  reference: string;
  status: 'pending' | 'verified' | 'rejected';
  screenshot?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  verifiedAt?: string;
}

export const mockPayments: Payment[] = [
  {
    id: "1",
    bookingId: "1", 
    amount: 360.00,
    method: "gcash",
    reference: "GC-2024-001",
    status: "pending",
    screenshot: "/payment-screenshots/gc-001.jpg",
    customerName: "Juan Dela Cruz",
    customerEmail: "juan@example.com",
    customerPhone: "09123456789", 
    createdAt: "2024-10-12T10:30:00Z"
  },
  {
    id: "2",
    bookingId: "2",
    amount: 285.00,
    method: "gcash", 
    reference: "GC-2024-002",
    status: "verified",
    screenshot: "/payment-screenshots/gc-002.jpg",
    customerName: "Maria Santos",
    customerEmail: "maria@example.com",
    customerPhone: "09234567890",
    createdAt: "2024-10-11T14:20:00Z",
    verifiedAt: "2024-10-11T16:45:00Z"
  },
  {
    id: "3", 
    bookingId: "3",
    amount: 450.00,
    method: "bank_transfer",
    reference: "BT-2024-001", 
    status: "rejected",
    customerName: "Pedro Garcia",
    customerEmail: "pedro@example.com",
    customerPhone: "09345678901",
    createdAt: "2024-10-10T09:15:00Z"
  }
];

// Mock Admin Statistics
export interface AdminStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalGuests: number;
  occupancyRate: number;
  pendingPayments: number;
  verifiedPayments: number;
}

export const mockAdminStats: AdminStats = {
  totalBookings: 45,
  pendingBookings: 8,
  confirmedBookings: 32,
  cancelledBookings: 5,
  totalRevenue: 12850.00,
  monthlyRevenue: 3240.00,
  totalGuests: 127,
  occupancyRate: 72,
  pendingPayments: 3,
  verifiedPayments: 28
};

// Export all data
export {
  mockAccommodations,
  mockUsers, 
  mockBookings,
  type Accommodation,
  type User,
  type Booking
};