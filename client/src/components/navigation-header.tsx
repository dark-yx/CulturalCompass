import { Link, useLocation } from "wouter";
import { Bell, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NavigationHeader() {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/cultural-gps", label: "Cultural GPS" },
    { href: "/ai-agents", label: "AI Agents" },
    { href: "/profile", label: "Profile" },
    { href: "/analytics", label: "Analytics" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard">
            <div className="flex items-center space-x-4 cursor-pointer">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <Compass className="text-white" size={16} />
                </div>
                <span className="text-xl font-bold text-[var(--cultural-dark)]">
                  Cultural Compass
                </span>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`font-medium transition-colors ${
                    location === item.href
                      ? "text-[var(--cultural-primary)]"
                      : "text-gray-600 hover:text-[var(--cultural-primary)]"
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="text-gray-400 hover:text-gray-600" size={20} />
            </Button>
            <div className="w-8 h-8 gradient-accent rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
