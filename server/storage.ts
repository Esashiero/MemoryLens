import { db } from "@db";
import { eq, and, desc, like, gte, lte, sql } from "drizzle-orm";
import { 
  users, 
  dataSources, 
  activities, 
  tags, 
  activityTags, 
  aiMessages, 
  searchQueries 
} from "@shared/schema";
import type { 
  InsertUser, 
  User, 
  InsertDataSource, 
  DataSource,
  InsertActivity,
  Activity,
  InsertTag,
  Tag,
  InsertActivityTag,
  InsertAiMessage,
  AiMessage,
  InsertSearchQuery,
  SearchQuery,
  TimelineItem
} from "@shared/schema";

export const storage = {
  // User operations
  async getUserById(id: number): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  },

  async getUserByUsername(username: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0] || null;
  },

  async insertUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  },

  // Data source operations
  async getDataSources(userId?: number): Promise<DataSource[]> {
    if (userId) {
      return await db.select().from(dataSources).where(eq(dataSources.userId, userId));
    }
    return await db.select().from(dataSources);
  },

  async getDataSourceById(id: number): Promise<DataSource | null> {
    const result = await db.select().from(dataSources).where(eq(dataSources.id, id));
    return result[0] || null;
  },

  async insertDataSource(dataSource: InsertDataSource): Promise<DataSource> {
    const result = await db.insert(dataSources).values(dataSource).returning();
    return result[0];
  },

  async updateDataSourceStatus(id: number, status: string): Promise<DataSource | null> {
    const result = await db
      .update(dataSources)
      .set({ status })
      .where(eq(dataSources.id, id))
      .returning();
    return result[0] || null;
  },

  // Activity operations
  async getRecentActivities(limit = 10, userId?: number): Promise<Activity[]> {
    let query = db.select().from(activities).orderBy(desc(activities.timestamp)).limit(limit);
    
    if (userId) {
      query = query.where(eq(activities.userId, userId));
    }
    
    return await query;
  },

  async getActivitiesBySource(source: string, limit = 20, userId?: number): Promise<Activity[]> {
    let query = db.select()
      .from(activities)
      .where(eq(activities.source, source))
      .orderBy(desc(activities.timestamp))
      .limit(limit);
    
    if (userId) {
      query = query.where(eq(activities.userId, userId));
    }
    
    return await query;
  },

  async getActivitiesByTimeRange(startDate: Date, endDate: Date, userId?: number): Promise<Activity[]> {
    let query = db.select()
      .from(activities)
      .where(
        and(
          gte(activities.timestamp, startDate),
          lte(activities.timestamp, endDate)
        )
      )
      .orderBy(desc(activities.timestamp));
    
    if (userId) {
      query = query.where(eq(activities.userId, userId));
    }
    
    return await query;
  },

  async insertActivity(activity: InsertActivity): Promise<Activity> {
    const result = await db.insert(activities).values(activity).returning();
    return result[0];
  },

  // Timeline operations
  async getTimelineItems(filter?: string, sources?: string[], userId?: number): Promise<TimelineItem[]> {
    let startDate: Date | undefined;
    const now = new Date();
    
    if (filter === 'today') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (filter === 'week') {
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (filter === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    let query = db.select({
      ...activities,
    })
    .from(activities)
    .orderBy(desc(activities.timestamp));
    
    if (startDate) {
      query = query.where(gte(activities.timestamp, startDate));
    }
    
    if (sources && sources.length > 0) {
      // Only filter by sources if there are sources to filter by
      query = query.where(sql`${activities.source} IN (${sources.join(',')})`);
    }
    
    if (userId) {
      query = query.where(eq(activities.userId, userId));
    }
    
    const timelineItems = await query;
    
    // For each activity, get its tags
    const itemsWithTags = await Promise.all(
      timelineItems.map(async (item) => {
        const activityTagsResult = await db
          .select()
          .from(activityTags)
          .where(eq(activityTags.activityId, item.id));
        
        if (activityTagsResult.length === 0) {
          return { ...item, tags: [] };
        }
        
        const tagIds = activityTagsResult.map(at => at.tagId);
        
        const tagsResult = await db
          .select()
          .from(tags)
          .where(sql`${tags.id} IN (${tagIds.join(',')})`);
        
        return {
          ...item,
          tags: tagsResult.map(tag => tag.name)
        };
      })
    );
    
    return itemsWithTags;
  },

  // Tag operations
  async getAllTags(userId?: number): Promise<Tag[]> {
    let query = db.select().from(tags);
    
    if (userId) {
      query = query.where(eq(tags.userId, userId));
    }
    
    return await query;
  },

  async getTagById(id: number): Promise<Tag | null> {
    const result = await db.select().from(tags).where(eq(tags.id, id));
    return result[0] || null;
  },

  async getTagByName(name: string): Promise<Tag | null> {
    const result = await db.select().from(tags).where(eq(tags.name, name));
    return result[0] || null;
  },

  async insertTag(tag: InsertTag): Promise<Tag> {
    const result = await db.insert(tags).values(tag).returning();
    return result[0];
  },

  async assignTagToActivity(activityTag: InsertActivityTag): Promise<void> {
    await db.insert(activityTags).values(activityTag);
  },

  // AI conversation operations
  async getConversationHistory(limit = 10, userId?: number): Promise<AiMessage[]> {
    let query = db.select()
      .from(aiMessages)
      .orderBy(desc(aiMessages.timestamp))
      .limit(limit);
    
    if (userId) {
      query = query.where(eq(aiMessages.userId, userId));
    }
    
    const results = await query;
    return results.reverse(); // Return in chronological order for conversations
  },

  async insertAiMessage(message: InsertAiMessage): Promise<AiMessage> {
    const result = await db.insert(aiMessages).values(message).returning();
    return result[0];
  },

  // Search operations
  async saveSearchQuery(query: InsertSearchQuery): Promise<SearchQuery> {
    const result = await db.insert(searchQueries).values(query).returning();
    return result[0];
  },

  async getTopSearchQueries(limit = 5, userId?: number): Promise<{ query: string; count: number }[]> {
    let query = db.select({
      query: searchQueries.query,
      count: sql<number>`count(${searchQueries.query})`
    })
    .from(searchQueries)
    .groupBy(searchQueries.query)
    .orderBy(sql`count(${searchQueries.query}) DESC`)
    .limit(limit);
    
    if (userId) {
      query = query.where(eq(searchQueries.userId, userId));
    }
    
    return await query;
  },

  async searchActivities(searchTerm: string, source?: string, dateRange?: string, userId?: number): Promise<TimelineItem[]> {
    let startDate: Date | undefined;
    const now = new Date();
    
    if (dateRange === 'today') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (dateRange === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      startDate = yesterday;
    } else if (dateRange === 'week') {
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (dateRange === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (dateRange === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    let query = db.select({
      ...activities,
    })
    .from(activities)
    .where(
      or(
        like(activities.title, `%${searchTerm}%`),
        like(activities.description, `%${searchTerm}%`)
      )
    )
    .orderBy(desc(activities.timestamp));
    
    if (startDate) {
      query = query.where(gte(activities.timestamp, startDate));
    }
    
    if (source && source !== 'all') {
      query = query.where(eq(activities.source, source));
    }
    
    if (userId) {
      query = query.where(eq(activities.userId, userId));
    }
    
    const searchResults = await query;
    
    // For each activity, get its tags
    const resultsWithTags = await Promise.all(
      searchResults.map(async (item) => {
        const activityTagsResult = await db
          .select()
          .from(activityTags)
          .where(eq(activityTags.activityId, item.id));
        
        if (activityTagsResult.length === 0) {
          return { ...item, tags: [] };
        }
        
        const tagIds = activityTagsResult.map(at => at.tagId);
        
        const tagsResult = await db
          .select()
          .from(tags)
          .where(sql`${tags.id} IN (${tagIds.join(',')})`);
        
        return {
          ...item,
          tags: tagsResult.map(tag => tag.name)
        };
      })
    );
    
    return resultsWithTags;
  },

  // Analytics operations
  async getActivityBySource(timeRange?: string, userId?: number): Promise<{ source: string; count: number }[]> {
    let startDate: Date | undefined;
    const now = new Date();
    
    if (timeRange === 'week') {
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeRange === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    let query = db.select({
      source: activities.source,
      count: sql<number>`count(${activities.id})`
    })
    .from(activities)
    .groupBy(activities.source);
    
    if (startDate) {
      query = query.where(gte(activities.timestamp, startDate));
    }
    
    if (userId) {
      query = query.where(eq(activities.userId, userId));
    }
    
    return await query;
  },

  async getActivityByDay(timeRange?: string, userId?: number): Promise<{ day: string; count: number }[]> {
    let startDate: Date | undefined;
    const now = new Date();
    
    if (timeRange === 'week') {
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeRange === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    let query = db.select({
      day: sql<string>`to_char(${activities.timestamp}, 'Day')`,
      count: sql<number>`count(${activities.id})`
    })
    .from(activities)
    .groupBy(sql`to_char(${activities.timestamp}, 'Day')`);
    
    if (startDate) {
      query = query.where(gte(activities.timestamp, startDate));
    }
    
    if (userId) {
      query = query.where(eq(activities.userId, userId));
    }
    
    return await query;
  },

  async getActivityByTime(timeRange?: string, userId?: number): Promise<{ hour: string; count: number }[]> {
    let startDate: Date | undefined;
    const now = new Date();
    
    if (timeRange === 'week') {
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeRange === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    let query = db.select({
      hour: sql<string>`to_char(${activities.timestamp}, 'HH24:00')`,
      count: sql<number>`count(${activities.id})`
    })
    .from(activities)
    .groupBy(sql`to_char(${activities.timestamp}, 'HH24:00')`);
    
    if (startDate) {
      query = query.where(gte(activities.timestamp, startDate));
    }
    
    if (userId) {
      query = query.where(eq(activities.userId, userId));
    }
    
    return await query;
  },

  async getFrequentTags(timeRange?: string, userId?: number): Promise<{ tag: string; count: number }[]> {
    let startDate: Date | undefined;
    const now = new Date();
    
    if (timeRange === 'week') {
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeRange === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    let baseQuery = db
      .select({
        activityId: activityTags.activityId
      })
      .from(activityTags)
      .innerJoin(activities, eq(activityTags.activityId, activities.id));
    
    if (startDate) {
      baseQuery = baseQuery.where(gte(activities.timestamp, startDate));
    }
    
    if (userId) {
      baseQuery = baseQuery.where(eq(activities.userId, userId));
    }

    const query = db
      .select({
        tag: tags.name,
        count: sql<number>`count(${activityTags.id})`
      })
      .from(activityTags)
      .innerJoin(tags, eq(activityTags.tagId, tags.id))
      .where(sql`${activityTags.activityId} IN (${baseQuery})`)
      .groupBy(tags.name)
      .orderBy(sql`count(${activityTags.id}) DESC`);
    
    return await query;
  }
};

// Helper functions
function or(...conditions: unknown[]): unknown {
  return sql`(${conditions.join(' OR ')})`;
}
