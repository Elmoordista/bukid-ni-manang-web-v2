import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CreditCard } from "lucide-react";
import type { Payment } from "@shared/schema/payment";

interface PaymentStatusDisplayProps {
  bookingId: string;
}

export default function PaymentStatusDisplay({ bookingId }: PaymentStatusDisplayProps) {
  const { data: payments } = useQuery<Payment[]>({
    queryKey: [`/api/bookings/${bookingId}/payments`],
  });

  if (!payments?.length) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "warning",
      completed: "success",
      failed: "destructive",
      refunded: "default",
    };

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium">Payment History</h3>
          </div>

          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="space-y-1">
                  <div className="text-sm font-medium">
                    GCash Payment - {payment.referenceNumber}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(payment.paymentDate), "MMM d, yyyy h:mm a")}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">
                      ₱{parseFloat(payment.amount).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {payment.senderName}
                    </div>
                  </div>
                  {getStatusBadge(payment.paymentStatus)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}