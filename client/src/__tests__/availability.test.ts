import { describe, it, expect } from 'vitest';
import { mockBookings, checkAvailability, createBooking } from '../data/mockData';

describe('Availability Check', () => {
  it('should return true for available dates', async () => {
    const available = await checkAvailability(
      '1', // Rustic Mountain Cabin
      '2025-11-01',
      '2025-11-03'
    );
    expect(available).toBe(true);
  });

  it('should return false for overlapping dates', async () => {
    // Create a booking using helper to ensure internal shape
    await createBooking({
      accommodationId: '1',
      userId: 'user-1',
      guestName: 'Test User',
      guestEmail: 'test@example.com',
      guestPhone: '+63 917 123 4567',
      checkInDate: '2025-12-01',
      checkOutDate: '2025-12-05',
      guestCount: 2,
      totalAmount: 5000,
      status: 'confirmed'
    });

    // Try to book overlapping dates
    const available = await checkAvailability('1', '2025-12-03', '2025-12-07');
    expect(available).toBe(false);
  });

  it('should handle adjacent dates correctly', async () => {
    // Create a booking via helper
    await createBooking({
      accommodationId: '2',
      userId: 'user-1',
      guestName: 'Test User',
      guestEmail: 'test@example.com',
      guestPhone: '+63 917 123 4567',
      checkInDate: '2025-12-10',
      checkOutDate: '2025-12-15',
      guestCount: 2,
      totalAmount: 5000,
      status: 'confirmed'
    });

    // Check-out date of existing booking is check-in date of new booking
    const available1 = await checkAvailability(
      '2',
      '2025-12-15',
      '2025-12-20'
    );
    expect(available1).toBe(true);

    // Check-in date of existing booking is check-out date of new booking
    const available2 = await checkAvailability(
      '2',
      '2025-12-05',
      '2025-12-10'
    );
    expect(available2).toBe(true);
  });

  it('should handle cancelled bookings correctly', async () => {
    // Create a cancelled booking via helper
    await createBooking({
      accommodationId: '3',
      userId: 'user-1',
      guestName: 'Test User',
      guestEmail: 'test@example.com',
      guestPhone: '+63 917 123 4567',
      checkInDate: '2025-12-20',
      checkOutDate: '2025-12-25',
      guestCount: 2,
      totalAmount: 5000,
      status: 'cancelled'
    });

    // Should be available since previous booking was cancelled
    const available = await checkAvailability(
      '3',
      '2025-12-22',
      '2025-12-24'
    );
    expect(available).toBe(true);
  });
});