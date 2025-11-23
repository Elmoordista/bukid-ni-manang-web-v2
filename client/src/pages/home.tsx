import { CheckCircle, Star, Waves, Utensils, Flower, Heart, Mountain, Sparkles, Flame, Car, Target, MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Play } from "lucide-react";
const mainTourImage = "/images/IMG_9191_1756782230937.jpeg";
const poolImage = "/images/IMG_9196_1756782230937.jpeg";
const restaurantImage = "/images/IMG_9193_1756782230937.jpeg";
const gardenImage = "/images/IMG_9195_1756782230937.jpeg";
const amenityImage = "/images/IMG_9194_1756782230937.jpeg";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroSection from "@/components/hero-section";
import VirtualTourModal from "@/components/virtual-tour-modal";
import { RESORT_INFO, AMENITIES, TESTIMONIALS } from "@/lib/constants";
import GoogleMaps from "@/components/google-maps";

export default function Home() {
  const [virtualTourOpen, setVirtualTourOpen] = useState(false);



  const iconMap = {
    waves: Waves,
    utensils: Utensils,
    flower: Flower,
    heart: Heart,
    mountain: Mountain,
    star: Sparkles,
    flame: Flame,
    car: Car,
    target: Target,
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      {/* About Section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="about-section">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                Welcome to Bukid ni Manang Farm & Resort
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Located just 15 minutes from Calbayog City Proper in Brgy. Guinbaoyan Norte, we offer the perfect venue 
                for family and community gatherings. Experience serene nature, breathtaking amenities, and authentic 
                Filipino hospitality all in one place.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Picturesque Water Park</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Dragon Fruit Plantation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Modern Hotel Rooms</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Lutong Bahay Restaurant</span>
                </div>
              </div>
              {/* <Button 
                onClick={() => setVirtualTourOpen(true)}
                data-testid="button-open-virtual-tour"
              >
                Take Virtual Tour
              </Button> */}
            </div>
            
            <div className="relative">
              <img 
                src={mainTourImage} 
                alt="Bukid ni Manang Farm & Resort grounds" 
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="img-resort-gardens"
              />
              <div className="absolute -bottom-6 -right-6 bg-card rounded-xl p-4 shadow-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold text-foreground">4.8</span>
                  <span className="text-muted-foreground text-sm">(124 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Tour Section */}
      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 -skew-y-6 transform origin-top-right"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 about-section">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4 inline-block">
                Interactive Experience
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Step Inside Our Paradise
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Immerse yourself in a stunning 360° journey through our resort. Explore every corner before you visit!
            </p>
          </div>
          
          <div className="bg-card rounded-2xl overflow-hidden shadow-2xl border border-border transform hover:scale-[1.02] transition-all duration-300">
            <div className="relative aspect-video bg-muted group cursor-pointer" onClick={() => setVirtualTourOpen(true)}>
              <img 
                src={mainTourImage} 
                alt="Resort main courtyard panoramic view" 
                className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                data-testid="img-tour-preview"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex items-center justify-center">
                <div className="text-center text-white transform group-hover:-translate-y-2 transition-all duration-300">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="bg-primary/80 backdrop-blur-sm rounded-full p-8 hover:bg-primary/90 mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-primary/30"
                    data-testid="button-start-virtual-tour"
                  >
                    <Play className="h-14 w-14 text-white" />
                  </Button>
                  <h3 className="text-2xl font-bold mb-3 drop-shadow-lg">Experience The Virtual Tour</h3>
                  <p className="text-lg text-white/90 max-w-md mx-auto">
                    Navigate through our stunning locations with intuitive 360° controls
                  </p>
                  <div className="flex items-center justify-center gap-8 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">6</div>
                      <div className="text-sm text-white/80">Locations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">360°</div>
                      <div className="text-sm text-white/80">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">HD</div>
                      <div className="text-sm text-white/80">Quality</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <img 
                  src={poolImage} 
                  alt="Resort water park" 
                  className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  data-testid="img-tour-pool"
                />
                <img 
                  src={restaurantImage} 
                  alt="Lutong Bahay restaurant" 
                  className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  data-testid="img-tour-restaurant"
                />
                <img 
                  src={gardenImage} 
                  alt="Dragon fruit plantation" 
                  className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  data-testid="img-tour-garden"
                />
                <img 
                  src={amenityImage} 
                  alt="Resort amenities" 
                  className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  data-testid="img-tour-amenities"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Resort Amenities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover all the wonderful facilities and activities we offer
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {AMENITIES.map((amenity, index) => {
              const IconComponent = iconMap[amenity.icon as keyof typeof iconMap];
              return (
                <div key={index} className="text-center p-6 bg-card rounded-xl border border-border">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    {IconComponent ? (
                      <IconComponent className="h-8 w-8 text-primary" />
                    ) : (
                      <Heart className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <h3 className="font-semibold text-card-foreground mb-2" data-testid={`text-amenity-${index}`}>
                    {amenity.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{amenity.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">What Our Guests Say</h2>
            <p className="text-lg text-muted-foreground">Real experiences from families who've stayed with us</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className="p-6 shadow-lg border border-border">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1">
                      {Array.from({ length: testimonial.rating }, (_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-card-foreground mb-4" data-testid={`text-testimonial-${index}`}>
                    {testimonial.text}
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-muted-foreground" data-testid={`text-initials-${index}`}>
                        {testimonial.initials}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground" data-testid={`text-name-${index}`}>
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-location-${index}`}>
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">Plan Your Visit</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Ready to experience the magic of Bukid ni Manang? Get in touch with us to plan your perfect farm resort getaway.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Location</h3>
                    <p className="text-muted-foreground" data-testid="text-location">
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
                    <p className="text-muted-foreground" data-testid="text-phone">
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
                    <p className="text-muted-foreground" data-testid="text-email">
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
                    <p className="text-muted-foreground" data-testid="text-hours">
                      {RESORT_INFO.hours}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Google Maps Section */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 border-b border-border">
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">Find Us</h3>
                  <p className="text-muted-foreground">
                    Located in Brgy. Guinbaoyan Norte, Calbayog City, Samar - just 15 minutes from the city center
                  </p>
                </div>
                <GoogleMaps />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">BM</span>
                </div>
                <span className="text-xl font-bold text-card-foreground">{RESORT_INFO.name}</span>
              </div>
              <p className="text-muted-foreground mb-4">
                {RESORT_INFO.description}
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="bg-muted hover:bg-muted/80">
                  <Facebook className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="bg-muted hover:bg-muted/80">
                  <Instagram className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="bg-muted hover:bg-muted/80">
                  <Twitter className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-card-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/accommodations" className="hover:text-primary transition-colors">Accommodations</a></li>
                <li><a href="#amenities" className="hover:text-primary transition-colors">Amenities</a></li>
                <li><a href="/virtual-tour" className="hover:text-primary transition-colors">Virtual Tour</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Gallery</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Reviews</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-card-foreground mb-4">Policies</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Booking Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cancellation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Sustainability</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 {RESORT_INFO.name} Farm And Resort. All rights reserved. 
              <span className="text-primary"> Made with ❤️ in the Philippines</span>
            </p>
          </div>
        </div>
      </footer>

      <VirtualTourModal 
        isOpen={virtualTourOpen} 
        onClose={() => setVirtualTourOpen(false)} 
      />
    </div>
  );
}
