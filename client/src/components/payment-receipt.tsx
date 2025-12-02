import { format } from "date-fns";
import { RESORT_INFO } from "@/lib/constants";
// import type { Payment } from "@shared/schema/payment";
// import type { Booking } from "@shared/schema";

interface PaymentReceiptProps {
  payment: any;
  booking: any;
}

export function generateReceiptHTML({ payment, booking }: PaymentReceiptProps) {
  const receiptDate = format(new Date(), "MMMM d, yyyy");
  const paymentDate = format(new Date(payment?.paymentDate), "MMMM d, yyyy h:mm a");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Receipt - ${RESORT_INFO.name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .receipt-title {
          font-size: 24px;
          color: #2c5282;
          margin-bottom: 10px;
        }
        .info-section {
          margin-bottom: 20px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .info-item {
          margin-bottom: 10px;
        }
        .label {
          font-weight: bold;
          color: #4a5568;
        }
        .value {
          color: #2d3748;
        }
        .total {
          font-size: 18px;
          font-weight: bold;
          text-align: right;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 14px;
          color: #718096;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${RESORT_INFO.name}</h1>
        <p>${RESORT_INFO.location}</p>
        <p>Tel: ${RESORT_INFO.phone}</p>
      </div>

      <div class="receipt-title">Payment Receipt</div>
      
      <div class="info-section">
        <p class="label">Receipt Date: ${receiptDate}</p>
        <p class="label">Receipt Number: RCP-${payment.id.slice(0, 8).toUpperCase()}</p>
      </div>

      <div class="info-grid">
        <div>
          <h3>Guest Information</h3>
          <div class="info-item">
            <span class="label">Name:</span>
            <span class="value">${booking.guestName}</span>
          </div>
          <div class="info-item">
            <span class="label">Email:</span>
            <span class="value">${booking.guestEmail}</span>
          </div>
          <div class="info-item">
            <span class="label">Phone:</span>
            <span class="value">${booking.guestPhone}</span>
          </div>
        </div>

        <div>
          <h3>Payment Information</h3>
          <div class="info-item">
            <span class="label">Payment Method:</span>
            <span class="value">GCash</span>
          </div>
          <div class="info-item">
            <span class="label">Reference Number:</span>
            <span class="value">${payment.referenceNumber}</span>
          </div>
          <div class="info-item">
            <span class="label">Payment Date:</span>
            <span class="value">${paymentDate}</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3>Booking Details</h3>
        <div class="info-item">
          <span class="label">Check-in:</span>
          <span class="value">${booking.checkInDate}</span>
        </div>
        <div class="info-item">
          <span class="label">Check-out:</span>
          <span class="value">${booking.checkOutDate}</span>
        </div>
        <div class="info-item">
          <span class="label">Number of Guests:</span>
          <span class="value">${booking.guestCount}</span>
        </div>
      </div>

      <div class="total">
        <div class="info-item">
          <span class="label">Total Amount Paid:</span>
          <span class="value">₱${parseFloat(payment.amount).toLocaleString()}</span>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for choosing ${RESORT_INFO.name}!</p>
        <p>For inquiries, please contact us at ${RESORT_INFO.email}</p>
        <p>This is an official receipt. Please keep this for your records.</p>
      </div>
    </body>
    </html>
  `;
}

export default function PaymentReceipt({ payment, booking }: PaymentReceiptProps) {
  const handleDownload = () => {
    const html = generateReceiptHTML({ payment, booking });
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment.id.slice(0, 8)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      Download Receipt
    </button>
  );
}