import { useState } from "react";
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
import { mockAccommodations } from "@/data/mockData";
import type { Accommodation } from "@/data/mockData";
import { RoomForm } from "./room-form";

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
  const [rooms, setRooms] = useState<Accommodation[]>(mockAccommodations);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Accommodation | null>(null);
  const [newAmenity, setNewAmenity] = useState("");
  const { toast } = useToast();

  const handleAddRoom = (formData: RoomFormData) => {
    const newRoom: Accommodation = {
      ...formData,
      id: String(rooms.length + 1),
      rating: 0,
      reviews: 0,
    };

    setRooms([...rooms, newRoom]);
    setIsAddDialogOpen(false);
    toast({
      title: "Room Added",
      description: "New room has been added successfully.",
    });
  };

  const handleEditRoom = (formData: RoomFormData) => {
    if (!selectedRoom) return;

    const updatedRooms = rooms.map((room) =>
      room.id === selectedRoom.id ? { ...room, ...formData } : room
    );

    setRooms(updatedRooms);
    setIsEditDialogOpen(false);
    setSelectedRoom(null);
    toast({
      title: "Room Updated",
      description: "Room details have been updated successfully.",
    });
  };

  const handleDeleteRoom = (roomId: string) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      const updatedRooms = rooms.filter((room) => room.id !== roomId);
      setRooms(updatedRooms);
      toast({
        title: "Room Deleted",
        description: "Room has been deleted successfully.",
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
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.location}</TableCell>
                  <TableCell>₱{room.price.toLocaleString()}</TableCell>
                  <TableCell>{room.maxGuests}</TableCell>
                  <TableCell>
                    <Badge variant={room.available ? "default" : "secondary"}>
                      {room.available ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
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
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new room to the system.
            </DialogDescription>
          </DialogHeader>
          <RoomForm onSubmit={handleAddRoom} mode="add" />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update the room details below.
            </DialogDescription>
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