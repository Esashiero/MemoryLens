import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertActivitySchema, insertAiMessageSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix for all routes
  const apiPrefix = "/api";

  // Create a default user if none exists (for demo purposes)
  app.get(`${apiPrefix}/init`, async (req, res) => {
    try {
      const existingUser = await storage.getUserByUsername("john.doe");
      
      if (!existingUser) {
        const userData = {
          username: "john.doe",
          password: "password123" // In a real app, this would be hashed
        };
        
        const user = await storage.insertUser(userData);
        res.status(200).json({ message: "Default user created", user });
      } else {
        res.status(200).json({ message: "Default user already exists", user: existingUser });
      }
    } catch (error) {
      console.error("Error initializing user:", error);
      res.status(500).json({ message: "Error initializing user" });
    }
  });

  // Get all data sources
  app.get(`${apiPrefix}/datasources`, async (req, res) => {
    try {
      const sources = await storage.getDataSources();
      res.status(200).json(sources);
    } catch (error) {
      console.error("Error fetching data sources:", error);
      res.status(500).json({ message: "Error fetching data sources" });
    }
  });

  // Get recent activities
  app.get(`${apiPrefix}/activities/recent`, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getRecentActivities(limit);
      res.status(200).json(activities);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      res.status(500).json({ message: "Error fetching recent activities" });
    }
  });

  // Create a new activity
  app.post(`${apiPrefix}/activities`, async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.insertActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating activity:", error);
      res.status(500).json({ message: "Error creating activity" });
    }
  });

  // Get timeline data with optional filtering
  app.get(`${apiPrefix}/timeline`, async (req, res) => {
    try {
      const filter = req.query.filter as string | undefined;
      const sources = req.query.sources as string | undefined;
      const sourceArray = sources ? sources.split(',') : undefined;
      
      const timelineItems = await storage.getTimelineItems(filter, sourceArray);
      res.status(200).json(timelineItems);
    } catch (error) {
      console.error("Error fetching timeline:", error);
      res.status(500).json({ message: "Error fetching timeline" });
    }
  });

  // Get AI conversation history
  app.get(`${apiPrefix}/ai/conversation`, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const messages = await storage.getConversationHistory(limit);
      
      // Add hypothetical action buttons for the assistant messages
      const messagesWithActions = messages.map(message => {
        if (message.role === 'assistant') {
          return {
            ...message,
            actions: [
              { icon: 'schedule', label: 'Show Timeline' },
              { icon: 'file_present', label: 'Show Files' }
            ]
          };
        }
        return message;
      });
      
      res.status(200).json(messagesWithActions);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Error fetching conversation" });
    }
  });

  // Submit a question to the AI assistant
  app.post(`${apiPrefix}/ai/question`, async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question) {
        return res.status(400).json({ message: "Question is required" });
      }
      
      // Save the user's question
      const userMessage = await storage.insertAiMessage({
        role: 'user',
        content: question,
        timestamp: new Date()
      });
      
      // Generate a response (in a real app, this would call an AI model)
      const responseContent = generateAiResponse(question);
      
      // Save the AI's response
      const aiResponse = await storage.insertAiMessage({
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      });
      
      res.status(200).json({
        userMessage,
        aiResponse: {
          ...aiResponse,
          actions: [
            { icon: 'schedule', label: 'Show Timeline' },
            { icon: 'file_present', label: 'Show Files' }
          ]
        }
      });
    } catch (error) {
      console.error("Error processing AI question:", error);
      res.status(500).json({ message: "Error processing AI question" });
    }
  });

  // Search across activities
  app.get(`${apiPrefix}/search`, async (req, res) => {
    try {
      const query = req.query.query as string;
      const source = req.query.source as string;
      const dateRange = req.query.dateRange as string;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      // Save the search query for analytics
      await storage.saveSearchQuery({
        query,
        timestamp: new Date()
      });
      
      const results = await storage.searchActivities(query, source, dateRange);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error performing search:", error);
      res.status(500).json({ message: "Error performing search" });
    }
  });

  // Post a new search query
  app.post(`${apiPrefix}/search`, async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      // Save the search query for analytics
      await storage.saveSearchQuery({
        query,
        timestamp: new Date()
      });
      
      res.status(200).json({ message: "Search query saved" });
    } catch (error) {
      console.error("Error saving search query:", error);
      res.status(500).json({ message: "Error saving search query" });
    }
  });

  // Get insights/analytics data
  app.get(`${apiPrefix}/insights`, async (req, res) => {
    try {
      const range = req.query.range as string | undefined;
      
      const [
        activityBySource,
        activityByDay,
        topSearches,
        frequentTags,
        activityByTime
      ] = await Promise.all([
        storage.getActivityBySource(range),
        storage.getActivityByDay(range),
        storage.getTopSearchQueries(5),
        storage.getFrequentTags(range),
        storage.getActivityByTime(range)
      ]);
      
      res.status(200).json({
        activityBySource,
        activityByDay,
        topSearches,
        frequentTags,
        activityByTime
      });
    } catch (error) {
      console.error("Error fetching insights:", error);
      res.status(500).json({ message: "Error fetching insights" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to generate a simple AI response (in a real app, this would call an LLM)
function generateAiResponse(question: string): string {
  const lowercaseQuestion = question.toLowerCase();
  
  if (lowercaseQuestion.includes("tuesday") || lowercaseQuestion.includes("last tuesday")) {
    return "Last Tuesday (June 13), you were working on the following projects:\n\n" +
           "1. The Q4 Marketing Strategy presentation (PowerPoint) - You spent 2.5 hours on this in the morning\n" +
           "2. Website redesign feedback - You reviewed design mockups and left comments in Figma\n" +
           "3. Client proposal for Acme Corp - You exchanged several emails with the team\n\n" +
           "You also had a 45-minute video call with the design team at 2:00 PM discussing the new product features.";
  }
  
  if (lowercaseQuestion.includes("yesterday") || lowercaseQuestion.includes("files yesterday")) {
    return "Yesterday, you worked on the following files:\n\n" +
           "1. Q4_Marketing_Strategy.pptx (updated content on slides 5-8)\n" +
           "2. Client_Proposal_Draft.docx (added financial projections)\n" +
           "3. Product_Roadmap_2023.pdf (reviewed and added comments)\n" +
           "4. Budget_Analysis.xlsx (updated Q3 figures)\n\n" +
           "You spent the most time (1.5 hours) on the marketing strategy presentation.";
  }
  
  if (lowercaseQuestion.includes("browser") || lowercaseQuestion.includes("monday")) {
    return "On Monday, your browser history shows visits to:\n\n" +
           "1. docs.google.com (9:15 AM - 10:30 AM)\n" +
           "2. figma.com/design-systems (10:45 AM - 11:30 AM)\n" +
           "3. github.com/yourproject/repo (1:15 PM - 2:45 PM)\n" +
           "4. linkedin.com (3:00 PM - 3:15 PM)\n" +
           "5. calendly.com/schedule (4:30 PM - 4:45 PM)\n\n" +
           "You spent the most time on GitHub, reviewing pull requests and code changes.";
  }
  
  if (lowercaseQuestion.includes("summarize") || lowercaseQuestion.includes("this week")) {
    return "This week's activity summary:\n\n" +
           "• 37 documents accessed across Google Docs, MS Office and PDF files\n" +
           "• 14 meetings attended (8 video calls, 6 in-person)\n" +
           "• 53 emails sent and 78 received\n" +
           "• 12 ChatGPT conversations on work-related topics\n" +
           "• 4 hours spent on design work in Figma\n" +
           "• 8 hours coding in VS Code\n\n" +
           "Your most productive day was Wednesday with 28 completed tasks.";
  }
  
  return "I've analyzed your digital activities based on your question. " +
         "I found several relevant items that might help. Would you like me to provide more specific details or focus on a particular aspect?";
}
