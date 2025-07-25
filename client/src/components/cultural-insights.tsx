import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface CulturalInsightsProps {
  profile: {
    archetype?: string;
    culturalScore?: number;
    interests: Array<{ name: string; strength: number }>;
    values: Array<{ name: string; importance: number }>;
    preferenceTags: string[];
  };
}

export function CulturalInsights({ profile }: CulturalInsightsProps) {
  return (
    <div className="cultural-card p-8">
      <h3 className="text-2xl font-bold text-[var(--cultural-dark)] mb-6">
        Cultural Profile Insights
      </h3>

      <div className="space-y-6">
        {profile.interests.map((interest, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-[var(--cultural-dark)]">
                {interest.name}
              </span>
              <span className="text-[var(--cultural-primary)] font-semibold">
                {interest.strength}%
              </span>
            </div>
            <Progress value={interest.strength} className="h-3" />
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
        <h4 className="font-semibold text-[var(--cultural-dark)] mb-2">
          Cultural Archetype
        </h4>
        <div className="flex items-center space-x-2">
          <Badge className="gradient-primary text-white px-3 py-1 text-sm font-medium">
            {profile.archetype || "Conscious Explorer"}
          </Badge>
          <span className="text-gray-500 text-sm">• Updated 2 days ago</span>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          You seek meaningful experiences that align with your values while
          exploring diverse cultures and contributing positively to communities.
        </p>
      </div>
    </div>
  );
}
