import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Mail} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
// import Notiflix from "notiflix";
import HttpClient from "@/lib/axiosInstance.ts";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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
    newBooking: NotificationEvent;
    bookingConfirmation: NotificationEvent;
    bookingCancellation: NotificationEvent;
    bookingCheckOut: NotificationEvent;
    paymentReceived: NotificationEvent;
    checkInReminder: NotificationEvent & { daysBeforeCheckIn: number };
  };
}

interface NotificationEvent {
  enabled: boolean;
  sendEmail: boolean;
  sendSms: boolean;
  emailTemplate: string;
  smsTemplate: string;
}

export default function NotificationSettings() {
   const { toast } = useToast();
   const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
   const [testEmail, setTestEmail] = useState("");
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
      bookingCheckOut: {
        enabled: true,
        sendEmail: true,
        sendSms: true,
        emailTemplate: "Dear {guest_name}, your booking has been checked out...",
        smsTemplate: "Your booking has been checked out",
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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () =>{
    // Loading indicator handled by UI state
    try {
      // Replace with actual API call
      const response = await HttpClient.get('/settings?type=notifications');
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
      // Notiflix.Loading.remove();
    }
  }
  const handleSave = async () =>{
    toast({ title: 'Saving settings...' });
    try {
      // Replace with actual API call
      await HttpClient.post('/settings', {
        settings: settings,
        type: 'notifications',
      });
      toast({
        title: "Settings Saved",
        description: "Your notification settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Notiflix.Loading.remove();
    }
  }
    

  const handleSendTestEmail = async() =>{
     toast({ title: 'Sending test email...' });
      try {
        await HttpClient.post('/settings/test-email', {
          toEmail: testEmail,
          settings: settings.email,
        });
        toast({
          title: "Test Email Sent",
          description: `A test email has been sent to ${testEmail}.`,
        });
        setIsEmailModalOpen(false);
      } catch (error : any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "There was an error sending the test email. Please try again.",
          variant: "destructive",
        });
      } finally {
        toast({ title: 'Test email sent successfully!', variant: 'default' });
      }
  }

  const handleCheckConfig = () =>{
   //check if host, port, username, password are filled
   if(
     !settings.email.smtpHost ||
      !settings.email.smtpPort ||
      !settings.email.smtpUsername ||
      !settings.email.smtpPassword
   ){
      return false;
   }
   return true;
  }
  const handleTestEmail = () => {
    if(!handleCheckConfig()){
      toast({
        title: "Incomplete SMTP Configuration",
        description: "Please fill in all SMTP settings before sending a test email.",
        variant: "destructive",
      });
      return;
    }
    setIsEmailModalOpen(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Notification Settings
        </h1>
        <p className="text-muted-foreground">
          Configure how and when notifications are sent to admins and guests.
        </p>
      </div>

      
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogTrigger asChild>
          <Button>
            <Mail className="w-4 h-4 mr-2" />
            Send Test Email
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Label htmlFor="testEmail">Recipient Email</Label>
            <Input
              id="testEmail"
              placeholder="Enter test recipient email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setIsEmailModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendTestEmail}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6">
        {/* 📨 EMAIL CONFIGURATION */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Email Configuration</CardTitle>
              <Switch
                checked={settings.email.enabled}
                onCheckedChange={(checked: boolean) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, enabled: checked },
                  })
                }
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup
                label="From Name"
                id="fromName"
                value={settings.email.fromName}
                onChange={(val) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, fromName: val },
                  })
                }
              />
              <InputGroup
                label="From Email"
                id="fromEmail"
                type="email"
                value={settings.email.fromEmail}
                onChange={(val) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, fromEmail: val },
                  })
                }
              />
            </div>

            {/* SMTP Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup
                label="SMTP Host"
                id="smtpHost"
                value={settings.email.smtpHost}
                onChange={(val) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, smtpHost: val },
                  })
                }
              />
              <InputGroup
                label="SMTP Port"
                id="smtpPort"
                type="number"
                value={settings.email.smtpPort.toString()}
                onChange={(val) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, smtpPort: parseInt(val) },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup
                label="SMTP Username"
                id="smtpUsername"
                value={settings.email.smtpUsername}
                onChange={(val) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, smtpUsername: val },
                  })
                }
              />
              <InputGroup
                label="SMTP Password"
                id="smtpPassword"
                type="password"
                value={settings.email.smtpPassword}
                onChange={(val) =>
                  setSettings({
                    ...settings,
                    email: { ...settings.email, smtpPassword: val },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Use SSL</Label>
              <Switch
                checked={settings.email.useSsl}
                onCheckedChange={(checked: boolean) =>
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

        {/* 📱 SMS CONFIGURATION */}
        {/* <Card>
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
            <InputGroup
              label="Provider"
              id="provider"
              value={settings.sms.provider}
              onChange={(val) =>
                setSettings({
                  ...settings,
                  sms: { ...settings.sms, provider: val },
                })
              }
            />
            <InputGroup
              label="API Key"
              id="apiKey"
              value={settings.sms.apiKey}
              onChange={(val) =>
                setSettings({
                  ...settings,
                  sms: { ...settings.sms, apiKey: val },
                })
              }
            />
            <InputGroup
              label="From Number"
              id="fromNumber"
              value={settings.sms.fromNumber}
              onChange={(val) =>
                setSettings({
                  ...settings,
                  sms: { ...settings.sms, fromNumber: val },
                })
              }
            />

            <Button onClick={handleTestSms}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Test SMS
            </Button>
          </CardContent>
        </Card> */}

        {/* 🔔 NOTIFICATION EVENTS */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(settings.notifications).map(([key, notification]) => (
              <div key={key} className="space-y-4">
                <NotificationEventCard
                  label={key}
                  data={notification}
                  onChange={(updated) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        [key]: updated,
                      },
                    })
                  }
                />
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

/* 🔧 Reusable small components for clarity */
function InputGroup({
  label,
  id,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  id: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function NotificationEventCard({
  label,
  data,
  onChange,
}: {
  label: string;
  data: any;
  onChange: (updated: any) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label className="text-base">
          {label.replace(/([A-Z])/g, " $1").trim()}
        </Label>
        <Switch
          checked={data.enabled}
          onCheckedChange={(checked: boolean) => onChange({ ...data, enabled: checked })}
        />
      </div>

      {data.enabled && (
        <div className="space-y-4 mt-3">
          <Switch
            checked={data.sendEmail}
            onCheckedChange={(checked: boolean) => onChange({ ...data, sendEmail: checked })}
          />
          {data.sendEmail && (
            <Textarea
              rows={3}
              value={data.emailTemplate}
              onChange={(e) => onChange({ ...data, emailTemplate: e.target.value })}
            />
          )}

          {"daysBeforeCheckIn" in data && (
            <InputGroup
              label="Days Before Check-in"
              id={`${label}-days`}
              type="number"
              value={data.daysBeforeCheckIn.toString()}
              onChange={(val) =>
                onChange({ ...data, daysBeforeCheckIn: parseInt(val) })
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
