"use client";

import { useEffect, useState } from "react";
import HttpClient from "@/lib/axiosInstance.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { RoomForm } from "./room-form";

interface Accommodation {
  id: string;
  name: string;
  location: string;
  price: number;
  maxGuests: number;
  available: boolean;
}

interface RoomFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  available: boolean;
  location: string;
}

export default function RoomManagement() {
  const { toast } = useToast();
  // const {user} = useToast();
  const [rooms, setRooms] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Accommodation | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch rooms from API
  const fetchRooms = async (page = 1) => {
    setLoading(true);
    try {
      const res = await HttpClient.get(`/rooms/get-rooms?page=${page}&pageSize=${pageSize}`);
      if(res.data){
        setRooms(res.data.data.data);
        setTotalPages(res.data.data.last_page);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load rooms.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(currentPage);
  }, []);

  const handleAddRoom = async (formData: RoomFormData) => {
    try {
      await HttpClient.post("/rooms", formData);
      toast({ title: "Room Added", description: "Room added successfully." });
      setIsAddDialogOpen(false);
      fetchRooms(currentPage);
    } catch {
      toast({
        title: "Error",
        description: "Failed to add room.",
        variant: "destructive",
      });
    }
  };

  const handleEditRoom = async (formData: RoomFormData) => {
    if (!selectedRoom) return;
    try {
      await HttpClient.put(`/rooms/${selectedRoom.id}`, formData);
      toast({ title: "Room Updated", description: "Room updated successfully." });
      setIsEditDialogOpen(false);
      setSelectedRoom(null);
      fetchRooms(currentPage);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update room.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await HttpClient.delete(`/rooms/${roomId}`);
      toast({
        title: "Room Deleted",
        description: "Room has been deleted successfully.",
      });
      fetchRooms(currentPage);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete room.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Room Management</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Room
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Max Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>{room.name}</TableCell>
                      <TableCell>{room.location}</TableCell>
                      <TableCell>₱{room.price_per_night.toLocaleString()}</TableCell>
                      <TableCell>{room.max_occupancy}</TableCell>
                      <TableCell>
                        <Badge variant={room.status == "available" ? "default" : "secondary"}>
                          {room.status == "available" ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRoom(room);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1))
                      fetchRooms(currentPage - 1);
                    }
                  }
                >
                  Previous
                </Button>
                <p>
                  Page {currentPage} of {totalPages}
                </p>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() =>{
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                      fetchRooms(currentPage + 1);
                    }
                  }
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new room.
            </DialogDescription>
          </DialogHeader>
          <RoomForm onSubmit={handleAddRoom} mode="add" />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>Update the room details.</DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <RoomForm
              room={selectedRoom}
              onSubmit={handleEditRoom}
              mode="edit"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
