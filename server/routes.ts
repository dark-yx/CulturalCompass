import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertUserSchema, insertCulturalProfileSchema, insertCulturalExperienceSchema, insertRecommendationSchema, insertChatSessionSchema } from "@shared/schema";
import { qlooAPI } from "../client/src/lib/qloo-api";
import { aiAgentService } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

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
  app.get("/api/profile/:userId", isAuthenticated, async (req, res) => {
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
  app.get("/api/chat/:userId/:agentType", isAuthenticated, async (req, res) => {
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

  app.post("/api/chat/:sessionId/message", isAuthenticated, async (req: any, res) => {
    try {
      const { sessionId } = req.params;
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Get existing session by ID
      const { chatSessions } = await import("@shared/schema");
      const { db } = await import("./db");
      const { eq } = await import("drizzle-orm");
      
      const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, sessionId));
      if (!session) {
        return res.status(404).json({ error: "Chat session not found" });
      }

      // Get user profile for AI context
      const userProfile = await storage.getCulturalProfile(session.userId);

      // Add user message
      const userMessage = {
        role: 'user' as const,
        content: message,
        timestamp: new Date().toISOString(),
      };

      // Generate AI response using OpenAI
      const conversationHistory = session.messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

      const aiResponseContent = await aiAgentService.generateResponse(
        session.agentType,
        message,
        userProfile,
        conversationHistory
      );

      const aiResponse = {
        role: 'assistant' as const,
        content: aiResponseContent,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...session.messages, userMessage, aiResponse];
      const updatedSession = await storage.updateChatSession(sessionId, updatedMessages);

      res.json({ session: updatedSession });
    } catch (error) {
      console.error("Chat error:", error);
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
