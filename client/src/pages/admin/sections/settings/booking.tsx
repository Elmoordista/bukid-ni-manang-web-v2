import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Clock} from "lucide-react";
import Notiflix from "notiflix";
import HttpClient from "@/lib/axiosInstance.ts";


interface BookingSettings {
  general: {
    allowBookings: boolean;
    allowInstantBooking: boolean;
    requireAdvancePayment: boolean;
  };
  time_settings: {
    checkInTime: string;
    checkOutTime: string;
  };
  booking_limits: {
    maxBookingsPerDay: number;
    minStayDuration: number;
    maxStayDuration: number;
    allowGroupBookings: boolean;
    maxGuestsPerBooking: number;
  };
  advance_booking: {
    minAdvanceBookingDays: number;
    maxAdvanceBookingDays: number;
    cancellationPolicyDays: number;
  };
  special_rates: {
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
  };
}

export default function BookingSettings() {
  const [settings, setSettings] = useState<BookingSettings>({
    general: {
      allowBookings: true,
      allowInstantBooking: true,
      requireAdvancePayment: true,
    },
    time_settings: {
      checkInTime: "14:00",
      checkOutTime: "12:00",
    },
    booking_limits: {
      maxBookingsPerDay: 10,
      minStayDuration: 1,
      maxStayDuration: 14,
      allowGroupBookings: true,
      maxGuestsPerBooking: 10,
    },
    advance_booking: {
      minAdvanceBookingDays: 1,
      maxAdvanceBookingDays: 90,
      cancellationPolicyDays: 3,
    },
    special_rates: {
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
    },
  });

  useEffect(() => {
      fetchSettings();
  }, []);

  const fetchSettings = async () =>{
    Notiflix.Loading.circle('Loading settings...');
    try {
      // Replace with actual API call
      const response = await HttpClient.get('/settings?type=booking');
      if(response.data?.data){
        const fetchedSettings = response.data.data;
        const setting = fetchedSettings? JSON.parse(fetchedSettings.settings) : null;
        if(setting){
          setSettings(setting);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      Notiflix.Loading.remove();
    }
  }

  const handleSave = async () => {
    Notiflix.Loading.circle('Saving settings...');
    try {
      // Replace with actual API call
      await HttpClient.post('/settings', {
        settings: settings,
        type: 'booking',
      });
      toast({
        title: "Settings Saved",
        description: "Your booking settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      Notiflix.Loading.remove();
    }
  };

  const handleGetValue = (obj: any, key: string) => {
    return obj[key as keyof typeof obj];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Booking Settings</h1>
        <p className="text-muted-foreground">
          Configure how guests can make reservations at your resort.
        </p>
      </div>

      <div className="grid gap-6">
        {/* 🏠 General Booking Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Booking Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: "allowBookings",
                label: "Allow Bookings",
                desc: "Enable or disable booking functionality",
              },
              {
                key: "allowInstantBooking",
                label: "Instant Booking",
                desc: "Allow guests to book without manual approval",
              },
              {
                key: "requireAdvancePayment",
                label: "Advance Payment Required",
                desc: "Require payment during booking",
              },
            ].map(({ key, label, desc }) => (
              <div key={key}>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{label}</Label>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={settings.general[key as keyof typeof settings.general]}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        general: {
                          ...settings.general,
                          [key]: checked,
                        },
                      })
                    }
                  />
                </div>
                <Separator className="my-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ⏰ Time Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Check-in/Check-out Times</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["checkInTime", "checkOutTime"].map((key) => (
              <div className="space-y-2" key={key}>
                <Label>
                  {key === "checkInTime" ? "Check-in Time" : "Check-out Time"}
                </Label>
                <div className="flex">
                  <Clock className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
                  <Input
                    type="time"
                    value={settings.time_settings[key as keyof typeof settings.time_settings]}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        time_settings: {
                          ...settings.time_settings,
                          [key]: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 📊 Booking Limits */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Limits</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["maxBookingsPerDay", "Maximum Bookings per Day"],
              ["minStayDuration", "Minimum Stay (nights)"],
              ["maxStayDuration", "Maximum Stay (nights)"],
              ["maxGuestsPerBooking", "Maximum Guests per Booking"],
            ].map(([key, label]) => (
              <div className="space-y-2" key={key}>
                <Label>{label}</Label>
                <Input
                  type="number"
                  value={handleGetValue(settings.booking_limits, key)}
                  // value={settings.booking_limits[key as keyof typeof settings.booking_limits]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      booking_limits: {
                        ...settings.booking_limits,
                        [key]: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 📅 Advance Booking Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Advance Booking Rules</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["minAdvanceBookingDays", "Minimum Advance Booking Days"],
              ["maxAdvanceBookingDays", "Maximum Advance Booking Days"],
              ["cancellationPolicyDays", "Cancellation Policy (days before check-in)"],
            ].map(([key, label]) => (
              <div className="space-y-2" key={key}>
                <Label>{label}</Label>
                <Input
                  type="number"
                  value={settings.advance_booking[key as keyof typeof settings.advance_booking]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      advance_booking: {
                        ...settings.advance_booking,
                        [key]: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 💰 Special Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Special Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Weekend Rates */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekend Rates</Label>
                <p className="text-sm text-muted-foreground">
                  Apply different rates for weekends
                </p>
              </div>
              <Switch
                checked={settings.special_rates.weekendRates.enabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    special_rates: {
                      ...settings.special_rates,
                      weekendRates: {
                        ...settings.special_rates.weekendRates,
                        enabled: checked,
                      },
                    },
                  })
                }
              />
            </div>

            {settings.special_rates.weekendRates.enabled && (
              <div className="space-y-2">
                <Label>Weekend Rate Multiplier</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="1"
                  value={settings.special_rates.weekendRates.multiplier}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      special_rates: {
                        ...settings.special_rates,
                        weekendRates: {
                          ...settings.special_rates.weekendRates,
                          multiplier: parseFloat(e.target.value),
                        },
                      },
                    })
                  }
                />
              </div>
            )}

            <Separator />

            {/* Seasonal Rates */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Seasonal Rates</Label>
                <p className="text-sm text-muted-foreground">
                  Apply different rates for peak season
                </p>
              </div>
              <Switch
                checked={settings.special_rates.seasonalRates.enabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    special_rates: {
                      ...settings.special_rates,
                      seasonalRates: {
                        ...settings.special_rates.seasonalRates,
                        enabled: checked,
                      },
                    },
                  })
                }
              />
            </div>

            {settings.special_rates.seasonalRates.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Peak Season Rate Multiplier</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    value={settings.special_rates.seasonalRates.peakSeasonMultiplier}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        special_rates: {
                          ...settings.special_rates,
                          seasonalRates: {
                            ...settings.special_rates.seasonalRates,
                            peakSeasonMultiplier: parseFloat(e.target.value),
                          },
                        },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Peak Season Start</Label>
                  <Input
                    type="date"
                    value={settings.special_rates.seasonalRates.peakSeasonStart}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        special_rates: {
                          ...settings.special_rates,
                          seasonalRates: {
                            ...settings.special_rates.seasonalRates,
                            peakSeasonStart: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Peak Season End</Label>
                  <Input
                    type="date"
                    value={settings.special_rates.seasonalRates.peakSeasonEnd}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        special_rates: {
                          ...settings.special_rates,
                          seasonalRates: {
                            ...settings.special_rates.seasonalRates,
                            peakSeasonEnd: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
