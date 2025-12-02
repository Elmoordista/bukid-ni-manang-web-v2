import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Mail, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface NotificationSettings {
  email: {
    enabled: boolean;
    fromName: string;
    fromEmail: string;
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    useSsl: boolean;
  };
  sms: {
    enabled: boolean;
    provider: string;
    apiKey: string;
    fromNumber: string;
  };
  notifications: {
    newBooking: {
      enabled: boolean;
      sendEmail: boolean;
      sendSms: boolean;
      emailTemplate: string;
      smsTemplate: string;
    };
    bookingConfirmation: {
      enabled: boolean;
      sendEmail: boolean;
      sendSms: boolean;
      emailTemplate: string;
      smsTemplate: string;
    };
    bookingCancellation: {
      enabled: boolean;
      sendEmail: boolean;
      sendSms: boolean;
      emailTemplate: string;
      smsTemplate: string;
    };
    paymentReceived: {
      enabled: boolean;
      sendEmail: boolean;
      sendSms: boolean;
      emailTemplate: string;
      smsTemplate: string;
    };
    checkInReminder: {
      enabled: boolean;
      sendEmail: boolean;
      sendSms: boolean;
      emailTemplate: string;
      smsTemplate: string;
      daysBeforeCheckIn: number;
    };
  };
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      fromName: "Bukid ni Manang",
      fromEmail: "notifications@bukidnimanang.com",
      smtpHost: "smtp.example.com",
      smtpPort: 587,
      smtpUsername: "",
      smtpPassword: "",
      useSsl: true,
    },
    sms: {
      enabled: true,
      provider: "twilio",
      apiKey: "",
      fromNumber: "+1234567890",
    },
    notifications: {
      newBooking: {
        enabled: true,
        sendEmail: true,
        sendSms: true,
        emailTemplate: "Dear admin, a new booking has been received...",
        smsTemplate: "New booking received from {guest_name}",
      },
      bookingConfirmation: {
        enabled: true,
        sendEmail: true,
        sendSms: true,
        emailTemplate: "Dear {guest_name}, your booking has been confirmed...",
        smsTemplate: "Your booking at Bukid ni Manang is confirmed",
      },
      bookingCancellation: {
        enabled: true,
        sendEmail: true,
        sendSms: true,
        emailTemplate: "Dear {guest_name}, your booking has been cancelled...",
        smsTemplate: "Your booking has been cancelled",
      },
      paymentReceived: {
        enabled: true,
        sendEmail: true,
        sendSms: true,
        emailTemplate: "Dear {guest_name}, we received your payment...",
        smsTemplate: "Payment received for your booking",
      },
      checkInReminder: {
        enabled: true,
        sendEmail: true,
        sendSms: true,
        emailTemplate: "Dear {guest_name}, your check-in is approaching...",
        smsTemplate: "Reminder: Your check-in is in {days} days",
        daysBeforeCheckIn: 2,
      },
    },
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your notification settings have been successfully updated.",
    });
  };

  const handleTestEmail = () => {
    toast({
      title: "Test email sent",
      description: "A test email has been sent to the configured address.",
    });
  };

  const handleTestSms = () => {
    toast({
      title: "Test SMS sent",
      description: "A test SMS has been sent to the configured number.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notification Settings</h1>
        <p className="text-muted-foreground">
          Configure how and when notifications are sent to admins and guests.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Email Configuration */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Email Configuration</CardTitle>
              <Switch
                checked={settings.email.enabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, enabled: checked },
                  })
                }
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  value={settings.email.fromName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, fromName: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={settings.email.fromEmail}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, fromEmail: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={settings.email.smtpHost}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, smtpHost: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={settings.email.smtpPort}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, smtpPort: parseInt(e.target.value) },
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpUsername">SMTP Username</Label>
                <Input
                  id="smtpUsername"
                  value={settings.email.smtpUsername}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, smtpUsername: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={settings.email.smtpPassword}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, smtpPassword: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Use SSL</Label>
                <p className="text-sm text-muted-foreground">
                  Enable SSL/TLS for secure email transmission
                </p>
              </div>
              <Switch
                checked={settings.email.useSsl}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, useSsl: checked },
                  })
                }
              />
            </div>

            <Button onClick={handleTestEmail}>
              <Mail className="w-4 h-4 mr-2" />
              Send Test Email
            </Button>
          </CardContent>
        </Card>

        {/* SMS Configuration */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>SMS Configuration</CardTitle>
              <Switch
                checked={settings.sms.enabled}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    sms: { ...settings.sms, enabled: checked },
                  })
                }
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smsProvider">SMS Provider</Label>
                <Input
                  id="smsProvider"
                  value={settings.sms.provider}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sms: { ...settings.sms, provider: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smsApiKey">API Key</Label>
                <Input
                  id="smsApiKey"
                  type="password"
                  value={settings.sms.apiKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sms: { ...settings.sms, apiKey: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromNumber">From Number</Label>
              <Input
                id="fromNumber"
                value={settings.sms.fromNumber}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    sms: { ...settings.sms, fromNumber: e.target.value },
                  })
                }
              />
            </div>

            <Button onClick={handleTestSms}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Test SMS
            </Button>
          </CardContent>
        </Card>

        {/* Notification Events */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(settings.notifications).map(([key, notification]) => (
              <div key={key} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                    <p className="text-sm text-muted-foreground">
                      Configure notifications for {key.toLowerCase()}
                    </p>
                  </div>
                  <Switch
                    checked={notification.enabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          [key]: { ...notification, enabled: checked },
                        },
                      })
                    }
                  />
                </div>

                {notification.enabled && (
                  <>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={notification.sendEmail}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                [key]: { ...notification, sendEmail: checked },
                              },
                            })
                          }
                        />
                        <Label>Send Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={notification.sendSms}
                          onCheckedChange={(checked) =>
                            setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                [key]: { ...notification, sendSms: checked },
                              },
                            })
                          }
                        />
                        <Label>Send SMS</Label>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {notification.sendEmail && (
                        <div className="space-y-2">
                          <Label>Email Template</Label>
                          <Textarea
                            value={notification.emailTemplate}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                notifications: {
                                  ...settings.notifications,
                                  [key]: {
                                    ...notification,
                                    emailTemplate: e.target.value,
                                  },
                                },
                              })
                            }
                            rows={3}
                          />
                        </div>
                      )}

                      {notification.sendSms && (
                        <div className="space-y-2">
                          <Label>SMS Template</Label>
                          <Input
                            value={notification.smsTemplate}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                notifications: {
                                  ...settings.notifications,
                                  [key]: {
                                    ...notification,
                                    smsTemplate: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      )}

                      {'daysBeforeCheckIn' in notification && (
                        <div className="space-y-2">
                          <Label>Days Before Check-in</Label>
                          <Input
                            type="number"
                            value={notification.daysBeforeCheckIn}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                notifications: {
                                  ...settings.notifications,
                                  [key]: {
                                    ...notification,
                                    daysBeforeCheckIn: parseInt(e.target.value),
                                  },
                                },
                              })
                            }
                            min="1"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Separator />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}