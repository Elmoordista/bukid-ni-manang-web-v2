import { Routes, Route, Navigate } from "react-router-dom";
import GeneralSettings from "./settings/general";
import BookingSettings from "./settings/booking";
import NotificationSettings from "./settings/notifications";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

export default function Settings() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === `/admin/settings/${path}`;

  const settingsSections = [
    {
      path: "general",
      label: "General Settings",
      description: "Basic resort information and configuration",
    },
    {
      path: "booking",
      label: "Booking Settings",
      description: "Manage booking rules and restrictions",
    },
    {
      path: "notifications",
      label: "Notification Settings",
      description: "Configure emails and SMS notifications",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your resort settings and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="lg:w-64 p-6">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {settingsSections.map((section) => (
                <Button
                  key={section.path}
                  variant={isActive(section.path) ? "default" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={`/admin/settings/${section.path}`}>
                    <div className="text-left">
                      <div className="font-medium">{section.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {section.description}
                      </div>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <div className="flex-1">
          <Routes>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<GeneralSettings />} />
            <Route path="booking" element={<BookingSettings />} />
            <Route path="notifications" element={<NotificationSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}