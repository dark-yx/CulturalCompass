import {
  users,
  type User,
  type UpsertUser,
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
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
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

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCulturalProfile(userId: string): Promise<CulturalProfile | undefined> {
    const { culturalProfiles } = await import("@shared/schema");
    const [profile] = await db.select().from(culturalProfiles).where(eq(culturalProfiles.userId, userId));
    return profile;
  }

  async createCulturalProfile(insertProfile: InsertCulturalProfile): Promise<CulturalProfile> {
    const { culturalProfiles } = await import("@shared/schema");
    const [profile] = await db
      .insert(culturalProfiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateCulturalProfile(userId: string, updates: Partial<CulturalProfile>): Promise<CulturalProfile | undefined> {
    const { culturalProfiles } = await import("@shared/schema");
    const [profile] = await db
      .update(culturalProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(culturalProfiles.userId, userId))
      .returning();
    return profile;
  }

  async getCulturalExperiences(userId: string): Promise<CulturalExperience[]> {
    const { culturalExperiences } = await import("@shared/schema");
    const experiences = await db.select().from(culturalExperiences).where(eq(culturalExperiences.userId, userId));
    return experiences.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createCulturalExperience(insertExperience: InsertCulturalExperience): Promise<CulturalExperience> {
    const { culturalExperiences } = await import("@shared/schema");
    const [experience] = await db
      .insert(culturalExperiences)
      .values(insertExperience)
      .returning();
    return experience;
  }

  async getRecommendations(userId: string, limit: number = 10): Promise<Recommendation[]> {
    const { recommendations } = await import("@shared/schema");
    const recs = await db.select().from(recommendations).where(eq(recommendations.userId, userId));
    return recs
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }

  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const { recommendations } = await import("@shared/schema");
    const [recommendation] = await db
      .insert(recommendations)
      .values({ ...insertRecommendation, isRead: false })
      .returning();
    return recommendation;
  }

  async markRecommendationAsRead(id: string): Promise<void> {
    const { recommendations } = await import("@shared/schema");
    await db
      .update(recommendations)
      .set({ isRead: true })
      .where(eq(recommendations.id, id));
  }

  async getChatSession(userId: string, agentType: string): Promise<ChatSession | undefined> {
    const { chatSessions } = await import("@shared/schema");
    const { and } = await import("drizzle-orm");
    const [session] = await db.select().from(chatSessions)
      .where(and(eq(chatSessions.userId, userId), eq(chatSessions.agentType, agentType)));
    return session;
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const { chatSessions } = await import("@shared/schema");
    const [session] = await db
      .insert(chatSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async updateChatSession(id: string, messages: ChatSession['messages']): Promise<ChatSession | undefined> {
    const { chatSessions } = await import("@shared/schema");
    const [session] = await db
      .update(chatSessions)
      .set({ messages, updatedAt: new Date() })
      .where(eq(chatSessions.id, id))
      .returning();
    return session;
  }
}

export const storage = new DatabaseStorage();
