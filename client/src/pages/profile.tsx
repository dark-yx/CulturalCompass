import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit } from "lucide-react";

const DEMO_USER_ID = "demo-user-1";

export default function Profile() {
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["/api/profile", DEMO_USER_ID],
  });

  const { data: userData } = useQuery({
    queryKey: ["/api/auth/user", DEMO_USER_ID],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const profile = profileData?.profile;
  const user = userData?.user;

  if (!profile || !user) {
    return <div>Profile not found</div>;
  }

  const recentActivity = [
    {
      action: "Explored local art galleries in Downtown LA",
      time: "2 days ago",
      color: "bg-[var(--cultural-accent)]",
    },
    {
      action: "Attended sustainable fashion workshop",
      time: "1 week ago", 
      color: "bg-[var(--cultural-secondary)]",
    },
    {
      action: "Discovered new cultural dining experience",
      time: "2 weeks ago",
      color: "bg-[var(--cultural-primary)]",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--cultural-dark)] mb-4">
            Your Cultural Profile
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understanding your preferences to provide better personalized guidance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border border-gray-200">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--cultural-dark)] mb-2">
                    {user.name}
                  </h3>
                  <p className="text-gray-600">{user.location}</p>
                </div>

                <div className="space-y-4">
                  <div className="gradient-primary text-white p-4 rounded-xl">
                    <h4 className="font-semibold mb-2">Cultural Archetype</h4>
                    <p className="text-sm">{profile.archetype}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-[var(--cultural-primary)]">
                        147
                      </div>
                      <div className="text-xs text-gray-600">Experiences</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-[var(--cultural-secondary)]">
                        {profile.culturalScore}%
                      </div>
                      <div className="text-xs text-gray-600">Cultural Score</div>
                    </div>
                  </div>

                  <Button className="w-full bg-gray-100 text-[var(--cultural-dark)] hover:bg-gray-200">
                    <Edit className="mr-2" size={16} />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Preferences */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-[var(--cultural-dark)] mb-6">
                  Cultural Preferences
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Interests */}
                  <div>
                    <h4 className="text-lg font-semibold text-[var(--cultural-dark)] mb-4">
                      Interests & Passions
                    </h4>
                    <div className="space-y-3">
                      {profile.interests.map((interest: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-700">{interest.name}</span>
                          <div className="w-20 h-2 bg-gray-200 rounded-full ml-3">
                            <Progress 
                              value={interest.strength} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Values */}
                  <div>
                    <h4 className="text-lg font-semibold text-[var(--cultural-dark)] mb-4">
                      Core Values
                    </h4>
                    <div className="space-y-3">
                      {profile.values.map((value: any, index: number) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${
                            index === 0 ? "bg-[var(--cultural-accent)]" :
                            index === 1 ? "bg-[var(--cultural-secondary)]" :
                            index === 2 ? "bg-[var(--cultural-primary)]" :
                            index === 3 ? "bg-yellow-500" :
                            "bg-pink-500"
                          }`}></div>
                          <span className="text-gray-700">{value.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preference Tags */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-[var(--cultural-dark)] mb-4">
                    Preference Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferenceTags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`px-3 py-1 text-sm ${
                          index % 8 === 0 ? "bg-blue-100 text-blue-800" :
                          index % 8 === 1 ? "bg-green-100 text-green-800" :
                          index % 8 === 2 ? "bg-purple-100 text-purple-800" :
                          index % 8 === 3 ? "bg-pink-100 text-pink-800" :
                          index % 8 === 4 ? "bg-yellow-100 text-yellow-800" :
                          index % 8 === 5 ? "bg-indigo-100 text-indigo-800" :
                          index % 8 === 6 ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-[var(--cultural-dark)] mb-4">
                    Recent Cultural Activity
                  </h4>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 text-sm">
                        <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                        <span className="text-gray-600">{activity.action}</span>
                        <span className="text-gray-400">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
