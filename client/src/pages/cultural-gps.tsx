import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, DollarSign, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const DEMO_USER_ID = "demo-user-1";

interface GPSSearchParams {
  query: string;
  location: string;
  experienceType: string;
  filters: string[];
}

export default function CulturalGPS() {
  const [searchParams, setSearchParams] = useState<GPSSearchParams>({
    query: "",
    location: "",
    experienceType: "Food & Dining",
    filters: [],
  });

  const queryClient = useQueryClient();

  const searchMutation = useMutation({
    mutationFn: async (params: GPSSearchParams) => {
      const response = await apiRequest("POST", "/api/cultural-gps", {
        userId: DEMO_USER_ID,
        ...params,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cultural-gps-results"], data);
    },
  });

  const { data: resultsData } = useQuery({
    queryKey: ["cultural-gps-results"],
    enabled: false,
  });

  const handleSearch = () => {
    if (searchParams.query.trim()) {
      searchMutation.mutate(searchParams);
    }
  };

  const handleFilterChange = (filter: string, checked: boolean) => {
    setSearchParams(prev => ({
      ...prev,
      filters: checked 
        ? [...prev.filters, filter]
        : prev.filters.filter(f => f !== filter)
    }));
  };

  const experienceTypes = [
    "Food & Dining",
    "Arts & Culture", 
    "Music & Events",
    "Local Experiences",
    "Adventure & Nature"
  ];

  const filterOptions = [
    "Family-friendly",
    "Budget-conscious", 
    "Sustainable/Eco-friendly",
    "Off the beaten path"
  ];

  const mockExperiences = [
    {
      id: "1",
      name: "Grand Central Market",
      description: "Historic food hall featuring diverse cultural cuisines and artisanal vendors",
      location: "Downtown LA",
      distance: "15 min walk",
      price: "$$",
      rating: 4.8,
      matchPercentage: 96,
      tags: ["Cultural Dining", "Sustainable", "Local Artisans"],
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
    },
    {
      id: "2", 
      name: "Museum of Contemporary Art",
      description: "Cutting-edge contemporary art showcasing diverse cultural perspectives",
      location: "Arts District",
      distance: "8 min drive",
      price: "$",
      rating: 4.6,
      matchPercentage: 89,
      tags: ["Contemporary Art", "Cultural Diversity", "Inspiration"],
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
    },
    {
      id: "3",
      name: "The Troubadour", 
      description: "Legendary music venue hosting diverse artists and cultural performances",
      location: "West Hollywood",
      distance: "12 min drive",
      price: "$$",
      rating: 4.7,
      matchPercentage: 94,
      tags: ["Live Music", "Cultural Events", "Historic Venue"],
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
    }
  ];

  const experiences = resultsData?.recommendations || mockExperiences;

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--cultural-dark)] mb-4">
            Cultural GPS
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover cultural experiences and destinations tailored to your unique preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Interface */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[var(--cultural-dark)] mb-6">
                  Discover Experiences
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">
                      What are you looking for?
                    </Label>
                    <Input
                      placeholder="e.g., authentic local food, art galleries, hidden gems..."
                      value={searchParams.query}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">
                      Location
                    </Label>
                    <Input
                      placeholder="Current location or destination"
                      value={searchParams.location}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">
                      Experience Type
                    </Label>
                    <Select
                      value={searchParams.experienceType}
                      onValueChange={(value) => setSearchParams(prev => ({ ...prev, experienceType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleSearch}
                    disabled={searchMutation.isPending}
                    className="w-full gradient-primary text-white font-semibold"
                  >
                    <Search className="mr-2" size={16} />
                    {searchMutation.isPending ? "Searching..." : "Find Cultural Matches"}
                  </Button>
                </div>

                {/* Filters */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-[var(--cultural-dark)] mb-4">Filters</h4>
                  <div className="space-y-3">
                    {filterOptions.map((filter) => (
                      <div key={filter} className="flex items-center space-x-2">
                        <Checkbox
                          id={filter}
                          checked={searchParams.filters.includes(filter)}
                          onCheckedChange={(checked) => handleFilterChange(filter, !!checked)}
                        />
                        <Label htmlFor={filter} className="text-sm text-gray-700">
                          {filter}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results & Map */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border border-gray-200 overflow-hidden">
              {/* Map View */}
              <div className="h-64 bg-gray-200 relative">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute inset-0 bg-[var(--cultural-primary)] bg-opacity-20" />
                
                {/* Map info */}
                <div className="absolute top-4 left-4 bg-white rounded-lg p-2 shadow-lg">
                  <span className="text-sm font-medium text-gray-600">
                    {experiences.length} cultural matches found
                  </span>
                </div>
                
                {/* Sample pins */}
                <div className="absolute top-16 left-20 w-8 h-8 bg-[var(--cultural-secondary)] rounded-full border-4 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform" />
                <div className="absolute top-24 right-32 w-8 h-8 bg-[var(--cultural-accent)] rounded-full border-4 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform" />
                <div className="absolute bottom-16 left-32 w-8 h-8 bg-[var(--cultural-primary)] rounded-full border-4 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform" />
              </div>

              {/* Results List */}
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-[var(--cultural-dark)] mb-4">
                  Recommended Experiences
                </h3>
                
                <div className="space-y-4">
                  {experiences.map((experience: any) => (
                    <Card key={experience.id} className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex space-x-4">
                          <img
                            src={experience.image}
                            alt={experience.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-[var(--cultural-dark)] mb-1">
                                  {experience.name}
                                </h4>
                                <p className="text-gray-600 text-sm mb-2">
                                  {experience.description}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <MapPin size={12} className="mr-1" />
                                    {experience.location}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock size={12} className="mr-1" />
                                    {experience.distance}
                                  </span>
                                  <span className="flex items-center">
                                    <DollarSign size={12} className="mr-1" />
                                    {experience.price}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge
                                  className={`px-2 py-1 text-xs font-medium mb-1 ${
                                    experience.matchPercentage >= 95
                                      ? "bg-[var(--cultural-accent)] text-white"
                                      : experience.matchPercentage >= 90
                                      ? "bg-[var(--cultural-secondary)] text-white"
                                      : "bg-[var(--cultural-primary)] text-white"
                                  }`}
                                >
                                  {experience.matchPercentage}% match
                                </Badge>
                                <div className="flex items-center text-yellow-500">
                                  <Star size={12} className="fill-current" />
                                  <span className="text-xs text-gray-600 ml-1">
                                    {experience.rating}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              {experience.tags.map((tag: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
