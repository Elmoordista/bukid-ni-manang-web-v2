import { Card, CardContent } from "@/components/ui/card";
import { RESORT_INFO } from "@/lib/constants";


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About {RESORT_INFO.name}</h1>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold mb-2">50+ Acres</h3>
                <p className="text-muted-foreground">Lush farmland and recreational spaces</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold mb-2">10,000+</h3>
                <p className="text-muted-foreground">Happy visitors since opening</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold mb-2">Eco-Certified</h3>
                <p className="text-muted-foreground">Sustainable tourism practices</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold mb-2">Family First</h3>
                <p className="text-muted-foreground">Creating lasting memories</p>
              </CardContent>
            </Card>
          </div>

          {/* History Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <div className="space-y-6">
                {RESORT_INFO.history.map((milestone, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-24">
                      <span className="font-bold text-primary">{milestone.year}</span>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Values Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <h3 className="text-lg text-muted-foreground mb-6">Rooted in Community, Growing with Purpose</h3>
              <div className="grid gap-6">
                {RESORT_INFO.values.map((value, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Location Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Our Location</h2>
              <p className="text-muted-foreground mb-6">
                Nestled in the heart of Brgy. Guinbaoyan Norte, we're just 15 minutes away 
                from Calbayog City Proper. Our strategic location offers the perfect balance 
                of accessibility and tranquility.
              </p>

              <div className="grid gap-6 mb-6">
                <div className="grid gap-2">
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold">Address:</span>
                    <span className="text-muted-foreground">{RESORT_INFO.location}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold">Contact:</span>
                    <span className="text-muted-foreground">{RESORT_INFO.phone}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold">Email:</span>
                    <span className="text-muted-foreground">{RESORT_INFO.email}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold">Hours:</span>
                    <span className="text-muted-foreground">{RESORT_INFO.hours}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">How to Reach Us</h3>
              <div className="grid gap-4">
                <div>
                  <h4 className="font-semibold mb-2">By Car</h4>
                  <p className="text-muted-foreground">{RESORT_INFO.directions.byCar}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">By Shuttle</h4>
                  <p className="text-muted-foreground">{RESORT_INFO.directions.byShuttle}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">By Tricycle</h4>
                  <p className="text-muted-foreground">{RESORT_INFO.directions.byTricycle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}