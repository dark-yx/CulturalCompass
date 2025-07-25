import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/hero-section";
import { CulturalInsights } from "@/components/cultural-insights";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Briefcase, Heart, TrendingUp, Clock, Star } from "lucide-react";
import { Link } from "wouter";

const DEMO_USER_ID = "demo-user-1";

export default function Dashboard() {
  const { data: profileData } = useQuery({
    queryKey: ["/api/profile", DEMO_USER_ID],
  });

  const { data: recommendationsData } = useQuery({
    queryKey: ["/api/recommendations", DEMO_USER_ID],
  });

  const profile = profileData?.profile;
  const recommendations = recommendationsData?.recommendations || [];

  if (!profile) {
    return <div>Loading...</div>;
  }

  const quickActions = [
    {
      icon: MapPin,
      title: "Cultural GPS",
      description: "Discover cultural experiences",
      href: "/cultural-gps",
      gradient: "gradient-primary",
    },
    {
      icon: Briefcase,
      title: "Career Guide",
      description: "Professional development",
      href: "/ai-agents",
      gradient: "gradient-accent",
    },
    {
      icon: Heart,
      title: "Lifestyle",
      description: "Ethical consumption guide",
      href: "/ai-agents",
      gradient: "gradient-secondary",
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      description: "Cultural insights",
      href: "/analytics",
      gradient: "bg-gradient-to-r from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div>
      <HeroSection />

      {/* Main Dashboard */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--cultural-dark)] mb-4">
              Your Cultural Dashboard
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized insights and recommendations across all aspects of
              your life
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Button
                  className={`${action.gradient} text-white agent-card w-full h-auto flex-col space-y-4 p-6`}
                  asChild
                >
                  <div>
                    <action.icon size={32} />
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </div>
                </Button>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Recommendations */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-[var(--cultural-dark)] mb-6">
                Recent Recommendations
              </h3>

              <div className="space-y-4">
                {recommendations.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No recommendations available yet.</p>
                    <p className="text-sm mt-2">
                      Start exploring to get personalized suggestions!
                    </p>
                  </div>
                ) : (
                  recommendations.slice(0, 3).map((rec: any, index: number) => (
                    <Card key={index} className="shadow-sm border border-gray-100">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <img
                            src={`https://images.unsplash.com/photo-${
                              index === 0 ? "1501339847302-ac426a4a7cbb" :
                              index === 1 ? "1497366216548-37526070297c" :
                              "1555396273-367ea4eb4db5"
                            }?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100`}
                            alt={rec.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-[var(--cultural-dark)]">
                              {rec.title}
                            </h4>
                            <p className="text-gray-600 text-sm mb-2">
                              {rec.description}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock size={12} className="mr-1" />
                              <span>
                                {new Date(rec.createdAt).toLocaleDateString()}
                              </span>
                              <span className="mx-2">•</span>
                              <span className="text-[var(--cultural-accent)] font-medium">
                                {rec.matchPercentage}% match
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Cultural Profile Insights */}
            <CulturalInsights profile={profile} />
          </div>
        </div>
      </section>
    </div>
  );
}
