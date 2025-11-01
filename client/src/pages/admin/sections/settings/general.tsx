import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Globe, Mail, Phone, Map, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface GeneralSettings {
  siteName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  location: {
    latitude: string;
    longitude: string;
  };
  timezone: string;
  openingHours: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  maintenanceMode: boolean;
  showPrices: boolean;
}

export default function GeneralSettings() {
  const [settings, setSettings] = useState<GeneralSettings>({
    siteName: "Bukid ni Manang",
    tagline: "Your perfect getaway destination",
    description: "Experience tranquility and luxury in our mountain resort.",
    contactEmail: "contact@bukidnimanang.com",
    phoneNumber: "+63 XXX XXX XXXX",
    address: "Sample Address, City, Province",
    location: {
      latitude: "0",
      longitude: "0",
    },
    timezone: "Asia/Manila",
    openingHours: "24/7",
    socialMedia: {
      facebook: "https://facebook.com/bukidnimanang",
      instagram: "https://instagram.com/bukidnimanang",
      twitter: "https://twitter.com/bukidnimanang",
    },
    maintenanceMode: false,
    showPrices: true,
  });

  const handleSave = () => {
    // TODO: Implement API call to save settings
    toast({
      title: "Settings saved",
      description: "Your general settings have been successfully updated.",
    });
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
            <div className="space-y-2">
              <Label htmlFor="siteName">Resort Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={settings.tagline}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) =>
                  setSettings({ ...settings, description: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email Address</Label>
                <div className="flex">
                  <Mail className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, contactEmail: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="flex">
                  <Phone className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    value={settings.phoneNumber}
                    onChange={(e) =>
                      setSettings({ ...settings, phoneNumber: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="flex">
                <Map className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  value={settings.location.latitude}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      location: { ...settings.location, latitude: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  value={settings.location.longitude}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      location: { ...settings.location, longitude: e.target.value },
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <div className="flex">
                  <Globe className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
                  <Input
                    id="timezone"
                    value={settings.timezone}
                    onChange={(e) =>
                      setSettings({ ...settings, timezone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="openingHours">Opening Hours</Label>
                <div className="flex">
                  <Clock className="w-4 h-4 mr-2 mt-2.5 text-muted-foreground" />
                  <Input
                    id="openingHours"
                    value={settings.openingHours}
                    onChange={(e) =>
                      setSettings({ ...settings, openingHours: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={settings.socialMedia.facebook}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: {
                      ...settings.socialMedia,
                      facebook: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={settings.socialMedia.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: {
                      ...settings.socialMedia,
                      instagram: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={settings.socialMedia.twitter}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: {
                      ...settings.socialMedia,
                      twitter: e.target.value,
                    },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Site Options */}
        <Card>
          <CardHeader>
            <CardTitle>Site Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable this to show a maintenance page to visitors
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, maintenanceMode: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Prices</Label>
                <p className="text-sm text-muted-foreground">
                  Display room prices on the website
                </p>
              </div>
              <Switch
                checked={settings.showPrices}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, showPrices: checked })
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