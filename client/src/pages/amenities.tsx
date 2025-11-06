import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ProtectedBookingForm from "@/components/amenity-booking/protected-booking-form";
import { AMENITIES } from "@/lib/constants";
import {
  Coffee,
  Waves,
  Utensils,
  Flower,
  TreePine,
  Fish,
  Gamepad,
  Car,
  Bus,
  Search,
  Filter,
  X,
  PartyPopper,
  Pool as PoolIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PoolBookingForm,
  RestaurantBookingForm,
  EventsBookingForm,
  ShuttleBookingForm,
} from "@/components/amenity-booking";

const iconMap = {
  coffee: Coffee,
  waves: Waves,
  utensils: Utensils,
  flower: Flower,
  tree: TreePine,
  fish: Fish,
  gamepad: Gamepad,
  car: Car,
  bus: Bus,
};

export default function AmenitiesPage() {
  const [selectedAmenity, setSelectedAmenity] = useState<typeof AMENITIES[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [filteredAmenities, setFilteredAmenities] = useState(AMENITIES);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const filtered = AMENITIES.filter(amenity => {
      const matchesSearch = amenity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          amenity.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPrice = priceFilter === "all" ||
        (priceFilter === "free" && amenity.price === "Free") ||
        (priceFilter === "paid" && amenity.price !== "Free");

      return matchesSearch && matchesPrice;
    });
    setFilteredAmenities(filtered);
  }, [searchQuery, priceFilter]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Our Amenities</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover all the wonderful facilities and activities we offer at Bukid ni Manang
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-card rounded-lg p-4 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Amenities</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price-filter">Price Filter</Label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger id="price-filter" className="w-full">
                  <SelectValue placeholder="Filter by price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free Amenities</SelectItem>
                  <SelectItem value="paid">Paid Amenities</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {(searchQuery || priceFilter !== "all") && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>{filteredAmenities.length} amenities found</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setPriceFilter("all");
                }}
              >
                Clear Filters
                <X className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAmenities.map((amenity, index) => {
            const IconComponent = iconMap[amenity.icon as keyof typeof iconMap] || Coffee;
            
            return (
              <Card 
                key={index} 
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => {
                  setSelectedAmenity(amenity);
                  setIsDialogOpen(true);
                  setActiveTab("details");
                }}
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <IconComponent className="h-24 w-24 text-primary/20" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {amenity.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      amenity.price === "Free" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-primary/10 text-primary"
                    }`}>
                      {amenity.price}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {amenity.description}
                  </p>
                  <div className="flex items-center justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setSelectedAmenity(null);
            setActiveTab("details");
          }
        }}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {selectedAmenity && (
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <span className="flex-1">{selectedAmenity.name}</span>
                {selectedAmenity.icon && iconMap[selectedAmenity.icon as keyof typeof iconMap] && (
                  <div className="inline-block bg-primary/10 p-2 rounded-full">
                    {(() => {
                      const IconComponent = iconMap[selectedAmenity.icon as keyof typeof iconMap] || Coffee;
                      return <IconComponent className="h-5 w-5 text-primary" />;
                    })()}
                  </div>
                )}
              </DialogTitle>
              <DialogDescription className="text-base mt-4">
                {selectedAmenity.description}
              </DialogDescription>
            </DialogHeader>
          )}

          <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full" style={{ 
              gridTemplateColumns: selectedAmenity?.isBookable ? '1fr 1fr' : '1fr'
            }}>
              <TabsTrigger value="details">Details</TabsTrigger>
              {selectedAmenity?.isBookable && <TabsTrigger value="booking">Book Now</TabsTrigger>}
            </TabsList>              <TabsContent value="details" className="space-y-6">
                {/* Price Information */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Pricing</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-base">{selectedAmenity?.price}</p>
                  </div>
                </div>

                {/* Detailed Information */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Details</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-base">{selectedAmenity?.details}</p>
                  </div>
                </div>

                {/* Guidelines */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Guidelines</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-base">{selectedAmenity?.guidelines}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="booking">
                {selectedAmenity?.isBookable ? (
                  <ProtectedBookingForm>
                    {selectedAmenity?.name.toLowerCase().includes('pool') && <PoolBookingForm />}
                    {selectedAmenity?.name.toLowerCase().includes('restaurant') && <RestaurantBookingForm />}
                    {selectedAmenity?.name.toLowerCase().includes('event') && <EventsBookingForm />}
                    {selectedAmenity?.name.toLowerCase().includes('shuttle') && <ShuttleBookingForm />}
                  </ProtectedBookingForm>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">This amenity is not available for online booking.</p>
                    <p className="text-sm text-muted-foreground mt-2">Please visit us in person or contact us for more information.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedAmenity(null);
                setActiveTab("details");
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}