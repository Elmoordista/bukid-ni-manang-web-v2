import React, { createContext, useContext, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { createEmailNotification } from "@/lib/mock-email";
import type { EmailTemplate } from "@/lib/mock-email";

type BookingStatus = "pending" | "confirmed" | "rejected" | "completed" | "cancelled";

interface NotificationContextValue {
  notifyBookingStatus: (
    bookingId: string,
    status: BookingStatus,
    bookingDetails?: {
      recipientEmail: string;
      recipientName: string;
      checkInDate: string;
      checkOutDate: string;
      totalAmount: number;
      accommodationName: string;
    }
  ) => void;
  notifyPaymentStatus: (
    bookingId: string,
    isPaid: boolean,
    paymentDetails?: {
      recipientEmail: string;
      recipientName: string;
      totalAmount: number;
      paymentMethod: string;
      transactionId: string;
    }
  ) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { toast } = useToast();

  const notifyBookingStatus = useCallback((
    bookingId: string,
    status: BookingStatus,
    bookingDetails?: {
      recipientEmail: string;
      recipientName: string;
      checkInDate: string;
      checkOutDate: string;
      totalAmount: number;
      accommodationName: string;
    }
  ) => {
    const statusMessages = {
      pending: {
        title: "Booking Received",
        description: `Your booking (${bookingId}) is pending confirmation.`,
        template: 'booking-confirmation' as EmailTemplate,
      },
      confirmed: {
        title: "Booking Confirmed",
        description: `Your booking (${bookingId}) has been confirmed!`,
        template: 'status-update' as EmailTemplate,
      },
      rejected: {
        title: "Booking Rejected",
        description: `Your booking (${bookingId}) could not be confirmed.`,
        variant: "destructive" as const,
        template: 'status-update' as EmailTemplate,
      },
      completed: {
        title: "Stay Completed",
        description: `Thank you for staying with us! Your booking (${bookingId}) is now complete.`,
        template: 'status-update' as EmailTemplate,
      },
      cancelled: {
        title: "Booking Cancelled",
        description: `Your booking (${bookingId}) has been cancelled.`,
        variant: "destructive" as const,
        template: 'booking-cancelled' as EmailTemplate,
      },
    };

    const message = statusMessages[status];
    toast(message);

    // Send email notification if details are provided
    if (bookingDetails) {
      createEmailNotification(
        message.template,
        bookingDetails.recipientEmail,
        bookingDetails.recipientName,
        {
          bookingId,
          ...bookingDetails,
          status: status.charAt(0).toUpperCase() + status.slice(1),
          statusMessage: message.description,
        }
      ).catch(error => {
        console.error('Failed to send email notification:', error);
      });
    }
  }, [toast]);

  const notifyPaymentStatus = useCallback((
    bookingId: string,
    isPaid: boolean,
    paymentDetails?: {
      recipientEmail: string;
      recipientName: string;
      totalAmount: number;
      paymentMethod: string;
      transactionId: string;
    }
  ) => {
    if (isPaid) {
      toast({
        title: "Payment Confirmed",
        description: `Payment for booking (${bookingId}) has been received.`,
      });

      // Send payment confirmation email if details are provided
      if (paymentDetails) {
        createEmailNotification(
          'payment-received',
          paymentDetails.recipientEmail,
          paymentDetails.recipientName,
          {
            bookingId,
            ...paymentDetails,
          }
        ).catch(error => {
          console.error('Failed to send payment confirmation email:', error);
        });
      }
    } else {
      toast({
        title: "Payment Required",
        description: `Please complete payment for booking (${bookingId}).`,
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <NotificationContext.Provider
      value={{
        notifyBookingStatus,
        notifyPaymentStatus,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}