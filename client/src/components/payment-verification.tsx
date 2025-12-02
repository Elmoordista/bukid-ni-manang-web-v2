import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaymentReceipt from "./payment-receipt";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Eye, CheckCircle, XCircle } from "lucide-react";
// import type { Payment } from "@shared/schema/payment";

export default function PaymentVerification() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payments, isLoading: paymentsLoading } = useQuery<any[]>({
    queryKey: ["/api/payments"],
  });

  // const { data: bookings } = useQuery({
  //   queryKey: ["/api/admin/bookings"],
  // });
  const { data: bookings } = useQuery<any[]>({
    queryKey: ["/api/admin/bookings"],
  });

  const updatePaymentStatus = useMutation({
    mutationFn: async ({
      paymentId,
      status,
      notes,
    }: {
      paymentId: string;
      status: string;
      notes?: string;
    }) => {
      const response = await fetch(`/api/payments/${paymentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) {
        throw new Error("Failed to update payment status");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      toast({
        title: "Payment Updated",
        description: "Payment status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update payment status.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    // const variants: Record<string, string> = {
    //   pending: "warning",
    //   completed: "success",
    //   failed: "destructive",
    //   refunded: "default",
    // };

    return <Badge>{status}</Badge>;
  };

  if (paymentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-background border shadow-sm">
      <CardHeader className="bg-card">
        <CardTitle className="text-foreground">Payment Verification</CardTitle>
        <CardDescription className="text-muted-foreground">
          Review and verify GCash payments from customers
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-background">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead className="text-foreground font-medium">Date</TableHead>
              <TableHead className="text-foreground font-medium">Reference</TableHead>
              <TableHead className="text-foreground font-medium">Sender</TableHead>
              <TableHead className="text-foreground font-medium">Amount</TableHead>
              <TableHead className="text-foreground font-medium">Status</TableHead>
              <TableHead className="text-foreground font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments?.map((payment) => (
              <TableRow key={payment.id} className="border-b border-border hover:bg-muted/50">
                <TableCell className="text-foreground">
                  {format(new Date(payment.paymentDate), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-foreground font-medium">
                  {payment.referenceNumber}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-foreground">{payment.senderName}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.senderPhone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>₱{parseFloat(payment.amount).toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(payment.paymentStatus)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-background">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">Payment Details</DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Review payment information and proof of payment
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Payment Information</h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Reference:</span>{" "}
                                  {payment.referenceNumber}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Amount:</span>{" "}
                                  ₱{parseFloat(payment.amount).toLocaleString()}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Date:</span>{" "}
                                  {format(new Date(payment.paymentDate), "PPpp")}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Status:</span>{" "}
                                  {getStatusBadge(payment.paymentStatus)}
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Sender Details</h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Name:</span>{" "}
                                  {payment.senderName}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Phone:</span>{" "}
                                  {payment.senderPhone}
                                </div>
                              </div>
                            </div>
                          </div>

                          {payment.verificationImage && (
                            <div>
                              <h4 className="font-medium mb-2">Proof of Payment</h4>
                              <img
                                src={payment.verificationImage}
                                alt="Payment Verification"
                                className="max-w-full rounded-lg border"
                              />
                            </div>
                          )}

                          <div className="flex gap-2 mt-4">
                            {payment.paymentStatus === "pending" && (
                              <>
                                <Button
                                  onClick={() =>
                                    updatePaymentStatus.mutate({
                                      paymentId: payment.id,
                                      status: "completed",
                                    })
                                  }
                                  className="flex-1"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" /> Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    updatePaymentStatus.mutate({
                                      paymentId: payment.id,
                                      status: "failed",
                                      notes: "Payment verification failed",
                                    })
                                  }
                                  className="flex-1"
                                >
                                  <XCircle className="w-4 h-4 mr-1" /> Reject
                                </Button>
                              </>
                            )}
                            {payment.paymentStatus === "completed" && (
                              <PaymentReceipt
                                payment={payment}
                                booking={bookings?.find((b: any) => b.id === payment.bookingId)}
                              />
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}