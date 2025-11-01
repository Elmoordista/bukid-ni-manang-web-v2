"use client";

import { useEffect, useState } from "react";
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

// const formSchema = z.object({
//   name: z.string().min(2, { message: "Room name must be at least 2 characters" }),
//   description: z.string().min(10, { message: "Description must be at least 10 characters" }),
//   price: z.number().min(0, { message: "Price must be a positive number" }),
//   maxGuests: z.number().min(1, { message: "Must accommodate at least 1 guest" }),
//   bedrooms: z.number().min(1, { message: "Must have at least 1 bedroom" }),
//   bathrooms: z.number().min(1, { message: "Must have at least 1 bathroom" }),
//   location: z.string().min(2, { message: "Location is required" }),
//   amenities: z.array(z.string()),
//   images: z.array(z.string()),
//   available: z.boolean()
// });

const formSchema = z.object({
  name: z.string().min(2, { message: "Room name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  maxGuests: z.coerce.number().min(1, { message: "Must accommodate at least 1 guest" }),
  bedrooms: z.coerce.number().min(1, { message: "Must have at least 1 bedroom" }),
  bathrooms: z.coerce.number().min(1, { message: "Must have at least 1 bathroom" }),
  location: z.string().min(2, { message: "Location is required" }),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
  available: z.boolean(),
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

  const handleExtractImages = (images: string[]) => {
    return images.map((img)=>{
      return img.image_url;
    });
  }

  // const form = useForm<RoomFormData>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: room ? {
  //     name: room.name,
  //     description: room.description,
  //     price: room.price_per_night,
  //     maxGuests: room.max_occupancy,
  //     bedrooms: room.number_of_beds,
  //     bathrooms: room.number_of_bathrooms,
  //     amenities: room.amenities ? JSON.parse(room.amenities) : [],
  //     images: room.images && room.images.length > 0 ? handleExtractImages(room.images) : [],
  //     available: room.status,
  //     location: room.location,
  //   } : {
  //     name: "",
  //     description: "",
  //     price: 0,
  //     maxGuests: 1,
  //     bedrooms: 1,
  //     bathrooms: 1,
  //     amenities: [],
  //     images: [],
  //     available: true,
  //     location: "",
  //   }
  // });

  const form = useForm<RoomFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  });

  useEffect(() => {
    if (room && mode === "edit") {
      form.reset({
        name: room.name || "",
        description: room.description || "",
        price: Number(room.price_per_night ?? 0),
        maxGuests: Number(room.max_occupancy ?? 1),
        bedrooms: Number(room.number_of_beds ?? 1),
        bathrooms: Number(room.number_of_bathrooms ?? 1),
        amenities: room.amenities ? JSON.parse(room.amenities) : [],
        images: room.images?.length ? handleExtractImages(room.images) : [],
        available: !!room.status,
        location: room.location || "",
      });
    } else if (mode === "add") {
      form.reset(); // clear previous data
    }
  }, [room, mode]);



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

  // Handle file input and convert to base64
  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    const selectedFiles = Array.from(files);

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        form.setValue("images", [...form.getValues("images"), base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    form.setValue(
      "images",
      form.getValues("images").filter((_, i) => i !== index)
    );
  };

  // const handleSubmitData = (data: RoomFormData) => {
  //   //add the images
  //   var params = data;
  //   params.images = form.getValues("images");
  //   console.log(params,'params')
  //   onSubmit(params);
  // }

  const onFormSubmit = (data: RoomFormData) => {
    // Ensure images from state are included
    onSubmit({ ...data, images: form.getValues("images") });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Room Name */}
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

        {/* Description */}
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

        {/* Numeric Inputs */}
        <div className="grid grid-cols-2 gap-4">
          {["price","maxGuests","bedrooms","bathrooms"].map((key) => (
            <FormField
              key={key}
              control={form.control}
              name={key as any}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{key === "price" ? "Price per Night" : key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                      min={key === "price" ? 0 : 1}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Location */}
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

        {/* Amenities */}
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
                <Button type="button" onClick={handleAddAmenity}>Add</Button>
              </div>
            </FormItem>
          )}
        />

        {/* Images */}
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Images</FormLabel>

              {/* Preview */}
              <div className="flex flex-wrap gap-4 mb-4">
                {form.getValues("images").map((image, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden">
                    <img src={image} alt={`Room ${index + 1}`} className="w-full h-full object-cover" />
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

              {/* File Input */}
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange(e.target.files)}
                />
                <Button type="button">
                  <ImagePlus className="w-4 h-4 mr-2" /> Upload
                </Button>
              </div>
            </FormItem>
          )}
        />

        {/* Available */}
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
