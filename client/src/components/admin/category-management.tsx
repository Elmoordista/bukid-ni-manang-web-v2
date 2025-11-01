import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

export interface RoomCategory {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  features: string[];
}

const defaultCategories: RoomCategory[] = [
  {
    id: "1",
    name: "Deluxe",
    description: "Luxury rooms with premium amenities",
    basePrice: 3500,
    features: ["Premium Bedding", "City View", "Mini Bar"],
  },
  {
    id: "2",
    name: "Standard",
    description: "Comfortable rooms for a pleasant stay",
    basePrice: 2500,
    features: ["Basic Amenities", "Garden View"],
  },
];

export default function CategoryManagement() {
  const [categories, setCategories] = useState<RoomCategory[]>(defaultCategories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory | null>(null);
  const [formData, setFormData] = useState<Omit<RoomCategory, "id">>({
    name: "",
    description: "",
    basePrice: 0,
    features: [],
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      basePrice: 0,
      features: [],
    });
  };

  const handleAddCategory = () => {
    const newCategory: RoomCategory = {
      ...formData,
      id: String(categories.length + 1),
    };

    setCategories([...categories, newCategory]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Category Added",
      description: "New room category has been added successfully.",
    });
  };

  const handleEditCategory = () => {
    if (!selectedCategory) return;

    const updatedCategories = categories.map((category) =>
      category.id === selectedCategory.id
        ? { ...category, ...formData }
        : category
    );

    setCategories(updatedCategories);
    setIsEditDialogOpen(false);
    setSelectedCategory(null);
    resetForm();
    toast({
      title: "Category Updated",
      description: "Room category has been updated successfully.",
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const updatedCategories = categories.filter(
        (category) => category.id !== categoryId
      );
      setCategories(updatedCategories);
      toast({
        title: "Category Deleted",
        description: "Room category has been deleted successfully.",
        variant: "destructive",
      });
    }
  };

  const CategoryForm = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter category name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter category description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="basePrice">Base Price</Label>
        <Input
          id="basePrice"
          type="number"
          value={formData.basePrice}
          onChange={(e) =>
            setFormData({ ...formData, basePrice: Number(e.target.value) })
          }
          placeholder="Enter base price"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features (comma-separated)</Label>
        <Input
          id="features"
          value={formData.features.join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              features: e.target.value.split(",").map((f) => f.trim()),
            })
          }
          placeholder="Enter features, separated by commas"
        />
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Room Categories</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>₱{category.basePrice.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {category.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory(category);
                        setFormData({
                          name: category.name,
                          description: category.description,
                          basePrice: category.basePrice,
                          features: category.features,
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Room Category</DialogTitle>
            </DialogHeader>
            <CategoryForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Room Category</DialogTitle>
            </DialogHeader>
            <CategoryForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCategory}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}