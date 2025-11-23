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
  status: "pending" | "verified" | "failed";
  customerName: string;
  reference: string;
  date: string;
  method: string;
  bookingId: string;
  notes?: string;
}

export default function PaymentManagement() {
  const { toast } = useToast();
  const [reports, setreports] = useState([]);
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
      getReports();
    }, 800);
    return () => clearTimeout(delay);
  }, [searchQuery, statusFilter, currentPage]);

 const getReports = async (page = currentPage, search = searchQuery, status = statusFilter) => {
    try {
      setLoading(true);
      const response = await HttpClient.get("/booking/get-report", {
        params: {
          page: page,
          per_page: pageSize,
          search: search,
          status: status !== "all" ? status : "",
        },
      });
      setreports(response.data.data.data);
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
        getReports();
      } catch (error) {
        console.error("Error fetching payments:", error);
        toast({ title: "Error", description: "Failed to load payments." });
      } finally {
        setLoading(false);
      }
  };

  // const handleUpdateStatus = (paymentId: string, newStatus: Payment["status"]) => {
  //   setreports((prev) =>
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

  const totalAmount = reports.reduce(
    (sum, p) => (p.status === "done" ? sum + p.total_price : sum),
  0
  );

  const totalPages = Math.ceil(totalItems / pageSize);

 const downloadPDF = async () => {
  Notiflix.Loading.standard('Generating PDF...');
  try {

    const response = await HttpClient.post(
      "booking/export-reports",
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

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    // Only trigger search when user stops typing for 1s
    getReports(1, searchQuery, statusFilter);
    setCurrentPage(1);
  }, 1000); // 1 second delay

  return () => clearTimeout(delayDebounce); // cleanup
}, [searchQuery, statusFilter]);

const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(e.target.value);
};

const handleChangeFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
}

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Report Management</h1>
        </div>
        <Button onClick={downloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Reports</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search renter..."
                  value={searchQuery}
                  onChange={handleSearchQuery}
                  className="pl-8"
                />
              </div>

              <Select value={statusFilter} onValueChange={handleChangeFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
    
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
                    <TableHead>Name</TableHead>
                    <TableHead>Rent Amount</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Status</TableHead>
                    {/* <TableHead className="text-right">Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.length > 0 && reports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.user?.first_name} {r.user?.last_name}</TableCell>
                      <TableCell>₱{r.total_price.toLocaleString()}</TableCell>
                      <TableCell>{r.start_date}</TableCell>
                      <TableCell>{r.end_date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            r.status === "done"
                              ? "success"
                              : r.status === "pending"
                              ? "secondary"
                              : r.status === "cancelled"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                      {/* <TableCell className="text-right">
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
                      </TableCell> */}
                    </TableRow>
                  ))}
                  {reports.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No payments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {reports.length > 0 &&
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
