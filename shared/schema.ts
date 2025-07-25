import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  location: text("location"),
  language: text("language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const culturalProfiles = pgTable("cultural_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  archetype: text("archetype"), // e.g., "Conscious Explorer"
  culturalScore: integer("cultural_score").default(0), // 0-100
  interests: jsonb("interests").$type<Array<{name: string, strength: number}>>().default([]),
  values: jsonb("values").$type<Array<{name: string, importance: number}>>().default([]),
  preferenceTags: jsonb("preference_tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const culturalExperiences = pgTable("cultural_experiences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"), // Food & Dining, Arts & Culture, etc.
  location: text("location"),
  rating: integer("rating"), // 1-5 stars
  matchPercentage: integer("match_percentage"), // 0-100
  tags: jsonb("tags").$type<string[]>().default([]),
  qlooBrandId: text("qloo_brand_id"), // Qloo entity ID
  experienceDate: timestamp("experience_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recommendations = pgTable("recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type"), // experience, career, lifestyle, etc.
  matchPercentage: integer("match_percentage"),
  qluoEntityId: text("qloo_entity_id"),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  agentType: text("agent_type").notNull(), // career, lifestyle, travel, wellness
  messages: jsonb("messages").$type<Array<{role: 'user' | 'assistant', content: string, timestamp: string}>>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  culturalProfiles: many(culturalProfiles),
  culturalExperiences: many(culturalExperiences),
  recommendations: many(recommendations),
  chatSessions: many(chatSessions),
}));

export const culturalProfilesRelations = relations(culturalProfiles, ({ one }) => ({
  user: one(users, {
    fields: [culturalProfiles.userId],
    references: [users.id],
  }),
}));

export const culturalExperiencesRelations = relations(culturalExperiences, ({ one }) => ({
  user: one(users, {
    fields: [culturalExperiences.userId],
    references: [users.id],
  }),
}));

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  user: one(users, {
    fields: [recommendations.userId],
    references: [users.id],
  }),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one }) => ({
  user: one(users, {
    fields: [chatSessions.userId],
    references: [users.id],
  }),
}));

// Schema types for authentication system
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  username: true,
  name: true,
  location: true,
  language: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  name: true,
  location: true,
  language: true,
});

export const insertCulturalProfileSchema = createInsertSchema(culturalProfiles).pick({
  userId: true,
  archetype: true,
  culturalScore: true,
  interests: true,
  values: true,
  preferenceTags: true,
});

export const insertCulturalExperienceSchema = createInsertSchema(culturalExperiences).pick({
  userId: true,
  name: true,
  description: true,
  category: true,
  location: true,
  rating: true,
  matchPercentage: true,
  tags: true,
  qlooBrandId: true,
  experienceDate: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).pick({
  userId: true,
  title: true,
  description: true,
  type: true,
  matchPercentage: true,
  qluoEntityId: true,
  metadata: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  userId: true,
  agentType: true,
  messages: true,
});

// Inferred types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCulturalProfile = z.infer<typeof insertCulturalProfileSchema>;
export type CulturalProfile = typeof culturalProfiles.$inferSelect;
export type InsertCulturalExperience = z.infer<typeof insertCulturalExperienceSchema>;
export type CulturalExperience = typeof culturalExperiences.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
