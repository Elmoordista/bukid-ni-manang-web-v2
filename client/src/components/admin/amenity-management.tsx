import { useState } from 'react';
import { AMENITIES } from '@/lib/constants';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from 'lucide-react';

type Amenity = typeof AMENITIES[0];

export default function AmenityManagement() {
  const [amenities, setAmenities] = useState(AMENITIES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Amenity | null>(null);

  const handleEdit = (amenity: Amenity) => {
    setEditingId(amenity.name);
    setEditForm(amenity);
  };

  const handleSave = () => {
    if (!editForm) return;
    
    setAmenities(amenities.map(a => 
      a.name === editingId ? editForm : a
    ));
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = (name: string) => {
    setAmenities(amenities.filter(a => a.name !== name));
  };

  const handleAdd = () => {
    // const newAmenity: Amenity = {
    //   icon: "plus",
    //   name: "New Amenity",
    //   description: "Description",
    //   price: "₱0",
    //   details: "Details"
    // };
    // setAmenities([...amenities, newAmenity]);
    // handleEdit(newAmenity);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Amenities Management</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Amenity
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {amenities.map((amenity) => (
            <TableRow key={amenity.name}>
              {editingId === amenity.name ? (
                <>
                  <TableCell>
                    <Input
                      value={editForm?.name}
                      onChange={e => setEditForm({ ...editForm!, name: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Textarea
                      value={editForm?.description}
                      onChange={e => setEditForm({ ...editForm!, description: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editForm?.price}
                      onChange={e => setEditForm({ ...editForm!, price: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Textarea
                      value={editForm?.details}
                      onChange={e => setEditForm({ ...editForm!, details: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={handleSave} variant="outline" size="sm">
                      Save
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{amenity.name}</TableCell>
                  <TableCell>{amenity.description}</TableCell>
                  <TableCell>{amenity.price}</TableCell>
                  <TableCell>{amenity.details}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleEdit(amenity)}
                        variant="ghost"
                        size="sm"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(amenity.name)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}