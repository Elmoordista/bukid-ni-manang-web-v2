import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth-provider";
import AdminNavigation from "@/components/admin-navigation";
import PaymentVerification from "@/components/payment-verification";
import BookingManagement from "@/components/booking-management";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");

  // Redirect non-admin users
  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
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
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
            <TabsContent value="bookings" className="mt-4">
              <BookingManagement />
            </TabsContent>
            <TabsContent value="payments" className="mt-4">
              <PaymentVerification />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}