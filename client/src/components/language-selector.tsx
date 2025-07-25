import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { i18n } from "@/lib/translations";

export function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const availableLanguages = i18n.getAvailableLanguages();

  useEffect(() => {
    setCurrentLanguage(i18n.getLanguage());
  }, []);

  const handleLanguageChange = (language: string) => {
    i18n.setLanguage(language);
    setCurrentLanguage(language);
    window.location.reload(); // Reload to apply new language
  };

  return (
    <div className="flex items-center space-x-2">
      <Globe size={16} className="text-gray-500" />
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-24 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}