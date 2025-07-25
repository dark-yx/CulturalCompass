import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Compass, Star, Globe, Lightbulb, ArrowUp, Users, Calendar } from "lucide-react";

const DEMO_USER_ID = "demo-user-1";

export default function Analytics() {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["/api/analytics", DEMO_USER_ID],
  });

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  const analytics = analyticsData?.analytics || {
    culturalScore: 92,
    experiencesThisMonth: 23,
    satisfactionScore: 4.8,
    culturalDomains: 12,
    domainBreakdown: [
      { name: "Art & Culture", percentage: 28 },
      { name: "Food & Dining", percentage: 24 },
      { name: "Music & Events", percentage: 22 },
      { name: "Travel & Adventure", percentage: 18 },
      { name: "Lifestyle & Wellness", percentage: 8 },
    ],
    activityOverTime: [45, 60, 35, 80, 55, 70, 95],
  };

  const keyMetrics = [
    {
      icon: TrendingUp,
      value: `${analytics.culturalScore}%`,
      label: "Cultural Alignment Score",
      change: "+12%",
      gradient: "gradient-primary",
    },
    {
      icon: Compass,
      value: analytics.experiencesThisMonth,
      label: "Experiences This Month",
      change: "+8",
      gradient: "gradient-accent",
    },
    {
      icon: Star,
      value: analytics.satisfactionScore.toFixed(1),
      label: "Recommendation Satisfaction",
      change: "+0.3",
      gradient: "gradient-secondary",
    },
    {
      icon: Globe,
      value: analytics.culturalDomains,
      label: "Cultural Domains Explored",
      change: "+2",
      gradient: "bg-gradient-to-r from-yellow-500 to-orange-500",
    },
  ];

  const insights = [
    {
      icon: Lightbulb,
      title: "Pattern Recognition",
      description: "Your cultural preferences show a strong alignment with sustainable and authentic experiences. You tend to engage more with local, community-driven activities on weekends.",
      gradient: "bg-[var(--cultural-primary)]",
    },
    {
      icon: ArrowUp,
      title: "Growth Opportunity",
      description: "Consider exploring more music and performing arts events. Based on your profile, you might enjoy jazz clubs and cultural festivals in your area.",
      gradient: "bg-[var(--cultural-accent)]",
    },
    {
      icon: Users,
      title: "Social Connection",
      description: "You share 78% cultural alignment with users who also prioritize sustainability. Consider joining community groups focused on eco-conscious living.",
      gradient: "bg-[var(--cultural-secondary)]",
    },
    {
      icon: Calendar,
      title: "Optimal Timing",
      description: "Your engagement peaks on weekend mornings and weekday evenings. We'll time your recommendations to maximize cultural discovery during these periods.",
      gradient: "bg-yellow-500",
    },
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--cultural-dark)] mb-4">
            Cultural Analytics
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights into your cultural journey and personalized recommendations performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, index) => (
            <Card key={index} className={`${metric.gradient} text-white`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <metric.icon size={32} />
                  <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    {metric.change}
                  </span>
                </div>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm opacity-90">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activity Chart */}
          <Card className="bg-gray-50 border border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-[var(--cultural-dark)] mb-6">
                Cultural Activity Over Time
              </h3>
              <div className="h-64 bg-white rounded-xl p-4 border border-gray-200">
                <div className="h-full flex items-end justify-between space-x-2">
                  {analytics.activityOverTime.map((value: number, index: number) => (
                    <div
                      key={index}
                      className="bg-[var(--cultural-primary)] rounded-t-lg transition-all hover:bg-[var(--cultural-primary)]/80"
                      style={{
                        width: "12%",
                        height: `${value}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                {months.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Domain Breakdown */}
          <Card className="bg-gray-50 border border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-[var(--cultural-dark)] mb-6">
                Cultural Domain Distribution
              </h3>
              <div className="space-y-4">
                {analytics.domainBreakdown.map((domain: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-[var(--cultural-dark)]">
                        {domain.name}
                      </span>
                      <span className={`font-semibold ${
                        index === 0 ? "text-[var(--cultural-primary)]" :
                        index === 1 ? "text-[var(--cultural-accent)]" :
                        index === 2 ? "text-[var(--cultural-secondary)]" :
                        index === 3 ? "text-yellow-600" :
                        "text-indigo-600"
                      }`}>
                        {domain.percentage}%
                      </span>
                    </div>
                    <Progress 
                      value={domain.percentage} 
                      className="h-3"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights & Recommendations */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-[var(--cultural-dark)] mb-6">
            AI-Generated Cultural Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((insight, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-8 h-8 ${insight.gradient} rounded-lg flex items-center justify-center`}>
                      <insight.icon className="text-white" size={16} />
                    </div>
                    <h4 className="font-semibold text-[var(--cultural-dark)]">
                      {insight.title}
                    </h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {insight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
