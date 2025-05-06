# Architecture Overview

## Overview

This repository contains a full-stack web application designed as a personal data management and AI-assisted search tool. The application allows users to connect various data sources (browser history, chat logs, files, emails, etc.), view their digital activity timeline, search across all data sources, and get AI-powered insights from their personal data.

The system follows a modern web architecture with a clear separation between frontend and backend components, using a RESTful API for communication and PostgreSQL for data persistence.

## System Architecture

The application follows a client-server architecture with these main components:

1. **Frontend**: React-based single-page application (SPA)
2. **Backend**: Express.js API server
3. **Database**: PostgreSQL database (via Neon serverless)
4. **ORM Layer**: Drizzle ORM for type-safe database interactions
5. **State Management**: React Query for client-side data fetching and caching

### Architecture Diagram

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend │      │  Express Server │      │  PostgreSQL DB  │
│  (Vite + ShadCN)│<─────│  (REST API)     │<─────│  (Neon)         │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        ▲                        ▲                        ▲
        │                        │                        │
        └───────────┬────────────┘                        │
                    │                                     │
             REST API Calls                               │
                                                          │
┌─────────────────┐                                       │
│                 │                                       │
│  External Data  │                                       │
│  Sources        │───────────────────────────────────────┘
│                 │
└─────────────────┘
```

## Key Components

### Frontend Architecture

1. **UI Framework**: React with TypeScript
2. **Build Tool**: Vite
3. **Component Library**: ShadCN UI (with Radix UI primitives)
4. **Styling**: Tailwind CSS
5. **Routing**: Wouter (lightweight alternative to React Router)
6. **State Management**: React Query for server state
7. **Theme System**: Light/dark mode with CSS variables

The frontend is organized into:
- Pages (Dashboard, Search, Timeline, Insights)
- Reusable UI components
- Context providers for shared state (theme, etc.)
- Custom hooks for business logic

### Backend Architecture

1. **Server Framework**: Express.js with TypeScript
2. **API Style**: RESTful API
3. **Database ORM**: Drizzle ORM
4. **Authentication**: Session-based (via express-session)
5. **Environment Variables**: dotenv for configuration

The backend is organized into:
- Express routes for API endpoints
- Storage service for database interactions
- Schema definitions (shared with frontend)
- Middleware for logging, error handling, etc.

### Database Schema

The database schema is defined using Drizzle ORM with the following key entities:

1. **Users**: Authentication and user management
2. **Data Sources**: External data services connected to the application
3. **Activities**: User activities collected from various sources
4. **Tags**: Categorization system for activities
5. **AI Messages**: Storage for conversational AI interactions
6. **Search Queries**: History of user searches

The schema is designed to support the core functionality of tracking user activities across multiple data sources and enabling powerful search and analysis capabilities.

## Data Flow

### Main Data Flows

1. **Authentication Flow**:
   - User credentials are submitted to the backend
   - Backend validates credentials and creates a session
   - Session ID is stored in a cookie on the client

2. **Data Collection Flow**:
   - External data sources connect through the backend
   - Activities are normalized and stored in the database
   - Activities are tagged and indexed for search

3. **Search Flow**:
   - User submits a search query
   - Backend searches across activities from all data sources
   - Results are returned to the frontend for display

4. **AI Assistant Flow**:
   - User sends a question to the AI assistant
   - Backend processes the question with context from user's data
   - AI response is stored and displayed to the user

## External Dependencies

### Frontend Dependencies

- **@radix-ui/**: Accessibility-focused UI primitives
- **@tanstack/react-query**: Data fetching and caching
- **class-variance-authority**: Component variant management
- **clsx/tailwind-merge**: CSS class composition utilities
- **wouter**: Lightweight routing library
- **date-fns**: Date manipulation utilities
- **recharts**: Chart visualization library

### Backend Dependencies

- **express**: Web server framework
- **@neondatabase/serverless**: PostgreSQL client for Neon database
- **drizzle-orm**: Type-safe ORM for database interactions
- **drizzle-zod**: Schema validation integration
- **zod**: Runtime type checking and validation
- **dotenv**: Environment variable management

## Deployment Strategy

The application is configured for deployment on Replit, with specific configuration for:

1. **Build Process**:
   - Frontend: Vite builds the React application to static assets
   - Backend: esbuild bundles the server code for production

2. **Runtime Environment**:
   - Node.js 20.x
   - PostgreSQL 16 (via Neon serverless)

3. **Environment Configuration**:
   - Environment variables for database connection, API keys, etc.
   - Production mode toggle via NODE_ENV

4. **Database Management**:
   - Migration system via Drizzle Kit
   - Seed script for initial data population

The deployment workflow includes:
- Building both frontend and backend
- Configuring port mappings
- Setting up environment variables
- Database migration handling

## Development Practices

1. **TypeScript**: Used throughout the application for type safety
2. **Shared Types**: Schema definitions are shared between frontend and backend
3. **Directory Structure**: Clear separation of concerns with client/server/shared directories
4. **API Design**: RESTful endpoints with consistent response formats
5. **Error Handling**: Centralized error handling middleware on the backend
6. **Logging**: Request logging with response information for debugging

## Future Architecture Considerations

1. **Scaling**:
   - The use of Neon serverless PostgreSQL provides a path for database scaling
   - The Express server can be scaled horizontally behind a load balancer

2. **Security**:
   - The current authentication system could be enhanced with OAuth or JWT
   - Additional rate limiting and request validation may be needed

3. **Performance**:
   - Implement caching for frequently accessed data
   - Add pagination for large result sets
   - Consider server-side rendering for initial page load performance