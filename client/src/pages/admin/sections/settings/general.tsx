import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Globe, Mail, Phone, Map, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import HttpClient from "@/lib/axiosInstance.ts";
import Notiflix from "notiflix";

interface GeneralSettings {
  basic_information: {
    siteName: string;
    tagline: string;
    description: string;
  };
  contact_information: {
    contactEmail: string;
    phoneNumber: string;
    address: string;
    location: {
      latitude: string;
      longitude: string;
    };
  };
  business_hours: {
    timezone: string;
    openingHours: string;
  };
  social_media: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  site_options: {
    maintenanceMode: boolean;
    showPrices: boolean;
  };
}

export default function GeneralSettings() {
  const {toast} = useToast();
  const [settings, setSettings] = useState<GeneralSettings>({
    basic_information: {
      siteName: "Bukid ni Manang",
      tagline: "Your perfect getaway destination",
      description: "Experience tranquility and luxury in our mountain resort.",
    },
    contact_information: {
      contactEmail: "contact@bukidnimanang.com",
      phoneNumber: "+63 XXX XXX XXXX",
      address: "Sample Address, City, Province",
      location: {
        latitude: "0",
        longitude: "0",
      },
    },
    business_hours: {
      timezone: "Asia/Manila",
      openingHours: "24/7",
    },
    social_media: {
      facebook: "https://facebook.com/bukidnimanang",
      instagram: "https://instagram.com/bukidnimanang",
      twitter: "https://twitter.com/bukidnimanang",
    },
    site_options: {
      maintenanceMode: false,
      showPrices: true,
    },
  });

  useEffect(() => {
      fetchSettings();
  }, []);

  const fetchSettings = async () =>{
    Notiflix.Loading.circle('Loading settings...');
    try {
      // Replace with actual API call
      const response = await HttpClient.get('/settings?type=general');
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

  const handleSave = async() => {
    Notiflix.Loading.circle('Saving settings...');
    try {
      // Replace with actual API call
      await HttpClient.post('/settings', {
        settings: settings,
        type: 'general',
      });
      toast({
        title: "Settings Saved",
        description: "Your general settings have been updated successfully.",
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">General Settings</h1>
        <p className="text-muted-foreground">
          Configure basic information about your resort.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Resort Name</Label>
            <Input
              value={settings.basic_information.siteName}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  basic_information: {
                    ...settings.basic_information,
                    siteName: e.target.value,
                  },
                })
              }
            />
            <Label>Tagline</Label>
            <Input
              value={settings.basic_information.tagline}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  basic_information: {
                    ...settings.basic_information,
                    tagline: e.target.value,
                  },
                })
              }
            />
            <Label>Description</Label>
            <Textarea
              value={settings.basic_information.description}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  basic_information: {
                    ...settings.basic_information,
                    description: e.target.value,
                  },
                })
              }
            />
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Email Address</Label>
            <Input
              type="email"
              value={settings.contact_information.contactEmail}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contact_information: {
                    ...settings.contact_information,
                    contactEmail: e.target.value,
                  },
                })
              }
            />

            <Label>Phone Number</Label>
            <Input
              value={settings.contact_information.phoneNumber}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contact_information: {
                    ...settings.contact_information,
                    phoneNumber: e.target.value,
                  },
                })
              }
            />

            <Label>Address</Label>
            <Input
              value={settings.contact_information.address}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contact_information: {
                    ...settings.contact_information,
                    address: e.target.value,
                  },
                })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Latitude</Label>
                <Input
                  value={settings.contact_information.location.latitude}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact_information: {
                        ...settings.contact_information,
                        location: {
                          ...settings.contact_information.location,
                          latitude: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input
                  value={settings.contact_information.location.longitude}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact_information: {
                        ...settings.contact_information,
                        location: {
                          ...settings.contact_information.location,
                          longitude: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Timezone</Label>
              <Input
                value={settings.business_hours.timezone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    business_hours: {
                      ...settings.business_hours,
                      timezone: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label>Opening Hours</Label>
              <Input
                value={settings.business_hours.openingHours}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    business_hours: {
                      ...settings.business_hours,
                      openingHours: e.target.value,
                    },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.social_media).map(([platform, value]) => (
              <div key={platform} className="space-y-2">
                <Label className="capitalize">{platform}</Label>
                <Input
                  value={value}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social_media: {
                        ...settings.social_media,
                        [platform]: e.target.value,
                      },
                    })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Site Options */}
        <Card>
          <CardHeader>
            <CardTitle>Site Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable maintenance mode for visitors
                </p>
              </div>
              <Switch
                checked={settings.site_options.maintenanceMode}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    site_options: {
                      ...settings.site_options,
                      maintenanceMode: checked,
                    },
                  })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Prices</Label>
                <p className="text-sm text-muted-foreground">
                  Display room prices publicly
                </p>
              </div>
              <Switch
                checked={settings.site_options.showPrices}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    site_options: {
                      ...settings.site_options,
                      showPrices: checked,
                    },
                  })
                }
              />
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
