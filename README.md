# MemoryLens: Personal AI Search & Activity Timeline

<p align="center">
  <img src="generated-icon.png" alt="MemoryLens Logo" width="200" height="200">
</p>

## 🔍 Overview

MemoryLens is a personal AI-assisted search and activity management tool that provides a unified interface to search, visualize, and analyze your digital activities across multiple data sources. With MemoryLens, you can effortlessly track and search through your entire digital life - from browser history to emails, files, chats, and more.

## ✨ Features

- **Unified Search**: Search across all your digital activities with powerful filtering
- **Timeline View**: Chronological view of your digital life with detail on-demand
- **AI Assistant**: Ask questions about your activities - "What was I working on last Tuesday?"
- **Data Source Integration**: Connect multiple data sources (browser history, emails, chat logs, etc.)
- **Analytics & Insights**: Visualize your activity patterns and get actionable insights
- **Tagging System**: Organize activities with a flexible tagging system

## 📋 Requirements

- Node.js v18+
- PostgreSQL 12+
- Modern web browser

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/memorylens.git
cd memorylens
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
```

Replace with your actual PostgreSQL credentials.

### 4. Set up the database

```bash
# Create and update the database schema
npm run db:push

# Seed the database with initial data
npm run db:seed
```

### 5. Start the development server

```bash
npm run dev
```

### 6. Access the application

Open your browser and navigate to http://localhost:5000

## 🏗️ Project Structure

```
├── client/             # Frontend React application
│   ├── src/            # Source code
│   │   ├── components/ # UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   ├── pages/      # Page components
│   │   └── App.tsx     # Main application component
├── db/                 # Database configuration
│   ├── index.ts        # Database connection
│   └── seed.ts         # Database seeding
├── server/             # Backend Express server
│   ├── index.ts        # Server setup
│   ├── routes.ts       # API routes
│   └── vite.ts         # Vite server config
├── shared/             # Code shared between frontend and backend
│   └── schema.ts       # Database schema definitions
└── ...                 # Configuration files
```

## 📝 API Endpoints

- `GET /api/datasources` - Get all data sources
- `GET /api/activities/recent` - Get recent activities
- `GET /api/timeline` - Get timeline items with optional filtering
- `GET /api/ai/conversation` - Get AI conversation history
- `POST /api/search` - Search across all activities
- `GET /api/insights` - Get activity insights and analytics

## 🧩 Customization

### Adding a New Data Source

1. Add the new data source type in the database schema (`shared/schema.ts`)
2. Implement the connector logic in the backend
3. Add the UI components for the new data source

### Modifying the Database Schema

1. Update the table definitions in `shared/schema.ts`
2. Run `npm run db:push` to update the database

### Styling

The project uses Tailwind CSS with ShadCN UI components. To customize the theme:

1. Modify the colors in `tailwind.config.ts`
2. Update the CSS variables in `client/src/index.css`

## 🔧 Development

### Frontend Development

- The frontend is built with React, TypeScript, and Vite
- Components use ShadCN UI (based on Radix UI primitives)
- State management uses React Query for server state

### Backend Development

- The backend is built with Express.js and TypeScript
- Database operations use Drizzle ORM
- API endpoints follow RESTful conventions

## 🚢 Deployment

### Production Build

```bash
npm run build
```

This will create a production build of both the frontend and backend.

### Starting Production Server

```bash
npm start
```

### Deployment Options

#### Deploying to Replit

1. Import the repository to Replit
2. Set up the environment variables in Replit's Secrets tab
3. Run the application

#### Deploying to Railway/Render

1. Connect your GitHub repository
2. Configure environment variables
3. Set build command: `npm run build`
4. Set start command: `npm start`

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure everything works
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Coding Standards

- Follow the existing code style
- Write meaningful commit messages
- Document new features or API changes
- Add tests for new functionality

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express.js](https://expressjs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)
- [PostgreSQL](https://www.postgresql.org/)

---

<p align="center">Made with ❤️ for keeping your digital life organized</p>
