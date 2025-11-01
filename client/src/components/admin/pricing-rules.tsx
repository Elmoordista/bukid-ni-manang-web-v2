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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface PricingRule {
  id: string;
  name: string;
  type: "seasonal" | "discount" | "special";
  value: number;
  startDate?: Date;
  endDate?: Date;
  conditions?: {
    minNights?: number;
    maxNights?: number;
    minGuests?: number;
    maxGuests?: number;
  };
  appliesTo: string[];
  description: string;
}

const defaultRules: PricingRule[] = [
  {
    id: "1",
    name: "Peak Season",
    type: "seasonal",
    value: 20, // 20% increase
    startDate: new Date(2025, 11, 15), // December 15
    endDate: new Date(2026, 0, 15), // January 15
    appliesTo: ["all"],
    description: "Holiday season price increase",
  },
  {
    id: "2",
    name: "Extended Stay",
    type: "discount",
    value: 15, // 15% discount
    conditions: {
      minNights: 7,
    },
    appliesTo: ["all"],
    description: "Discount for stays of 7 nights or more",
  },
];

export default function PricingRules() {
  const [rules, setRules] = useState<PricingRule[]>(defaultRules);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<PricingRule | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const { toast } = useToast();

  const [formData, setFormData] = useState<Omit<PricingRule, "id">>({
    name: "",
    type: "seasonal",
    value: 0,
    appliesTo: ["all"],
    description: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "seasonal",
      value: 0,
      appliesTo: ["all"],
      description: "",
    });
    setDateRange({ from: undefined, to: undefined });
  };

  const handleAddRule = () => {
    const newRule: PricingRule = {
      ...formData,
      id: String(rules.length + 1),
      startDate: dateRange.from,
      endDate: dateRange.to,
    };

    setRules([...rules, newRule]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Rule Added",
      description: "New pricing rule has been added successfully.",
    });
  };

  const handleEditRule = () => {
    if (!selectedRule) return;

    const updatedRules = rules.map((rule) =>
      rule.id === selectedRule.id
        ? {
            ...rule,
            ...formData,
            startDate: dateRange.from,
            endDate: dateRange.to,
          }
        : rule
    );

    setRules(updatedRules);
    setIsEditDialogOpen(false);
    setSelectedRule(null);
    resetForm();
    toast({
      title: "Rule Updated",
      description: "Pricing rule has been updated successfully.",
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      const updatedRules = rules.filter((rule) => rule.id !== ruleId);
      setRules(updatedRules);
      toast({
        title: "Rule Deleted",
        description: "Pricing rule has been deleted successfully.",
        variant: "destructive",
      });
    }
  };

  const RuleForm = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Rule Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter rule name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Rule Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: "seasonal" | "discount" | "special") =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select rule type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seasonal">Seasonal Pricing</SelectItem>
            <SelectItem value="discount">Discount</SelectItem>
            <SelectItem value="special">Special Rate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="value">
          {formData.type === "discount" ? "Discount Percentage" : "Price Adjustment (%)"}
        </Label>
        <Input
          id="value"
          type="number"
          value={formData.value}
          onChange={(e) =>
            setFormData({ ...formData, value: Number(e.target.value) })
          }
          placeholder="Enter value"
        />
      </div>

      {formData.type === "seasonal" && (
        <div className="space-y-2">
          <Label>Date Range</Label>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(range: any) => setDateRange(range)}
            numberOfMonths={2}
          />
        </div>
      )}

      {formData.type === "discount" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minNights">Minimum Nights</Label>
              <Input
                id="minNights"
                type="number"
                value={formData.conditions?.minNights || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    conditions: {
                      ...formData.conditions,
                      minNights: Number(e.target.value),
                    },
                  })
                }
                placeholder="Min nights"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxNights">Maximum Nights</Label>
              <Input
                id="maxNights"
                type="number"
                value={formData.conditions?.maxNights || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    conditions: {
                      ...formData.conditions,
                      maxNights: Number(e.target.value),
                    },
                  })
                }
                placeholder="Max nights"
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter rule description"
        />
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pricing Rules</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Rule
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Conditions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      rule.type === "discount"
                        ? "destructive"
                        : rule.type === "seasonal"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {rule.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {rule.type === "discount" ? "-" : "+"}
                  {rule.value}%
                </TableCell>
                <TableCell>
                  {rule.startDate && rule.endDate ? (
                    <>
                      {format(rule.startDate, "PP")} -{" "}
                      {format(rule.endDate, "PP")}
                    </>
                  ) : (
                    "Always"
                  )}
                </TableCell>
                <TableCell>
                  {rule.conditions?.minNights && (
                    <span className="text-sm">
                      Min {rule.conditions.minNights} nights
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRule(rule);
                        setFormData({
                          name: rule.name,
                          type: rule.type,
                          value: rule.value,
                          appliesTo: rule.appliesTo,
                          description: rule.description,
                          conditions: rule.conditions,
                        });
                        setDateRange({
                          from: rule.startDate,
                          to: rule.endDate,
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteRule(rule.id)}
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
              <DialogTitle>Add Pricing Rule</DialogTitle>
            </DialogHeader>
            <RuleForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRule}>Add Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Pricing Rule</DialogTitle>
            </DialogHeader>
            <RuleForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditRule}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}