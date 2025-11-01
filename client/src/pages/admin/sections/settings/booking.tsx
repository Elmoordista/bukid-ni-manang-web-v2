import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Clock, Calendar, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimePickerDemo } from "@/components/ui/time-picker-demo";

interface BookingSettings {
  allowBookings: boolean;
  maxBookingsPerDay: number;
  minAdvanceBookingDays: number;
  maxAdvanceBookingDays: number;
  checkInTime: string;
  checkOutTime: string;
  minStayDuration: number;
  maxStayDuration: number;
  allowInstantBooking: boolean;
  requireAdvancePayment: boolean;
  cancellationPolicyDays: number;
  allowGroupBookings: boolean;
  maxGuestsPerBooking: number;
  weekendRates: {
    enabled: boolean;
    multiplier: number;
  };
  seasonalRates: {
    enabled: boolean;
    peakSeasonMultiplier: number;
    peakSeasonStart: string;
    peakSeasonEnd: string;
  };
}

export default function BookingSettings() {
  const [settings, setSettings] = useState<BookingSettings>({
    allowBookings: true,
    maxBookingsPerDay: 10,
    minAdvanceBookingDays: 1,
    maxAdvanceBookingDays: 90,
    checkInTime: "14:00",
    checkOutTime: "12:00",
    minStayDuration: 1,
    maxStayDuration: 14,
    allowInstantBooking: true,
    requireAdvancePayment: true,
    cancellationPolicyDays: 3,
    allowGroupBookings: true,
    maxGuestsPerBooking: 10,
    weekendRates: {
      enabled: true,
      multiplier: 1.2,
    },
    seasonalRates: {
      enabled: true,
      peakSeasonMultiplier: 1.5,
      peakSeasonStart: "2023-12-15",
      peakSeasonEnd: "2024-01-15",
    },
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your booking settings have been successfully updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Booking Settings</h1>
        <p className="text-muted-foreground">
          Configure how guests can make reservations at your resort.
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Booking Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Booking Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Bookings</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable booking functionality
                </p>
              </div>
              <Switch
                checked={settings.allowBookings}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, allowBookings: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Instant Booking</Label>
                <p className="text-sm text-muted-foreground">
                  Allow guests to book without manual approval
                </p>
              </div>
              <Switch
                checked={settings.allowInstantBooking}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, allowInstantBooking: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Advance Payment Required</Label>
                <p className="text-sm text-muted-foreground">
                  Require payment during booking
                </p>
              </div>
              <Switch
                checked={settings.requireAdvancePayment}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, requireAdvancePayment: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Time Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Check-in/Check-out Times</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkInTime">Check-in Time</Label>
                <div className="flex">
                  <Clock className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
                  <Input
                    id="checkInTime"
                    type="time"
                    value={settings.checkInTime}
                    onChange={(e) =>
                      setSettings({ ...settings, checkInTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkOutTime">Check-out Time</Label>
                <div className="flex">
                  <Clock className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
                  <Input
                    id="checkOutTime"
                    type="time"
                    value={settings.checkOutTime}
                    onChange={(e) =>
                      setSettings({ ...settings, checkOutTime: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxBookingsPerDay">Maximum Bookings per Day</Label>
                <Input
                  id="maxBookingsPerDay"
                  type="number"
                  value={settings.maxBookingsPerDay}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxBookingsPerDay: parseInt(e.target.value),
                    })
                  }
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxGuestsPerBooking">Maximum Guests per Booking</Label>
                <div className="flex">
                  <Users className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
                  <Input
                    id="maxGuestsPerBooking"
                    type="number"
                    value={settings.maxGuestsPerBooking}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxGuestsPerBooking: parseInt(e.target.value),
                      })
                    }
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minStayDuration">Minimum Stay (nights)</Label>
                <Input
                  id="minStayDuration"
                  type="number"
                  value={settings.minStayDuration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      minStayDuration: parseInt(e.target.value),
                    })
                  }
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxStayDuration">Maximum Stay (nights)</Label>
                <Input
                  id="maxStayDuration"
                  type="number"
                  value={settings.maxStayDuration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxStayDuration: parseInt(e.target.value),
                    })
                  }
                  min="1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advance Booking */}
        <Card>
          <CardHeader>
            <CardTitle>Advance Booking Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minAdvanceBookingDays">
                  Minimum Advance Booking Days
                </Label>
                <div className="flex">
                  <Calendar className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
                  <Input
                    id="minAdvanceBookingDays"
                    type="number"
                    value={settings.minAdvanceBookingDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        minAdvanceBookingDays: parseInt(e.target.value),
                      })
                    }
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAdvanceBookingDays">
                  Maximum Advance Booking Days
                </Label>
                <div className="flex">
                  <Calendar className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
                  <Input
                    id="maxAdvanceBookingDays"
                    type="number"
                    value={settings.maxAdvanceBookingDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxAdvanceBookingDays: parseInt(e.target.value),
                      })
                    }
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancellationPolicyDays">
                Cancellation Policy (days before check-in)
              </Label>
              <Input
                id="cancellationPolicyDays"
                type="number"
                value={settings.cancellationPolicyDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    cancellationPolicyDays: parseInt(e.target.value),
                  })
                }
                min="0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Special Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Special Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekend Rates</Label>
                  <p className="text-sm text-muted-foreground">
                    Apply different rates for weekends
                  </p>
                </div>
                <Switch
                  checked={settings.weekendRates.enabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      weekendRates: {
                        ...settings.weekendRates,
                        enabled: checked,
                      },
                    })
                  }
                />
              </div>
              {settings.weekendRates.enabled && (
                <div className="space-y-2">
                  <Label htmlFor="weekendMultiplier">Weekend Rate Multiplier</Label>
                  <Input
                    id="weekendMultiplier"
                    type="number"
                    step="0.1"
                    value={settings.weekendRates.multiplier}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        weekendRates: {
                          ...settings.weekendRates,
                          multiplier: parseFloat(e.target.value),
                        },
                      })
                    }
                    min="1"
                  />
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Seasonal Rates</Label>
                  <p className="text-sm text-muted-foreground">
                    Apply different rates for peak season
                  </p>
                </div>
                <Switch
                  checked={settings.seasonalRates.enabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      seasonalRates: {
                        ...settings.seasonalRates,
                        enabled: checked,
                      },
                    })
                  }
                />
              </div>
              {settings.seasonalRates.enabled && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="peakSeasonMultiplier">
                      Peak Season Rate Multiplier
                    </Label>
                    <Input
                      id="peakSeasonMultiplier"
                      type="number"
                      step="0.1"
                      value={settings.seasonalRates.peakSeasonMultiplier}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          seasonalRates: {
                            ...settings.seasonalRates,
                            peakSeasonMultiplier: parseFloat(e.target.value),
                          },
                        })
                      }
                      min="1"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="peakSeasonStart">Peak Season Start</Label>
                      <Input
                        id="peakSeasonStart"
                        type="date"
                        value={settings.seasonalRates.peakSeasonStart}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            seasonalRates: {
                              ...settings.seasonalRates,
                              peakSeasonStart: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="peakSeasonEnd">Peak Season End</Label>
                      <Input
                        id="peakSeasonEnd"
                        type="date"
                        value={settings.seasonalRates.peakSeasonEnd}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            seasonalRates: {
                              ...settings.seasonalRates,
                              peakSeasonEnd: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}