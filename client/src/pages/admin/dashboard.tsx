import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth-provider";
import AdminNavigation from "@/components/admin-navigation";
import PaymentVerification from "@/components/payment-verification";
import BookingManagement from "@/components/booking-management";
import AmenityBookingsPanel from "@/components/admin/amenity-bookings";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");

  // If not admin, in production redirect to login. In dev, show a helper to sign in as mock admin.
  if (!user || user.role !== "admin") {
    if (!import.meta.env.DEV) {
      navigate("/login");
      return null;
    }

    // Dev helper UI to sign in as the mock admin so the dashboard (including Amenities) is visible
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-semibold">Admin access required</h2>
            <p className="text-sm text-muted-foreground">You must be signed in as an admin to view this page.</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              className="px-4 py-2 rounded bg-emerald-600 text-white"
              onClick={async () => {
                // Use the mock admin email from mockData (maria@example.com)
                await login('maria@example.com', '');
                // reload to re-evaluate auth state and render dashboard
                navigate('/admin/dashboard');
              }}
            >
              Sign in as Mock Admin (dev)
            </button>
            <button
              className="px-4 py-2 rounded bg-gray-200"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage bookings, verify payments, and monitor resort operations
          </p>
        </div>

        <Card className="p-4">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
            </TabsList>
            <TabsContent value="bookings" className="mt-4">
              <BookingManagement />
            </TabsContent>
            <TabsContent value="payments" className="mt-4">
              <PaymentVerification />
            </TabsContent>
            <TabsContent value="amenities" className="mt-4">
              <AmenityBookingsPanel />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}