import '../load-env.js';
import { db } from "./index";
import * as schema from "@shared/schema";
import { eq, sql } from "drizzle-orm";

async function seed() {
  try {
    // Test database connection first
    console.log("Testing database connection...");
    const result = await db.execute(sql`SELECT NOW()`);
    console.log("Database connection successful.");
    console.log("Starting database seeding...");

    // 1. Create a default user
    let defaultUser = await db.query.users.findFirst({
      where: eq(schema.users.username, "john.doe")
    });

    if (!defaultUser) {
      console.log("Creating default user...");
      const [user] = await db.insert(schema.users).values({
        username: "john.doe",
        password: "password123" // In a real app, this would be hashed
      }).returning();
      defaultUser = user;
      console.log("Default user created with ID:", defaultUser.id);
    } else {
      console.log("Default user already exists with ID:", defaultUser.id);
    }

    // 2. Create data sources
    const dataSourceData = [
      { name: "Browser History", type: "browser", status: "active", lastSync: new Date("2023-06-15 11:45:00"), userId: defaultUser.id },
      { name: "ChatGPT History", type: "chat", status: "active", lastSync: new Date("2023-06-15 09:30:00"), userId: defaultUser.id },
      { name: "Gmail", type: "email", status: "active", lastSync: new Date("2023-06-15 10:15:00"), userId: defaultUser.id },
      { name: "Photos", type: "photos", status: "active", lastSync: new Date("2023-06-14 15:20:00"), userId: defaultUser.id },
      { name: "Local Files", type: "files", status: "active", lastSync: new Date("2023-06-15 11:00:00"), userId: defaultUser.id }
    ];

    // Check if data sources already exist
    const existingDataSources = await db.query.dataSources.findMany();
    if (existingDataSources.length === 0) {
      console.log("Creating data sources...");
      await db.insert(schema.dataSources).values(dataSourceData);
      console.log("Data sources created.");
    } else {
      console.log("Data sources already exist, skipping creation.");
    }

    // 3. Create tags
    const tagData = [
      { name: "Work", userId: defaultUser.id },
      { name: "Research", userId: defaultUser.id },
      { name: "Meeting", userId: defaultUser.id },
      { name: "Design", userId: defaultUser.id },
      { name: "Personal", userId: defaultUser.id },
      { name: "Urgent", userId: defaultUser.id },
      { name: "Important", userId: defaultUser.id },
      { name: "Follow-up", userId: defaultUser.id }
    ];

    // Check if tags already exist
    const existingTags = await db.query.tags.findMany();
    let tags = existingTags;

    if (existingTags.length === 0) {
      console.log("Creating tags...");
      tags = await db.insert(schema.tags).values(tagData).returning();
      console.log("Tags created.");
    } else {
      console.log("Tags already exist, skipping creation.");
    }

    // Helper to find tag ID by name
    const findTagId = (name: string) => {
      const tag = tags.find(t => t.name === name);
      return tag ? tag.id : null;
    };

    // 4. Create activities
    const activityData = [
      {
        title: "Project Proposal Draft",
        description: "Edited the Q4 product roadmap document in Google Docs",
        source: "Google Docs",
        sourceId: "doc123",
        timestamp: new Date("2023-06-15 10:23:00"),
        userId: defaultUser.id
      },
      {
        title: "ChatGPT Conversation",
        description: "Discussed machine learning algorithms for image classification",
        source: "ChatGPT",
        sourceId: "chat456",
        timestamp: new Date("2023-06-15 09:15:00"),
        userId: defaultUser.id
      },
      {
        title: "Client Meeting Confirmation",
        description: "Email from Sarah about next week's presentation schedule",
        source: "Gmail",
        sourceId: "email789",
        timestamp: new Date("2023-06-14 16:32:00"),
        userId: defaultUser.id
      },
      {
        title: "Design System Resources",
        description: "Visited Figma documentation for component guidelines",
        source: "Browser",
        sourceId: "browser101",
        timestamp: new Date("2023-06-14 14:45:00"),
        userId: defaultUser.id
      },
      {
        title: "File Activity",
        description: "Created and edited \"Q4 Marketing Strategy.pptx\"",
        source: "PowerPoint",
        sourceId: "file202",
        timestamp: new Date("2023-06-15 10:23:00"),
        userId: defaultUser.id
      },
      {
        title: "ChatGPT Conversation",
        description: "You asked: \"What are the latest trends in machine learning for image recognition?\"",
        source: "ChatGPT",
        sourceId: "chat303",
        timestamp: new Date("2023-06-15 09:15:00"),
        userId: defaultUser.id
      },
      {
        title: "Email Received",
        description: "From: Sarah Johnson (sarah@company.com)\nSubject: Client Meeting Confirmation and Agenda",
        source: "Gmail",
        sourceId: "email404",
        timestamp: new Date("2023-06-14 16:32:00"),
        userId: defaultUser.id
      },
      {
        title: "Web Browsing",
        description: "Visited: figma.com/design-systems and 3 related pages",
        source: "Chrome",
        sourceId: "browser505",
        timestamp: new Date("2023-06-14 14:45:00"),
        userId: defaultUser.id
      },
      {
        title: "Photos Activity",
        description: "Edited and exported product photos (3 items)",
        source: "Photoshop",
        sourceId: "photo606",
        timestamp: new Date("2023-06-14 11:20:00"),
        userId: defaultUser.id
      },
      {
        title: "Budget Review",
        description: "Updated Q2 financial projections in spreadsheet",
        source: "Excel",
        sourceId: "file707",
        timestamp: new Date("2023-06-13 15:10:00"),
        userId: defaultUser.id
      },
      {
        title: "Team Slack Discussion",
        description: "Discussed project timeline and milestones with development team",
        source: "Slack",
        sourceId: "chat808",
        timestamp: new Date("2023-06-13 13:45:00"),
        userId: defaultUser.id
      },
      {
        title: "Customer Feedback Review",
        description: "Analyzed customer survey responses for product improvements",
        source: "Google Forms",
        sourceId: "file909",
        timestamp: new Date("2023-06-13 10:30:00"),
        userId: defaultUser.id
      }
    ];

    // Check if activities already exist
    const existingActivities = await db.query.activities.findMany();
    let activities = existingActivities;

    if (existingActivities.length === 0) {
      console.log("Creating activities...");
      activities = await db.insert(schema.activities).values(activityData).returning();
      console.log("Activities created.");
    } else {
      console.log("Activities already exist, skipping creation.");
    }

    // 5. Create activity-tag associations if they don't exist
    const activityTagRelations = [
      { activityTitle: "Project Proposal Draft", tagName: "Work" },
      { activityTitle: "ChatGPT Conversation", tagName: "Research" },
      { activityTitle: "Client Meeting Confirmation", tagName: "Meeting" },
      { activityTitle: "Design System Resources", tagName: "Design" },
      { activityTitle: "File Activity", tagName: "Work" },
      { activityTitle: "Email Received", tagName: "Meeting" },
      { activityTitle: "Web Browsing", tagName: "Design" },
      { activityTitle: "Photos Activity", tagName: "Work" },
      { activityTitle: "Budget Review", tagName: "Work" },
      { activityTitle: "Team Slack Discussion", tagName: "Meeting" },
      { activityTitle: "Customer Feedback Review", tagName: "Research" }
    ];

    console.log("Creating activity-tag associations...");
    for (const relation of activityTagRelations) {
      const activity = activities.find(a => a.title === relation.activityTitle);
      const tagId = findTagId(relation.tagName);
      
      if (activity && tagId) {
        // Check if this association already exists
        const existingRelation = await db.query.activityTags.findFirst({
          where: eq(schema.activityTags.activityId, activity.id)
        });
        
        if (!existingRelation) {
          await db.insert(schema.activityTags).values({
            activityId: activity.id,
            tagId: tagId
          });
        }
      }
    }
    console.log("Activity-tag associations created.");

    // 6. Create AI conversation
    const conversationData = [
      {
        role: "user",
        content: "What projects was I working on last Tuesday?",
        timestamp: new Date("2023-06-15 14:30:00"),
        userId: defaultUser.id
      },
      {
        role: "assistant",
        content: "Last Tuesday (June 13), you were working on the following projects:\n\n1. The Q4 Marketing Strategy presentation (PowerPoint) - You spent 2.5 hours on this in the morning\n2. Website redesign feedback - You reviewed design mockups and left comments in Figma\n3. Client proposal for Acme Corp - You exchanged several emails with the team\n\nYou also had a 45-minute video call with the design team at 2:00 PM discussing the new product features.",
        timestamp: new Date("2023-06-15 14:30:05"),
        userId: defaultUser.id
      }
    ];

    // Check if conversation messages already exist
    const existingMessages = await db.query.aiMessages.findMany();
    
    if (existingMessages.length === 0) {
      console.log("Creating AI conversation...");
      await db.insert(schema.aiMessages).values(conversationData);
      console.log("AI conversation created.");
    } else {
      console.log("AI conversation already exists, skipping creation.");
    }

    // 7. Create search queries
    const searchQueryData = [
      { query: "marketing strategy", timestamp: new Date("2023-06-15 09:10:00"), userId: defaultUser.id },
      { query: "project timeline", timestamp: new Date("2023-06-15 11:25:00"), userId: defaultUser.id },
      { query: "design system", timestamp: new Date("2023-06-14 15:40:00"), userId: defaultUser.id },
      { query: "client meeting", timestamp: new Date("2023-06-14 10:15:00"), userId: defaultUser.id },
      { query: "budget review", timestamp: new Date("2023-06-13 14:30:00"), userId: defaultUser.id },
      { query: "product feedback", timestamp: new Date("2023-06-13 09:45:00"), userId: defaultUser.id },
      { query: "marketing strategy", timestamp: new Date("2023-06-12 16:20:00"), userId: defaultUser.id },
      { query: "design system", timestamp: new Date("2023-06-12 13:10:00"), userId: defaultUser.id },
      { query: "client meeting", timestamp: new Date("2023-06-11 11:30:00"), userId: defaultUser.id },
      { query: "product roadmap", timestamp: new Date("2023-06-11 10:05:00"), userId: defaultUser.id }
    ];

    // Check if search queries already exist
    const existingQueries = await db.query.searchQueries.findMany();
    
    if (existingQueries.length === 0) {
      console.log("Creating search queries...");
      await db.insert(schema.searchQueries).values(searchQueryData);
      console.log("Search queries created.");
    } else {
      console.log("Search queries already exist, skipping creation.");
    }

    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
