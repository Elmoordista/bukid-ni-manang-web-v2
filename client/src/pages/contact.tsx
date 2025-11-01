import { useState } from "react";
// Navigation provided by RootLayout
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { RESORT_INFO } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

import GoogleMaps from "@/components/google-maps";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    roomType: "Farm Cottage",
    checkIn: "",
    checkOut: "",
    guests: "1 Guest",
    message: "",
  });

  const handleSubmitInquiry = async (data: typeof contactForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Submitting contact inquiry:', data);
      toast({
        title: "Inquiry Sent!",
        description: "We'll contact you within 24 hours to discuss your reservation.",
      });
      setContactForm({
        fullName: "",
        email: "",
        phone: "",
        roomType: "Farm Cottage",
        checkIn: "",
        checkOut: "",
        guests: "1 Guest",
        message: "",
      });
      
    } catch (error) {
      toast({
        title: "Failed to Send Inquiry",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.fullName || !contactForm.email || !contactForm.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    handleSubmitInquiry(contactForm);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready to experience the magic of Bukid ni Manang? Contact us to plan your perfect farm resort getaway.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-foreground">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Location</h3>
                    <p className="text-muted-foreground" data-testid="text-contact-location">
                      {RESORT_INFO.location}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    <p className="text-muted-foreground" data-testid="text-contact-phone">
                      {RESORT_INFO.phone}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground" data-testid="text-contact-email">
                      {RESORT_INFO.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Operating Hours</h3>
                    <p className="text-muted-foreground" data-testid="text-contact-hours">
                      {RESORT_INFO.hours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Twitter className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Interactive Google Maps */}
              <div className="mt-8">
                <h3 className="font-semibold text-foreground mb-4">Find Us</h3>
                <GoogleMaps className="" />
              </div>
            </div>
            
            {/* Contact Form */}
            <Card className="shadow-lg border border-border">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 text-card-foreground">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-full-name">Full Name *</Label>
                      <Input
                        id="contact-full-name"
                        value={contactForm.fullName}
                        onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                        placeholder="Enter your name"
                        required
                        data-testid="input-form-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-form-email">Email *</Label>
                      <Input
                        id="contact-form-email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                        data-testid="input-form-email"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-form-phone">Phone *</Label>
                      <Input
                        id="contact-form-phone"
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+63 917 123 4567"
                        required
                        data-testid="input-form-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Room</Label>
                      <Select
                        value={contactForm.roomType}
                        onValueChange={(value) => setContactForm({ ...contactForm, roomType: value })}
                      >
                        <SelectTrigger data-testid="select-form-room">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Farm Cottage">Farm Cottage</SelectItem>
                          <SelectItem value="Family Villa">Family Villa</SelectItem>
                          <SelectItem value="Bahay Kubo Suite">Bahay Kubo Suite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-form-check-in">Check-in Date</Label>
                      <Input
                        id="contact-form-check-in"
                        type="date"
                        value={contactForm.checkIn}
                        onChange={(e) => setContactForm({ ...contactForm, checkIn: e.target.value })}
                        data-testid="input-form-check-in"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-form-check-out">Check-out Date</Label>
                      <Input
                        id="contact-form-check-out"
                        type="date"
                        value={contactForm.checkOut}
                        onChange={(e) => setContactForm({ ...contactForm, checkOut: e.target.value })}
                        data-testid="input-form-check-out"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Guests</Label>
                      <Select
                        value={contactForm.guests}
                        onValueChange={(value) => setContactForm({ ...contactForm, guests: value })}
                      >
                        <SelectTrigger data-testid="select-form-guests">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1 Guest">1 Guest</SelectItem>
                          <SelectItem value="2 Guests">2 Guests</SelectItem>
                          <SelectItem value="3 Guests">3 Guests</SelectItem>
                          <SelectItem value="4 Guests">4 Guests</SelectItem>
                          <SelectItem value="5+ Guests">5+ Guests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-form-message">Message</Label>
                    <Textarea
                      id="contact-form-message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={4}
                      placeholder="Tell us about your ideal stay, any special requirements, or questions you have..."
                      data-testid="textarea-form-message"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-medium"
                    disabled={isSubmitting}
                    data-testid="button-form-submit"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
