import { 
  type User, 
  type InsertUser,
  type CulturalProfile,
  type InsertCulturalProfile,
  type CulturalExperience,
  type InsertCulturalExperience,
  type Recommendation,
  type InsertRecommendation,
  type ChatSession,
  type InsertChatSession
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Cultural Profile methods
  getCulturalProfile(userId: string): Promise<CulturalProfile | undefined>;
  createCulturalProfile(profile: InsertCulturalProfile): Promise<CulturalProfile>;
  updateCulturalProfile(userId: string, profile: Partial<CulturalProfile>): Promise<CulturalProfile | undefined>;
  
  // Cultural Experience methods
  getCulturalExperiences(userId: string): Promise<CulturalExperience[]>;
  createCulturalExperience(experience: InsertCulturalExperience): Promise<CulturalExperience>;
  
  // Recommendation methods
  getRecommendations(userId: string, limit?: number): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  markRecommendationAsRead(id: string): Promise<void>;
  
  // Chat Session methods
  getChatSession(userId: string, agentType: string): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, messages: ChatSession['messages']): Promise<ChatSession | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private culturalProfiles: Map<string, CulturalProfile>;
  private culturalExperiences: Map<string, CulturalExperience>;
  private recommendations: Map<string, Recommendation>;
  private chatSessions: Map<string, ChatSession>;

  constructor() {
    this.users = new Map();
    this.culturalProfiles = new Map();
    this.culturalExperiences = new Map();
    this.recommendations = new Map();
    this.chatSessions = new Map();
    
    // Initialize with demo user
    this.initializeDemoData();
  }

  private initializeDemoData() {
    const demoUserId = "demo-user-1";
    const demoUser: User = {
      id: demoUserId,
      username: "jonathan_davis",
      email: "jonathan@example.com",
      name: "Jonathan Davis",
      location: "Los Angeles, CA",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(demoUserId, demoUser);

    const demoCulturalProfile: CulturalProfile = {
      id: randomUUID(),
      userId: demoUserId,
      archetype: "Conscious Explorer",
      culturalScore: 92,
      interests: [
        { name: "Sustainable Living", strength: 95 },
        { name: "Art & Design", strength: 88 },
        { name: "Travel & Culture", strength: 92 },
        { name: "Technology", strength: 78 },
        { name: "Music & Events", strength: 85 }
      ],
      values: [
        { name: "Environmental Responsibility", importance: 95 },
        { name: "Cultural Diversity", importance: 90 },
        { name: "Authentic Experiences", importance: 88 },
        { name: "Personal Growth", importance: 85 },
        { name: "Community Impact", importance: 87 }
      ],
      preferenceTags: [
        "Eco-Conscious", "Art Enthusiast", "Cultural Explorer", "Foodie", 
        "Music Lover", "Tech-Savvy", "Adventure Seeker", "Minimalist"
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.culturalProfiles.set(demoUserId, demoCulturalProfile);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getCulturalProfile(userId: string): Promise<CulturalProfile | undefined> {
    return this.culturalProfiles.get(userId);
  }

  async createCulturalProfile(insertProfile: InsertCulturalProfile): Promise<CulturalProfile> {
    const id = randomUUID();
    const profile: CulturalProfile = {
      ...insertProfile,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.culturalProfiles.set(insertProfile.userId, profile);
    return profile;
  }

  async updateCulturalProfile(userId: string, updates: Partial<CulturalProfile>): Promise<CulturalProfile | undefined> {
    const existing = this.culturalProfiles.get(userId);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.culturalProfiles.set(userId, updated);
    return updated;
  }

  async getCulturalExperiences(userId: string): Promise<CulturalExperience[]> {
    return Array.from(this.culturalExperiences.values())
      .filter(exp => exp.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createCulturalExperience(insertExperience: InsertCulturalExperience): Promise<CulturalExperience> {
    const id = randomUUID();
    const experience: CulturalExperience = {
      ...insertExperience,
      id,
      createdAt: new Date(),
    };
    this.culturalExperiences.set(id, experience);
    return experience;
  }

  async getRecommendations(userId: string, limit: number = 10): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values())
      .filter(rec => rec.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }

  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const id = randomUUID();
    const recommendation: Recommendation = {
      ...insertRecommendation,
      id,
      isRead: false,
      createdAt: new Date(),
    };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }

  async markRecommendationAsRead(id: string): Promise<void> {
    const recommendation = this.recommendations.get(id);
    if (recommendation) {
      recommendation.isRead = true;
      this.recommendations.set(id, recommendation);
    }
  }

  async getChatSession(userId: string, agentType: string): Promise<ChatSession | undefined> {
    return Array.from(this.chatSessions.values())
      .find(session => session.userId === userId && session.agentType === agentType);
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async updateChatSession(id: string, messages: ChatSession['messages']): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, messages, updatedAt: new Date() };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }
}

export const storage = new MemStorage();
