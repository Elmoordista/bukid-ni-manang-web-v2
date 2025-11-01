import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Armchair, Table, Utensils, Music, Camera } from "lucide-react";

interface AdditionalItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  category: 'furniture' | 'catering' | 'entertainment';
  maxQuantity: number;
}

interface AdditionalItemsProps {
  selectedItems: Array<{ id: string; quantity: number; }>;
  onItemChange: (itemId: string, quantity: number) => void;
}

const ADDITIONAL_ITEMS: AdditionalItem[] = [
  {
    id: 'plastic-chairs',
    name: 'Plastic Chairs',
    description: 'Comfortable outdoor plastic chairs',
    price: 50,
    icon: <Armchair className="h-5 w-5" />,
    category: 'furniture',
    maxQuantity: 50
  },
  {
    id: 'wooden-chairs',
    name: 'Wooden Chairs',
    description: 'Premium wooden chairs for events',
    price: 100,
    icon: <Armchair className="h-5 w-5" />,
    category: 'furniture',
    maxQuantity: 30
  },
  {
    id: 'round-tables',
    name: 'Round Tables (6-seater)',
    description: 'Round tables that seat 6 people',
    price: 300,
    icon: <Table className="h-5 w-5" />,
    category: 'furniture',
    maxQuantity: 20
  },
  {
    id: 'long-tables',
    name: 'Long Tables (10-seater)',
    description: 'Rectangular tables that seat 10 people',
    price: 500,
    icon: <Table className="h-5 w-5" />,
    category: 'furniture',
    maxQuantity: 15
  },
  {
    id: 'buffet-service',
    name: 'Buffet Setup',
    description: 'Complete buffet table setup with serving utensils',
    price: 2000,
    icon: <Utensils className="h-5 w-5" />,
    category: 'catering',
    maxQuantity: 3
  },
  {
    id: 'sound-system',
    name: 'Sound System',
    description: 'Professional sound system with microphones',
    price: 3000,
    icon: <Music className="h-5 w-5" />,
    category: 'entertainment',
    maxQuantity: 2
  },
  {
    id: 'photo-booth',
    name: 'Photo Booth Setup',
    description: 'Photo booth with props and backdrop',
    price: 2500,
    icon: <Camera className="h-5 w-5" />,
    category: 'entertainment',
    maxQuantity: 1
  }
];

const CATEGORY_LABELS = {
  furniture: 'Furniture & Seating',
  catering: 'Catering Equipment',
  entertainment: 'Entertainment'
};

export default function AdditionalItems({ selectedItems, onItemChange }: AdditionalItemsProps) {
  const getItemQuantity = (itemId: string) => {
    const item = selectedItems.find(i => i.id === itemId);
    return item?.quantity || 0;
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    const item = ADDITIONAL_ITEMS.find(i => i.id === itemId);
    if (item && newQuantity >= 0 && newQuantity <= item.maxQuantity) {
      onItemChange(itemId, newQuantity);
    }
  };

  const groupedItems = ADDITIONAL_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, AdditionalItem[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedItems).map(([category, items]) => (
        <Card key={category} className="glass-effect border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-primary">
              {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => {
              const quantity = getItemQuantity(item.id);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-primary">₱{item.price.toLocaleString()}</span>
                        <Badge variant="outline" className="text-xs">
                          Max {item.maxQuantity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, quantity - 1)}
                      disabled={quantity === 0}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <span className="min-w-[3rem] text-center font-medium">
                      {quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, quantity + 1)}
                      disabled={quantity >= item.maxQuantity}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
      
      {selectedItems.length > 0 && (
        <Card className="glass-effect border-0 shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Selected Items Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedItems
                .filter(item => item.quantity > 0)
                .map(selectedItem => {
                  const item = ADDITIONAL_ITEMS.find(i => i.id === selectedItem.id);
                  if (!item) return null;
                  
                  return (
                    <div key={selectedItem.id} className="flex justify-between items-center">
                      <span>{item.name} x{selectedItem.quantity}</span>
                      <span className="font-semibold">
                        ₱{(item.price * selectedItem.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Additional Items Total:</span>
                  <span className="text-primary">
                    ₱{selectedItems
                      .filter(item => item.quantity > 0)
                      .reduce((total, selectedItem) => {
                        const item = ADDITIONAL_ITEMS.find(i => i.id === selectedItem.id);
                        return total + (item ? item.price * selectedItem.quantity : 0);
                      }, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export { ADDITIONAL_ITEMS };
export type { AdditionalItem };