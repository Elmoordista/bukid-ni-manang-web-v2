import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calendar, 
  Users, 
  CreditCard, 
  HelpCircle, 
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Ban
} from "lucide-react";

export type BookingStatus = "confirmed" | "rejected" | "pending" | "cancelled";

type DashboardStats = {
  totalBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  pendingInquiries: number;
  pendingPayments: number;
};

type Booking = {
  id: string;
  guestName: string;
  dates: string;
  numberOfBookings: number;
  total: number;
  status: BookingStatus;
  contact: string;
};

type Inquiry = {
  date: string;
  message: string;
  contact: string;
};

const mockStats: DashboardStats = {
  totalBookings: 156,
  confirmedBookings: 134,
  totalRevenue: 487500,
  pendingInquiries: 12,
  pendingPayments: 8,
};

const mockBookings: Booking[] = [
  {
    id: "B001",
    guestName: "John Smith",
    dates: "Oct 25-27, 2025",
    numberOfBookings: 2,
    total: 7000,
    status: "confirmed",
    contact: "john@example.com"
  },
  {
    id: "B002",
    guestName: "Maria Santos",
    dates: "Oct 28-29, 2025",
    numberOfBookings: 1,
    total: 3500,
    status: "pending",
    contact: "maria@example.com"
  },
  {
    id: "B003",
    guestName: "Robert Lee",
    dates: "Oct 30-31, 2025",
    numberOfBookings: 3,
    total: 10500,
    status: "cancelled",
    contact: "robert@example.com"
  },
];

const mockInquiries: Inquiry[] = [
  {
    date: "10/23/2025",
    message: "Interested in weekend booking",
    contact: "john@example.com"
  },
  {
    date: "10/23/2025",
    message: "Group booking inquiry",
    contact: "jane@example.com"
  },
];

const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const statusConfig = {
    confirmed: { color: "bg-green-500", icon: CheckCircle },
    rejected: { color: "bg-red-500", icon: XCircle },
    pending: { color: "bg-yellow-500", icon: Clock },
    cancelled: { color: "bg-gray-500", icon: Ban },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} text-white`}>
      <Icon className="w-4 h-4 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.confirmedBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{mockStats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingInquiries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingPayments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings & Inquiries */}
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList>
          <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
          <TabsTrigger value="inquiries">Recent Inquiries</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Recent Booking Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.guestName}</TableCell>
                      <TableCell>{booking.dates}</TableCell>
                      <TableCell>{booking.numberOfBookings}</TableCell>
                      <TableCell>₱{booking.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell>{booking.contact}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inquiries">
          <Card>
            <CardHeader>
              <CardTitle>Recent Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInquiries.map((inquiry, index) => (
                    <TableRow key={index}>
                      <TableCell>{inquiry.date}</TableCell>
                      <TableCell>{inquiry.message}</TableCell>
                      <TableCell className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{inquiry.contact}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}