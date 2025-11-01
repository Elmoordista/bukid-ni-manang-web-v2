import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { mockAccommodations, mockBookings } from "@/data/mockData";
import type { Accommodation, Booking } from "@/data/mockData";

const generateMonthlyData = (bookings: Booking[]) => {
  const monthlyData = Array(12).fill(0).map((_, i) => ({
    month: new Date(2025, i).toLocaleString('default', { month: 'short' }),
    bookings: 0,
    revenue: 0,
  }));

  bookings.forEach(booking => {
    if (booking.status === 'confirmed') {
      const date = new Date(booking.checkInDate || booking.checkIn);
      const month = date.getMonth();
      monthlyData[month].bookings++;
      monthlyData[month].revenue += booking.totalAmount || booking.totalPrice || 0;
    }
  });

  return monthlyData;
};

const generateRoomOccupancy = (bookings: Booking[], accommodations: Accommodation[]) => {
  return accommodations.map(room => {
    const roomBookings = bookings.filter(b => 
      b.accommodationId === room.id && b.status === 'confirmed'
    );
    
    return {
      name: room.name,
      bookings: roomBookings.length,
      revenue: roomBookings.reduce((sum, b) => sum + (b.totalAmount || b.totalPrice || 0), 0),
      occupancyRate: (roomBookings.length / bookings.length) * 100,
    };
  });
};

export default function RoomAnalytics() {
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("month");
  
  const monthlyData = generateMonthlyData(mockBookings);
  const roomOccupancy = generateRoomOccupancy(mockBookings, mockAccommodations);

  const totalRevenue = mockBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.totalAmount || b.totalPrice || 0), 0);

  const totalBookings = mockBookings.filter(b => b.status === 'confirmed').length;

  const averageOccupancyRate = roomOccupancy.reduce((sum, room) => sum + room.occupancyRate, 0) / roomOccupancy.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Room Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Track room performance and booking trends
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              {mockAccommodations.map(room => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From confirmed bookings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Confirmed reservations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageOccupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all rooms
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Booking Trends</CardTitle>
              <CardDescription>Number of bookings per month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Room</CardTitle>
              <CardDescription>Total revenue generated per room</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={roomOccupancy}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="occupancy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Room Occupancy Rates</CardTitle>
              <CardDescription>Percentage of time rooms are occupied</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={roomOccupancy}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="occupancyRate" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}