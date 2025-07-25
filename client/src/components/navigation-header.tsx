import { Link, useLocation } from "wouter";
import { Bell, Compass, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/language-selector";
import { useAuth } from "@/hooks/useAuth";
import { i18n } from "@/lib/translations";

export function NavigationHeader() {
  const [location] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  const navItems = [
    { href: "/dashboard", label: i18n.t("nav.dashboard") },
    { href: "/cultural-gps", label: i18n.t("nav.culturalGps") },
    { href: "/ai-agents", label: i18n.t("nav.aiAgents") },
    { href: "/profile", label: i18n.t("nav.profile") },
    { href: "/analytics", label: i18n.t("nav.analytics") },
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
            <LanguageSelector />
            
            {isLoading ? (
              <div>Loading...</div>
            ) : isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" className="p-2">
                  <Bell className="text-gray-400 hover:text-gray-600" size={20} />
                </Button>
                <div className="w-8 h-8 gradient-accent rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.split(" ").map(n => n[0]).join("") || "U"}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  <LogOut size={16} className="mr-2" />
                  {i18n.t("nav.logout")}
                </Button>
              </>
            ) : (
              <Button 
                variant="default"
                size="sm"
                onClick={() => window.location.href = "/api/login"}
              >
                <LogIn size={16} className="mr-2" />
                {i18n.t("nav.login")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
