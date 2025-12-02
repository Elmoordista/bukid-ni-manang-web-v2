// import { useState } from "react";
import RoomManagementComponent from "@/components/admin/room-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RoomManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Room Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <RoomManagementComponent />
        </CardContent>
      </Card>
    </div>
  );
}