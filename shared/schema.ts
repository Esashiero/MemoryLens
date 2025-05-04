import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table (keeping this as it was already in the schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Data sources table
export const dataSources = pgTable("data_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // browser, chat, files, email, photos, social
  status: text("status").notNull().default("active"), // active, inactive
  lastSync: timestamp("last_sync").defaultNow(),
  config: json("config"),
  userId: integer("user_id").references(() => users.id),
});

export const insertDataSourceSchema = createInsertSchema(dataSources);
export type InsertDataSource = z.infer<typeof insertDataSourceSchema>;
export type DataSource = typeof dataSources.$inferSelect;

// Activities table
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  source: text("source").notNull(), // browser, chat, files, email, photos, social
  sourceId: text("source_id"), // ID of the item in the source system
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  data: json("data"), // Additional data specific to the activity type
  userId: integer("user_id").references(() => users.id),
});

export const insertActivitySchema = createInsertSchema(activities);
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Tags table
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
});

export const insertTagSchema = createInsertSchema(tags);
export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

// Activity tags (many-to-many)
export const activityTags = pgTable("activity_tags", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id").references(() => activities.id).notNull(),
  tagId: integer("tag_id").references(() => tags.id).notNull(),
});

export const insertActivityTagSchema = createInsertSchema(activityTags);
export type InsertActivityTag = z.infer<typeof insertActivityTagSchema>;
export type ActivityTag = typeof activityTags.$inferSelect;

// AI messages for conversation history
export const aiMessages = pgTable("ai_messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(), // user or assistant
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertAiMessageSchema = createInsertSchema(aiMessages);
export type InsertAiMessage = z.infer<typeof insertAiMessageSchema>;
export type AiMessage = typeof aiMessages.$inferSelect & {
  actions?: { icon: string; label: string }[];
};

// Search queries
export const searchQueries = pgTable("search_queries", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertSearchQuerySchema = createInsertSchema(searchQueries);
export type InsertSearchQuery = z.infer<typeof insertSearchQuerySchema>;
export type SearchQuery = typeof searchQueries.$inferSelect;

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  activities: many(activities),
  dataSources: many(dataSources),
  tags: many(tags),
  aiMessages: many(aiMessages),
  searchQueries: many(searchQueries),
}));

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  user: one(users, { fields: [activities.userId], references: [users.id] }),
  tags: many(activityTags),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, { fields: [tags.userId], references: [users.id] }),
  activities: many(activityTags),
}));

export const activityTagsRelations = relations(activityTags, ({ one }) => ({
  activity: one(activities, { fields: [activityTags.activityId], references: [activities.id] }),
  tag: one(tags, { fields: [activityTags.tagId], references: [tags.id] }),
}));

export const dataSourcesRelations = relations(dataSources, ({ one }) => ({
  user: one(users, { fields: [dataSources.userId], references: [users.id] }),
}));

export const aiMessagesRelations = relations(aiMessages, ({ one }) => ({
  user: one(users, { fields: [aiMessages.userId], references: [users.id] }),
}));

export const searchQueriesRelations = relations(searchQueries, ({ one }) => ({
  user: one(users, { fields: [searchQueries.userId], references: [users.id] }),
}));

// Extended types for frontend
export type TimelineItem = Activity & {
  tags?: string[];
};
