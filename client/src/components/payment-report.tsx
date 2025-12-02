import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subDays, isWithinInterval, parseISO } from "date-fns";
import { Download } from "lucide-react";
// import type { Payment } from "@shared/schema/payment";

const DATE_RANGES = {
  "7days": { label: "Last 7 Days", days: 7 },
  "30days": { label: "Last 30 Days", days: 30 },
  "90days": { label: "Last 90 Days", days: 90 },
  "all": { label: "All Time", days: 0 },
};

export default function PaymentReport() {
  const [dateRange, setDateRange] = useState("30days");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // const { data: payments = [] } = useQuery<Payment[]>({
  //   queryKey: ["/api/payments"],
  // });
  const { data: payments = [] } = useQuery<any[]>({
    queryKey: ["/api/payments"],
  });
  const filteredPayments = payments.filter((payment) => {
    // Date filter
    if (dateRange !== "all") {
      const startDate = subDays(new Date(), DATE_RANGES[dateRange as keyof typeof DATE_RANGES].days);
      const paymentDate = parseISO(payment.paymentDate);
      if (!isWithinInterval(paymentDate, { start: startDate, end: new Date() })) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== "all" && payment.paymentStatus !== statusFilter) {
      return false;
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        payment.senderName.toLowerCase().includes(searchLower) ||
        payment.referenceNumber.toLowerCase().includes(searchLower) ||
        payment.senderPhone.includes(searchTerm)
      );
    }

    return true;
  });

  const totalAmount = filteredPayments
    .filter(p => p.paymentStatus === "completed")
    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Reference",
      "Sender Name",
      "Phone",
      "Amount",
      "Status",
    ];

    const csvData = filteredPayments.map((payment) => [
      format(parseISO(payment.paymentDate), "yyyy-MM-dd HH:mm:ss"),
      payment.referenceNumber,
      payment.senderName,
      payment.senderPhone,
      payment.amount,
      payment.paymentStatus,
    ]);

    const csv = [
      headers.join(","),
      ...csvData.map(row => row.join(",")),
    ].join("\\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payment-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Payment Report</CardTitle>
            <CardDescription>
              View and analyze payment transactions
            </CardDescription>
          </div>
          <Button onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, reference, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DATE_RANGES).map(([value, { label }]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm text-muted-foreground">
              Total Amount (Completed Payments):{" "}
              <span className="font-bold text-green-600">
                ₱{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {format(parseISO(payment.paymentDate), "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell>{payment.referenceNumber}</TableCell>
                  <TableCell>{payment.senderName}</TableCell>
                  <TableCell>{payment.senderPhone}</TableCell>
                  <TableCell>₱{parseFloat(payment.amount).toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        payment.paymentStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : payment.paymentStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}