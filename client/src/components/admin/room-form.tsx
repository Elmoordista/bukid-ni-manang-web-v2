import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImagePlus } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import type { Accommodation } from "@/data/mockData";

const formSchema = z.object({
  name: z.string().min(2, { message: "Room name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  maxGuests: z.number().min(1, { message: "Must accommodate at least 1 guest" }),
  bedrooms: z.number().min(1, { message: "Must have at least 1 bedroom" }),
  bathrooms: z.number().min(1, { message: "Must have at least 1 bathroom" }),
  location: z.string().min(2, { message: "Location is required" }),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
  available: z.boolean()
});

interface RoomFormData extends z.infer<typeof formSchema> {
  id?: string;
}

interface RoomFormProps {
  room?: Accommodation;
  onSubmit: (data: RoomFormData) => void;
  mode: 'add' | 'edit';
}

export function RoomForm({ room, onSubmit, mode }: RoomFormProps) {
  const [newAmenity, setNewAmenity] = useState("");

  const form = useForm<RoomFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: room ? {
      name: room.name,
      description: room.description,
      price: room.price,
      maxGuests: room.maxGuests,
      bedrooms: room.bedrooms,
      bathrooms: room.bathrooms,
      amenities: room.amenities,
      images: room.images,
      available: room.available,
      location: room.location,
    } : {
      name: "",
      description: "",
      price: 0,
      maxGuests: 1,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [],
      images: [],
      available: true,
      location: "",
    }
  });

  const handleAddAmenity = () => {
    if (newAmenity && !form.getValues("amenities").includes(newAmenity)) {
      form.setValue("amenities", [...form.getValues("amenities"), newAmenity]);
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    form.setValue(
      "amenities",
      form.getValues("amenities").filter((a) => a !== amenity)
    );
  };

  const handleAddImage = (url: string) => {
    if (url) {
      form.setValue("images", [...form.getValues("images"), url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    form.setValue(
      "images",
      form.getValues("images").filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter room name" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter room description" />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Night</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                    min="0"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxGuests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Guests</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                    min="1"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                    min="1"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                    min="1"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter room location" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amenities"
          render={() => (
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.getValues("amenities").map((amenity) => (
                  <Badge
                    key={amenity}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveAmenity(amenity)}
                  >
                    {amenity} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Add amenity"
                />
                <Button type="button" onClick={handleAddAmenity}>
                  Add
                </Button>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <div className="flex flex-wrap gap-4 mb-4">
                {form.getValues("images").map((image, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`Room ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={() => handleRemoveImage(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Image URL"
                  onChange={(e) => e.target.value && handleAddImage(e.target.value)}
                />
                <Button type="button">
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormLabel className="mt-0">Available for Booking</FormLabel>
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">{mode === 'add' ? 'Add Room' : 'Save Changes'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}