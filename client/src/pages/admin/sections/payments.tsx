"use client";

import { useEffect, useState } from "react";
import HttpClient from "@/lib/axiosInstance.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Filter, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Notiflix from "notiflix";

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
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🕓 Debounce search input
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPayments();
    }, 800);
    return () => clearTimeout(delay);
  }, [searchQuery, statusFilter, currentPage]);

  // 📦 Fetch payments (simulate API or replace with real)
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await HttpClient.get("/payment", {
        params: {
          page: currentPage,
          per_page: pageSize,
          search: searchQuery,
          status: statusFilter !== "all" ? statusFilter : "",
        },
      });
      setPayments(response.data.data.data);
      setTotalItems(response.data.data.total);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast({ title: "Error", description: "Failed to load payments." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (paymentId: string, newStatus: Payment["status"]) => {
     try {
      setLoading(true);
        const response = await HttpClient.put("/payment/" + paymentId,{
          status: newStatus
        });
        toast({
          title: "Status Updated",
          description: `Payment ${paymentId} has been marked as ${newStatus}.`,
        });
        fetchPayments();
      } catch (error) {
        console.error("Error fetching payments:", error);
        toast({ title: "Error", description: "Failed to load payments." });
      } finally {
        setLoading(false);
      }
  };

  // const handleUpdateStatus = (paymentId: string, newStatus: Payment["status"]) => {
  //   setPayments((prev) =>
  //     prev.map((p) =>
  //       p.id === paymentId ? { ...p, status: newStatus } : p
  //     )
  //   );

  //   toast({
  //     title: "Status Updated",
  //     description: `Payment ${paymentId} has been marked as ${newStatus}.`,
  //   });
  // };
  const handleDownloadReceipt = (payment: Payment) => {
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for payment ${payment.reference} has been downloaded.`,
    });
  };

  const totalAmount = payments.reduce(
    (sum, p) => (p.status === "verified" ? sum + p.amount : sum),
    0
  );

  const totalPages = Math.ceil(totalItems / pageSize);

 const downloadPDF = async () => {
  Notiflix.Loading.standard('Generating PDF...');
  try {

    const response = await HttpClient.post(
      "payment/export-payments",
      { headerNote: "Generated via React frontend" },
      { responseType: "blob" } // important
    );

    // Create PDF blob
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    // ✅ Open the PDF in a new tab
    window.open(url, "_blank");

    // Clean up URL object after use
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);

  } catch (error) {
    console.error("Error generating PDF:", error);
    // alert("Failed to generate PDF. Please try again.");
  } finally {
    Notiflix.Loading.remove();
  }
};


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>~
          <p className="text-muted-foreground">
            Total Verified Payments: ₱{totalAmount.toLocaleString()}
          </p>
        </div>
        <Button onClick={downloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>All Payments</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
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
          {loading ? (
            <p className="text-center text-sm text-muted-foreground py-6">Loading...</p>
          ) : (
            <>
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
                  {payments.length > 0 && payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.reference_number}</TableCell>
                      <TableCell>{p.booking_id}</TableCell>
                      <TableCell>{p.booking?.user?.name}</TableCell>
                      <TableCell>₱{p.amount.toLocaleString()}</TableCell>
                      <TableCell>{p.payment_method}</TableCell>
                      <TableCell>{new Date(p.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            p.status === "verified"
                              ? "success"
                              : p.status === "pending"
                              ? "secondary"
                              : p.status === "failed"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPayment(p);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadReceipt(p)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {payments.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No payments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {payments.length > 0 &&
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
               }

            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Detailed payment information</DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <p><strong>Reference:</strong> {selectedPayment.reference_number}</p>
              <p><strong>Booking ID:</strong> {selectedPayment.booking_id}</p>
              <p><strong>Customer:</strong> {selectedPayment.booking?.user?.name}</p>
              <p><strong>Amount:</strong> ₱{selectedPayment.amount.toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedPayment.status}</p>

              {selectedPayment.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      handleUpdateStatus(selectedPayment.id, "verified");
                      setIsDetailsOpen(false);
                    }}
                  >
                    Verify
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleUpdateStatus(selectedPayment.id, "failed");
                      setIsDetailsOpen(false);
                    }}
                  >
                    Fail
                  </Button>
                </div>
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
