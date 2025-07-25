import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCulturalProfileSchema, insertCulturalExperienceSchema, insertRecommendationSchema, insertChatSessionSchema } from "@shared/schema";
import { qlooAPI } from "../client/src/lib/qloo-api";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ user });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  app.get("/api/auth/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Cultural Profile routes
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const profile = await storage.getCulturalProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ error: "Cultural profile not found" });
      }
      res.json({ profile });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cultural profile" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    try {
      const profileData = insertCulturalProfileSchema.parse(req.body);
      const profile = await storage.createCulturalProfile(profileData);
      res.json({ profile });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create profile" });
    }
  });

  app.put("/api/profile/:userId", async (req, res) => {
    try {
      const updates = req.body;
      const profile = await storage.updateCulturalProfile(req.params.userId, updates);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json({ profile });
    } catch (error) {
      res.status(400).json({ error: "Failed to update profile" });
    }
  });

  // Cultural Experiences routes
  app.get("/api/experiences/:userId", async (req, res) => {
    try {
      const experiences = await storage.getCulturalExperiences(req.params.userId);
      res.json({ experiences });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch experiences" });
    }
  });

  app.post("/api/experiences", async (req, res) => {
    try {
      const experienceData = insertCulturalExperienceSchema.parse(req.body);
      const experience = await storage.createCulturalExperience(experienceData);
      res.json({ experience });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create experience" });
    }
  });

  // Recommendations routes
  app.get("/api/recommendations/:userId", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recommendations = await storage.getRecommendations(req.params.userId, limit);
      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  // Qloo integration routes
  app.get("/api/qloo/search", async (req, res) => {
    try {
      const { q, type } = req.query;
      if (!q) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      
      const results = await qlooAPI.searchEntities(q as string, type as string);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to search Qloo entities" });
    }
  });

  app.post("/api/qloo/recommendations", async (req, res) => {
    try {
      const { entityIds, options } = req.body;
      if (!entityIds || !Array.isArray(entityIds)) {
        return res.status(400).json({ error: "entityIds array is required" });
      }
      
      const recommendations = await qlooAPI.getRecommendations(entityIds, options);
      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({ error: "Failed to get Qloo recommendations" });
    }
  });

  app.get("/api/qloo/demographics/:entityId", async (req, res) => {
    try {
      const demographics = await qlooAPI.getDemographics(req.params.entityId);
      res.json(demographics);
    } catch (error) {
      res.status(500).json({ error: "Failed to get Qloo demographics" });
    }
  });

  // Cultural GPS route - combines user profile with Qloo recommendations
  app.post("/api/cultural-gps", async (req, res) => {
    try {
      const { userId, query, location, experienceType, filters } = req.body;
      
      // Get user's cultural profile
      const profile = await storage.getCulturalProfile(userId);
      if (!profile) {
        return res.status(404).json({ error: "User profile not found" });
      }

      // Search for relevant entities in Qloo
      const searchResults = await qlooAPI.searchEntities(query, experienceType);
      
      // Get recommendations based on user interests
      const interestTerms = profile.interests.map(i => i.name).slice(0, 3);
      const entityIds = searchResults.entities.slice(0, 5).map(e => e.id);
      
      if (entityIds.length > 0) {
        const recommendations = await qlooAPI.getRecommendations(entityIds, {
          count: 10,
        });
        
        // Enhance recommendations with cultural matching
        const enhancedRecommendations = recommendations.map(rec => ({
          ...rec,
          culturalMatch: Math.floor(Math.random() * 20 + 80), // Mock cultural matching score
          tags: profile.preferenceTags.slice(0, 3), // Use user's preference tags
        }));

        res.json({ 
          recommendations: enhancedRecommendations,
          searchResults: searchResults.entities,
          userProfile: profile 
        });
      } else {
        res.json({ 
          recommendations: [],
          searchResults: [],
          userProfile: profile 
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to get cultural GPS recommendations" });
    }
  });

  // Chat sessions routes
  app.get("/api/chat/:userId/:agentType", async (req, res) => {
    try {
      const { userId, agentType } = req.params;
      let session = await storage.getChatSession(userId, agentType);
      
      if (!session) {
        // Create new session
        session = await storage.createChatSession({
          userId,
          agentType,
          messages: [{
            role: 'assistant',
            content: getAgentWelcomeMessage(agentType),
            timestamp: new Date().toISOString(),
          }],
        });
      }
      
      res.json({ session });
    } catch (error) {
      res.status(500).json({ error: "Failed to get chat session" });
    }
  });

  app.post("/api/chat/:sessionId/message", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Get existing session
      const session = await storage.getChatSession(sessionId, ''); // Need to refactor this
      if (!session) {
        return res.status(404).json({ error: "Chat session not found" });
      }

      // Add user message
      const userMessage = {
        role: 'user' as const,
        content: message,
        timestamp: new Date().toISOString(),
      };

      // Mock AI response based on agent type
      const aiResponse = {
        role: 'assistant' as const,
        content: getAgentResponse(session.agentType, message),
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...session.messages, userMessage, aiResponse];
      const updatedSession = await storage.updateChatSession(sessionId, updatedMessages);

      res.json({ session: updatedSession });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      const profile = await storage.getCulturalProfile(userId);
      const experiences = await storage.getCulturalExperiences(userId);
      const recommendations = await storage.getRecommendations(userId, 50);

      if (!profile) {
        return res.status(404).json({ error: "User profile not found" });
      }

      // Calculate analytics
      const analytics = {
        culturalScore: profile.culturalScore,
        experiencesThisMonth: experiences.filter(exp => {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return exp.createdAt && exp.createdAt > monthAgo;
        }).length,
        satisfactionScore: experiences.length > 0 
          ? experiences.reduce((sum, exp) => sum + (exp.rating || 0), 0) / experiences.length 
          : 0,
        culturalDomains: [...new Set(experiences.map(exp => exp.category))].length,
        domainBreakdown: calculateDomainBreakdown(experiences),
        activityOverTime: calculateActivityOverTime(experiences),
      };

      res.json({ analytics });
    } catch (error) {
      res.status(500).json({ error: "Failed to get analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function getAgentWelcomeMessage(agentType: string): string {
  const messages = {
    career: "Hi! I'm your Career Navigator. I can help you explore new career paths, identify skill gaps, and find opportunities that align with your cultural values and interests. What would you like to discuss?",
    lifestyle: "Hello! I'm your Lifestyle Guide. I specialize in ethical consumption and sustainable living aligned with your cultural preferences. How can I help you today?",
    travel: "Welcome! I'm your Travel Curator. I can help you discover authentic cultural experiences and destinations that match your interests. Where would you like to explore?",
    wellness: "Hi there! I'm your Wellness Coach. I focus on holistic well-being through culturally-aligned practices and experiences. What aspect of wellness interests you most?",
  };
  return messages[agentType as keyof typeof messages] || "Hello! How can I assist you today?";
}

function getAgentResponse(agentType: string, userMessage: string): string {
  // Mock AI responses based on agent type and user message
  const responses = {
    career: "Based on your cultural profile and interests, I can see you value sustainability and authentic experiences. Let me analyze your background and suggest some career paths that align with these values...",
    lifestyle: "I understand you're interested in making more conscious choices. Given your preference for sustainable living, here are some personalized recommendations...",
    travel: "Your cultural explorer archetype suggests you'd enjoy immersive, authentic experiences. Let me suggest some destinations and activities that match your interests...",
    wellness: "Considering your holistic approach to well-being, I recommend focusing on practices that integrate your cultural values with personal growth...",
  };
  return responses[agentType as keyof typeof responses] || "I understand your question. Let me think about the best way to help you with that...";
}

function calculateDomainBreakdown(experiences: any[]) {
  const domains = experiences.reduce((acc, exp) => {
    const category = exp.category || 'Other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = experiences.length;
  return Object.entries(domains).map(([name, count]) => ({
    name,
    percentage: Math.round((count / total) * 100),
  }));
}

function calculateActivityOverTime(experiences: any[]) {
  // Mock activity data for the last 7 months
  return [45, 60, 35, 80, 55, 70, 95];
}
