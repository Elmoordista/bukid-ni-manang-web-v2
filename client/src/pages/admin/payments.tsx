import Navigation from "@/components/navigation";
import PaymentVerification from "@/components/payment-verification";
import PaymentReport from "@/components/payment-report";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPayments() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <p className="text-muted-foreground">Review and manage GCash payments</p>
      </div>
      
      <Tabs defaultValue="verification">
        <TabsList className="mb-4">
          <TabsTrigger value="verification">Payment Verification</TabsTrigger>
          <TabsTrigger value="report">Payment Report</TabsTrigger>
        </TabsList>
        <TabsContent value="verification">
          <PaymentVerification />
        </TabsContent>
        <TabsContent value="report">
          <PaymentReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}