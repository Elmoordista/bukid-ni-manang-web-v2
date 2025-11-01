// Email templates for different notification types
export type EmailTemplate = 'booking-confirmation' | 'booking-cancelled' | 'payment-received' | 'status-update';

export interface EmailNotification {
  id: string;
  templateId: EmailTemplate;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  data: {
    bookingId?: string;
    checkInDate?: string;
    checkOutDate?: string;
    totalAmount?: number;
    accommodationName?: string;
    status?: string;
    [key: string]: any;
  };
  sentAt?: string;
  status: 'pending' | 'sent' | 'failed';
}

// Mock email templates
const templates = {
  'booking-confirmation': {
    subject: 'Booking Confirmation - Bukid ni Manang',
    body: `
Dear {recipientName},

Thank you for booking with Bukid ni Manang Farm & Resort!

Your booking details:
- Booking ID: {bookingId}
- Accommodation: {accommodationName}
- Check-in: {checkInDate}
- Check-out: {checkOutDate}
- Total Amount: ₱{totalAmount}

Your booking is currently pending confirmation. We will review your request and get back to you shortly.

If you have any questions, please don't hesitate to contact us:
- Phone: 0917 100 9766
- Email: reservations@bukidnimanang.com

Best regards,
Bukid ni Manang Team
    `.trim()
  },
  'booking-cancelled': {
    subject: 'Booking Cancellation - Bukid ni Manang',
    body: `
Dear {recipientName},

Your booking (ID: {bookingId}) has been cancelled as requested.

Booking details:
- Accommodation: {accommodationName}
- Check-in: {checkInDate}
- Check-out: {checkOutDate}
- Total Amount: ₱{totalAmount}

If you wish to make a new booking, please visit our website.

Best regards,
Bukid ni Manang Team
    `.trim()
  },
  'payment-received': {
    subject: 'Payment Confirmation - Bukid ni Manang',
    body: `
Dear {recipientName},

We've received your payment for booking {bookingId}.

Payment details:
- Amount paid: ₱{totalAmount}
- Payment method: {paymentMethod}
- Transaction ID: {transactionId}

Your booking is now confirmed. We look forward to welcoming you!

Best regards,
Bukid ni Manang Team
    `.trim()
  },
  'status-update': {
    subject: 'Booking Status Update - Bukid ni Manang',
    body: `
Dear {recipientName},

There has been an update to your booking (ID: {bookingId}).

New status: {status}

{statusMessage}

If you have any questions, please contact us:
- Phone: 0917 100 9766
- Email: reservations@bukidnimanang.com

Best regards,
Bukid ni Manang Team
    `.trim()
  }
};

// Mock storage for email notifications
let mockEmailNotifications: EmailNotification[] = [];

// Helper function to replace template variables
const formatEmailBody = (template: string, data: Record<string, any>) => {
  return template.replace(/\{(\w+)\}/g, (_, key) => data[key] || '');
};

// Mock function to send email
const mockSendEmail = async (notification: EmailNotification): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate 95% success rate
  const success = Math.random() > 0.05;
  
  if (success) {
    notification.status = 'sent';
    notification.sentAt = new Date().toISOString();
  } else {
    notification.status = 'failed';
  }
  
  return success;
};

// Create a new email notification
export const createEmailNotification = async (
  templateId: EmailTemplate,
  recipientEmail: string,
  recipientName: string,
  data: Record<string, any>
): Promise<EmailNotification> => {
  const template = templates[templateId];
  if (!template) {
    throw new Error(`Email template ${templateId} not found`);
  }

  const notification: EmailNotification = {
    id: Math.random().toString(36).substr(2, 9),
    templateId,
    recipientEmail,
    recipientName,
    subject: formatEmailBody(template.subject, data),
    data,
    status: 'pending'
  };

  // Add to mock storage
  mockEmailNotifications.push(notification);

  // Attempt to send
  await mockSendEmail(notification);

  return notification;
};

// Get all email notifications for a recipient
export const getEmailNotifications = (recipientEmail: string): EmailNotification[] => {
  return mockEmailNotifications.filter(n => n.recipientEmail === recipientEmail)
    .sort((a, b) => (b.sentAt || '').localeCompare(a.sentAt || ''));
};

// Get the email body for a notification
export const getEmailBody = (notification: EmailNotification): string => {
  const template = templates[notification.templateId];
  if (!template) {
    throw new Error(`Email template ${notification.templateId} not found`);
  }

  return formatEmailBody(template.body, {
    recipientName: notification.recipientName,
    ...notification.data
  });
};