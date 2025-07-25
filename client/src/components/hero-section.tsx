import { Button } from "@/components/ui/button";
import { Rocket, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative gradient-hero py-20 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Navigate Life with{" "}
            <span className="text-gradient">Cultural Intelligence</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Discover personalized guidance for career, travel, and lifestyle
            decisions powered by AI that understands your cultural context and
            preferences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button className="cultural-button bg-white text-[var(--cultural-primary)] hover:bg-gray-50">
              <Rocket className="mr-2" size={20} />
              Start Your Cultural Journey
            </Button>
            <Button
              variant="outline"
              className="cultural-button border-2 border-white text-white hover:bg-white hover:text-[var(--cultural-primary)]"
            >
              <Play className="mr-2" size={20} />
              Watch Demo
            </Button>
          </div>

          {/* Cultural Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">3.7B+</div>
              <div className="text-gray-200">Cultural Entities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10T+</div>
              <div className="text-gray-200">Behavioral Signals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">Privacy</div>
              <div className="text-gray-200">First Design</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
