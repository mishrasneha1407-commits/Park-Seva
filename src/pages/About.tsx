import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, Users, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-4">About Us</h1>
        <p className="text-xl text-muted-foreground">
          Learn more about ParkSeva and our mission
        </p>
      </div>

      <div className="space-y-6">
        {/* About Section */}
        <Card className="group hover:shadow-glow transition-all duration-500 hover:-translate-y-2 bg-card/80 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              About ParkSeva
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              ParkSeva is an automated parking management system designed for smart cities. 
              It allows users to book parking slots online, get SMS/email notifications, 
              and pay securely via Payment Gateway. With features like reserved slots for women and 
              disabled users, and multiple location support, ParkSeva aims to make urban 
              parking stress-free and efficient.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold">10K+ Users</p>
                  <p className="text-sm text-muted-foreground">Happy customers</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-500/5 rounded-lg">
                <MapPin className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-semibold">500+ Slots</p>
                  <p className="text-sm text-muted-foreground">Across multiple locations</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-500/5 rounded-lg">
                <Shield className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="font-semibold">24/7 Security</p>
                  <p className="text-sm text-muted-foreground">Safe & monitored</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developers and Team Section */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Developers and Team</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Meet the talented team behind ParkSeva</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sneha Mishra - Founder (Special & Bigger) */}
            <Card className="group hover:shadow-glow transition-all duration-500 hover:-translate-y-2 bg-card/80 backdrop-blur-sm border border-border/50 md:col-span-2">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <Avatar className="w-28 h-28 border-4 border-primary/30 shadow-md">
                    <AvatarImage src="/Sneha Mishra.jpg" alt="Sneha Mishra" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white text-2xl font-bold">SM</AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <h3 className="text-2xl font-bold">Sneha Mishra</h3>
                      <div className="flex flex-wrap justify-center sm:justify-end gap-2">
                        <Badge variant="secondary" className="text-xs">Lead Developer</Badge>
                        <Badge variant="outline" className="text-xs">Founder</Badge>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      A final-year Bachelor of Engineering student with strong proficiency in full-stack development. Skilled in crafting dynamic web applications with seamless front-end and back-end integration, I am passionate about building scalable solutions and continuously expanding my technical expertise.
                    </p>
                    <div className="mt-3 flex justify-center sm:justify-start items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>Pune</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nikhil Kotewad */}
            <Card className="group hover:shadow-glow transition-all duration-500 hover:-translate-y-2 bg-card/80 backdrop-blur-sm border border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <Avatar className="w-20 h-20 border-4 border-green-500/20">
                    <AvatarImage src="/Nikhil Kotewad.jpg" alt="Nikhil Kotewad" />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-xl font-bold">NK</AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold">Nikhil Kotewad</h3>
                    <div className="mt-1 flex flex-wrap justify-center sm:justify-start gap-2">
                      <Badge variant="secondary" className="text-xs">Backend Developer</Badge>
                      <Badge variant="outline" className="text-xs">Co-Developer</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      Specializes in backend architecture and database design. Ensures robust and scalable server-side solutions.
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>Pune</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deepak Kumar */}
            <Card className="group hover:shadow-glow transition-all duration-500 hover:-translate-y-2 bg-card/80 backdrop-blur-sm border border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <Avatar className="w-20 h-20 border-4 border-purple-500/20">
                    <AvatarImage src="/Deepak Kumar.jpg" alt="Deepak Kumar" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-xl font-bold">DK</AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold">Deepak Kumar</h3>
                    <div className="mt-1 flex flex-wrap justify-center sm:justify-start gap-2">
                      <Badge variant="secondary" className="text-xs">UI/UX Designer</Badge>
                      <Badge variant="outline" className="text-xs">Designer</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      Creates intuitive and beautiful user interfaces. Focuses on user experience and modern design principles.
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>Pune</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tushar Padule */}
            <Card className="group hover:shadow-glow transition-all duration-500 hover:-translate-y-2 bg-card/80 backdrop-blur-sm border border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <Avatar className="w-20 h-20 border-4 border-orange-500/20">
                    <AvatarImage src="/Tushar Padul.jpg" alt="Tushar Padule" />
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xl font-bold">TP</AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold">Tushar Padule</h3>
                    <div className="mt-1 flex flex-wrap justify-center sm:justify-start gap-2">
                      <Badge variant="secondary" className="text-xs">DevOps Engineer</Badge>
                      <Badge variant="outline" className="text-xs">Infrastructure</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      Manages deployment, monitoring, and cloud infrastructure. Ensures high availability and performance optimization.
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>Pune</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
