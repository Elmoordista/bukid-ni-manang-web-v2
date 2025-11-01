import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CalendarDays, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Home,
  Clock,
  BarChart3,
  RefreshCw,
  Calendar
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface OccupancyData {
  currentOccupancy: number;
  totalCapacity: number;
  occupancyRate: number;
  todayBookings: number;
  thisWeekBookings: number;
  thisMonthBookings: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  averageStayLength: number;
  popularRoomTypes: Array<{
    name: string;
    bookingCount: number;
    occupancyRate: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    occupancyRate: number;
    revenue: number;
  }>;
}

export default function OccupancyReport() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const { data: occupancyData, refetch, isLoading } = useQuery({
    queryKey: ["/api/admin/occupancy"],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time data
  });

  const handleRefresh = () => {
    refetch();
    setLastRefresh(new Date());
  };

  // Mock data for demo (replace with real API data)
  const mockData: OccupancyData = {
    currentOccupancy: 12,
    totalCapacity: 20,
    occupancyRate: 60,
    todayBookings: 3,
    thisWeekBookings: 18,
    thisMonthBookings: 45,
    revenueToday: 15000,
    revenueThisWeek: 94000,
    revenueThisMonth: 280000,
    averageStayLength: 2.3,
    popularRoomTypes: [
      { name: "Farm Cottage", bookingCount: 25, occupancyRate: 75 },
      { name: "Garden Suite", bookingCount: 20, occupancyRate: 65 },
      { name: "Pool Villa", bookingCount: 15, occupancyRate: 80 }
    ],
    monthlyTrends: [
      { month: "Jan", occupancyRate: 45, revenue: 180000 },
      { month: "Feb", occupancyRate: 55, revenue: 220000 },
      { month: "Mar", occupancyRate: 60, revenue: 280000 }
    ]
  };

  const data = occupancyData || mockData;

  const getPeriodData = () => {
    switch (selectedPeriod) {
      case 'today':
        return {
          bookings: data.todayBookings,
          revenue: data.revenueToday,
          label: 'Today'
        };
      case 'week':
        return {
          bookings: data.thisWeekBookings,
          revenue: data.revenueThisWeek,
          label: 'This Week'
        };
      case 'month':
        return {
          bookings: data.thisMonthBookings,
          revenue: data.revenueThisMonth,
          label: 'This Month'
        };
    }
  };

  const periodData = getPeriodData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Occupancy Report</h2>
          <p className="text-muted-foreground">Real-time booking and occupancy analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Current Occupancy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-effect border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Occupancy</p>
                <p className="text-3xl font-bold text-foreground">
                  {data.currentOccupancy}/{data.totalCapacity}
                </p>
              </div>
              <Home className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4">
              <Progress value={data.occupancyRate} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">{data.occupancyRate}% occupied</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Stay</p>
                <p className="text-3xl font-bold text-foreground">{data.averageStayLength}</p>
                <p className="text-sm text-muted-foreground">nights per booking</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Bookings</p>
                <p className="text-3xl font-bold text-foreground">{data.todayBookings}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <p className="text-sm text-green-500">+15% from yesterday</p>
                </div>
              </div>
              <CalendarDays className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Guests</p>
                <p className="text-3xl font-bold text-foreground">{data.currentOccupancy * 2}</p>
                <p className="text-sm text-muted-foreground">estimated total guests</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {(['today', 'week', 'month'] as const).map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
          >
            {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
          </Button>
        ))}
      </div>

      {/* Period Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {periodData.label} Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Bookings</span>
              <span className="text-2xl font-bold">{periodData.bookings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Revenue Generated</span>
              <span className="text-2xl font-bold text-primary">₱{periodData.revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Average per Booking</span>
              <span className="text-xl font-semibold">
                ₱{Math.round(periodData.revenue / Math.max(periodData.bookings, 1)).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Popular Room Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.popularRoomTypes.map((room, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{room.name}</span>
                  <Badge variant={room.occupancyRate > 70 ? 'default' : 'secondary'}>
                    {room.occupancyRate}%
                  </Badge>
                </div>
                <Progress value={room.occupancyRate} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {room.bookingCount} bookings this month
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Real-time Status Indicator */}
      <Card className="glass-effect border-0 shadow-xl border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Real-time tracking active</span>
            <Clock className="h-4 w-4 text-muted-foreground ml-auto" />
            <span className="text-sm text-muted-foreground">Updates every 30 seconds</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}