import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Settings, Building2, CalendarClock, Bell } from "lucide-react";

export default function SettingsLayout() {
  const location = useLocation();
  const isActive = (path: string) => {
    const currentPath = location.pathname.split('/').pop();
    return currentPath === path || (path === 'general' && currentPath === 'settings');
  };

  const settingsSections = [
    {
      path: "general",
      label: "General Settings",
      description: "Basic resort information and configuration",
      icon: Settings
    },
    {
      path: "venue",
      label: "Venue Settings",
      description: "Configure venue details and policies",
      icon: Building2
    },
    {
      path: "booking",
      label: "Booking Settings",
      description: "Manage booking rules and restrictions",
      icon: CalendarClock
    },
    {
      path: "notifications",
      label: "Notification Settings",
      description: "Configure emails and SMS notifications",
      icon: Bell
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
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <Button
                    key={section.path}
                    variant={isActive(section.path) ? "default" : "ghost"}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to={section.path}>
                      <div className="flex items-center">
                        <Icon className="mr-2 h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">{section.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {section.description}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </Card>

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}