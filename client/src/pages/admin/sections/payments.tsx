import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Filter, Download, Eye } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Payment {
  id: string;
  amount: number;
  status: "pending" | "verified" | "failed" | "refunded";
  customerName: string;
  reference: string;
  date: string;
  method: string;
  bookingId: string;
  notes?: string;
}

export default function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      amount: 2999.00,
      status: "pending",
      customerName: "Juan Dela Cruz",
      reference: "PAY-001",
      date: new Date().toISOString(),
      method: "GCash",
      bookingId: "BK-001",
      notes: "Waiting for GCash confirmation"
    },
    {
      id: "2",
      amount: 4500.00, 
      status: "verified",
      customerName: "Maria Santos",
      reference: "PAY-002",
      date: new Date().toISOString(),
      method: "Cash",
      bookingId: "BK-002",
      notes: "Payment received at check-in"
    },
    {
      id: "3",
      amount: 3500.00,
      status: "failed",
      customerName: "Pedro Penduko",
      reference: "PAY-003",
      date: new Date().toISOString(),
      method: "GCash",
      bookingId: "BK-003",
      notes: "Invalid GCash reference number"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleUpdateStatus = (paymentId: string, newStatus: Payment['status']) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId ? { ...payment, status: newStatus } : payment
    ));

    toast({
      title: "Status Updated",
      description: `Payment ${paymentId} has been marked as ${newStatus}.`,
    });
  };

  const handleDownloadReceipt = (payment: Payment) => {
    // TODO: Implement receipt download logic
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for payment ${payment.reference} has been downloaded.`,
    });
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPayments.reduce((sum, payment) => 
    payment.status === "verified" ? sum + payment.amount : sum, 0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
          <p className="text-muted-foreground">
            Total Verified Payments: ₱{totalAmount.toLocaleString()}
          </p>
        </div>
        <Button onClick={() => {/* TODO: Export payments report */}}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Payments</CardTitle>
            <div className="flex space-x-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.reference}</TableCell>
                  <TableCell>{payment.bookingId}</TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell>₱{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{new Date(payment.date).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        payment.status === "verified" ? "success" :
                        payment.status === "pending" ? "secondary" :
                        payment.status === "failed" ? "destructive" :
                        "outline"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadReceipt(payment)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Detailed information about the payment.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="font-medium">{selectedPayment.reference}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-medium">{selectedPayment.bookingId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedPayment.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">₱{selectedPayment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{selectedPayment.method}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedPayment.date).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge 
                    variant={
                      selectedPayment.status === "verified" ? "success" :
                      selectedPayment.status === "pending" ? "secondary" :
                      selectedPayment.status === "failed" ? "destructive" :
                      "outline"
                    }
                  >
                    {selectedPayment.status}
                  </Badge>
                </div>
              </div>

              {selectedPayment.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedPayment.notes}</p>
                </div>
              )}

              {selectedPayment.status === "pending" && (
                <div className="flex space-x-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      handleUpdateStatus(selectedPayment.id, "verified");
                      setIsDetailsOpen(false);
                    }}
                  >
                    Verify Payment
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleUpdateStatus(selectedPayment.id, "failed");
                      setIsDetailsOpen(false);
                    }}
                  >
                    Mark as Failed
                  </Button>
                </div>
              )}

              {selectedPayment.status === "verified" && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    handleUpdateStatus(selectedPayment.id, "refunded");
                    setIsDetailsOpen(false);
                  }}
                >
                  Issue Refund
                </Button>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}