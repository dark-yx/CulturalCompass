export interface Translation {
  [key: string]: string | Translation;
}

export const translations: Record<string, Translation> = {
  en: {
    // Navigation
    nav: {
      dashboard: "Dashboard",
      culturalGps: "Cultural GPS",
      aiAgents: "AI Agents",
      profile: "Profile",
      analytics: "Analytics",
      login: "Login",
      logout: "Logout"
    },
    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      search: "Search",
      filter: "Filter",
      back: "Back",
      next: "Next",
      previous: "Previous",
      close: "Close"
    },
    // Hero Section
    hero: {
      title: "Navigate Life with Cultural Intelligence",
      subtitle: "Discover personalized guidance for career, travel, and lifestyle decisions powered by AI that understands your cultural context and preferences.",
      startJourney: "Start Your Cultural Journey",
      watchDemo: "Watch Demo",
      culturalEntities: "Cultural Entities",
      behavioralSignals: "Behavioral Signals",
      privacyFirst: "Privacy First Design"
    },
    // Dashboard
    dashboard: {
      title: "Your Cultural Dashboard",
      subtitle: "Get personalized insights and recommendations across all aspects of your life",
      quickActions: "Quick Actions",
      recentRecommendations: "Recent Recommendations",
      noRecommendations: "No recommendations available yet.",
      startExploring: "Start exploring to get personalized suggestions!",
      culturalProfile: "Cultural Profile Insights"
    },
    // Cultural GPS
    culturalGps: {
      title: "Cultural GPS",
      subtitle: "Discover cultural experiences and destinations tailored to your unique preferences",
      discoverExperiences: "Discover Experiences",
      whatLookingFor: "What are you looking for?",
      placeholder: "e.g., authentic local food, art galleries, hidden gems...",
      location: "Location",
      locationPlaceholder: "Current location or destination",
      experienceType: "Experience Type",
      findMatches: "Find Cultural Matches",
      searching: "Searching...",
      filters: "Filters",
      recommendedExperiences: "Recommended Experiences",
      culturalMatches: "cultural matches found"
    },
    // AI Agents
    aiAgents: {
      title: "AI Cultural Agents",
      subtitle: "Get specialized guidance from AI agents trained in different domains of cultural intelligence",
      chooseAgent: "Choose Your Agent",
      careerNavigator: "Career Navigator",
      lifestyleGuide: "Lifestyle Guide",
      travelCurator: "Travel Curator",
      wellnessCoach: "Wellness Coach",
      professionalDevelopment: "Professional development",
      ethicalConsumption: "Ethical consumption",
      culturalExperiences: "Cultural experiences",
      holisticWellbeing: "Holistic well-being",
      online: "Online",
      specializesIn: "Specializes in",
      askAbout: "Ask about"
    },
    // Profile
    profile: {
      title: "Your Cultural Profile",
      subtitle: "Understanding your preferences to provide better personalized guidance",
      culturalArchetype: "Cultural Archetype",
      experiences: "Experiences",
      culturalScore: "Cultural Score",
      editProfile: "Edit Profile",
      culturalPreferences: "Cultural Preferences",
      interestsPassions: "Interests & Passions",
      coreValues: "Core Values",
      preferenceTags: "Preference Tags",
      recentActivity: "Recent Cultural Activity",
      updatedDaysAgo: "Updated {days} days ago"
    },
    // Analytics
    analytics: {
      title: "Cultural Analytics",
      subtitle: "Insights into your cultural journey and personalized recommendations performance",
      culturalAlignment: "Cultural Alignment Score",
      experiencesThisMonth: "Experiences This Month",
      recommendationSatisfaction: "Recommendation Satisfaction",
      culturalDomainsExplored: "Cultural Domains Explored",
      activityOverTime: "Cultural Activity Over Time",
      domainDistribution: "Cultural Domain Distribution",
      aiInsights: "AI-Generated Cultural Insights",
      patternRecognition: "Pattern Recognition",
      growthOpportunity: "Growth Opportunity",
      socialConnection: "Social Connection",
      optimalTiming: "Optimal Timing"
    }
  },
  es: {
    // Navigation
    nav: {
      dashboard: "Panel Principal",
      culturalGps: "GPS Cultural",
      aiAgents: "Agentes IA",
      profile: "Perfil",
      analytics: "Análisis",
      login: "Iniciar Sesión",
      logout: "Cerrar Sesión"
    },
    // Common
    common: {
      loading: "Cargando...",
      error: "Error",
      save: "Guardar",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Eliminar",
      search: "Buscar",
      filter: "Filtrar",
      back: "Atrás",
      next: "Siguiente",
      previous: "Anterior",
      close: "Cerrar"
    },
    // Hero Section
    hero: {
      title: "Navega la Vida con Inteligencia Cultural",
      subtitle: "Descubre orientación personalizada para decisiones de carrera, viajes y estilo de vida impulsada por IA que comprende tu contexto y preferencias culturales.",
      startJourney: "Comienza tu Viaje Cultural",
      watchDemo: "Ver Demo",
      culturalEntities: "Entidades Culturales",
      behavioralSignals: "Señales Conductuales",
      privacyFirst: "Diseño que Prioriza la Privacidad"
    },
    // Dashboard
    dashboard: {
      title: "Tu Panel Cultural",
      subtitle: "Obtén perspectivas personalizadas y recomendaciones en todos los aspectos de tu vida",
      quickActions: "Acciones Rápidas",
      recentRecommendations: "Recomendaciones Recientes",
      noRecommendations: "Aún no hay recomendaciones disponibles.",
      startExploring: "¡Comienza a explorar para obtener sugerencias personalizadas!",
      culturalProfile: "Perspectivas del Perfil Cultural"
    },
    // Cultural GPS
    culturalGps: {
      title: "GPS Cultural",
      subtitle: "Descubre experiencias culturales y destinos adaptados a tus preferencias únicas",
      discoverExperiences: "Descubrir Experiencias",
      whatLookingFor: "¿Qué estás buscando?",
      placeholder: "ej., comida local auténtica, galerías de arte, joyas ocultas...",
      location: "Ubicación",
      locationPlaceholder: "Ubicación actual o destino",
      experienceType: "Tipo de Experiencia",
      findMatches: "Encontrar Coincidencias Culturales",
      searching: "Buscando...",
      filters: "Filtros",
      recommendedExperiences: "Experiencias Recomendadas",
      culturalMatches: "coincidencias culturales encontradas"
    },
    // AI Agents
    aiAgents: {
      title: "Agentes Culturales IA",
      subtitle: "Obtén orientación especializada de agentes IA entrenados en diferentes dominios de inteligencia cultural",
      chooseAgent: "Elige tu Agente",
      careerNavigator: "Navegador de Carrera",
      lifestyleGuide: "Guía de Estilo de Vida",
      travelCurator: "Curador de Viajes",
      wellnessCoach: "Coach de Bienestar",
      professionalDevelopment: "Desarrollo profesional",
      ethicalConsumption: "Consumo ético",
      culturalExperiences: "Experiencias culturales",
      holisticWellbeing: "Bienestar holístico",
      online: "En línea",
      specializesIn: "Se especializa en",
      askAbout: "Pregunta sobre"
    },
    // Profile
    profile: {
      title: "Tu Perfil Cultural",
      subtitle: "Entendiendo tus preferencias para brindar mejor orientación personalizada",
      culturalArchetype: "Arquetipo Cultural",
      experiences: "Experiencias",
      culturalScore: "Puntuación Cultural",
      editProfile: "Editar Perfil",
      culturalPreferences: "Preferencias Culturales",
      interestsPassions: "Intereses y Pasiones",
      coreValues: "Valores Fundamentales",
      preferenceTags: "Etiquetas de Preferencia",
      recentActivity: "Actividad Cultural Reciente",
      updatedDaysAgo: "Actualizado hace {days} días"
    },
    // Analytics
    analytics: {
      title: "Análisis Cultural",
      subtitle: "Perspectivas sobre tu viaje cultural y rendimiento de recomendaciones personalizadas",
      culturalAlignment: "Puntuación de Alineación Cultural",
      experiencesThisMonth: "Experiencias este Mes",
      recommendationSatisfaction: "Satisfacción de Recomendaciones",
      culturalDomainsExplored: "Dominios Culturales Explorados",
      activityOverTime: "Actividad Cultural en el Tiempo",
      domainDistribution: "Distribución de Dominios Culturales",
      aiInsights: "Perspectivas Generadas por IA",
      patternRecognition: "Reconocimiento de Patrones",
      growthOpportunity: "Oportunidad de Crecimiento",
      socialConnection: "Conexión Social",
      optimalTiming: "Tiempo Óptimo"
    }
  }
};

export class I18nService {
  private currentLanguage: string = 'en';

  setLanguage(language: string) {
    if (translations[language]) {
      this.currentLanguage = language;
      localStorage.setItem('cultural-compass-language', language);
    }
  }

  getLanguage(): string {
    return this.currentLanguage;
  }

  init() {
    const savedLanguage = localStorage.getItem('cultural-compass-language');
    if (savedLanguage && translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    } else {
      // Detect browser language
      const browserLanguage = navigator.language.split('-')[0];
      if (translations[browserLanguage]) {
        this.currentLanguage = browserLanguage;
      }
    }
  }

  t(key: string, variables?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }

    if (typeof value === 'string') {
      // Replace variables
      if (variables) {
        Object.entries(variables).forEach(([varKey, varValue]) => {
          value = value.replace(`{${varKey}}`, String(varValue));
        });
      }
      return value;
    }

    return key; // Return key if not found
  }

  getAvailableLanguages(): { code: string; name: string }[] {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' }
    ];
  }
}

export const i18n = new I18nService();