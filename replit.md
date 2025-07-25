# Cultural Compass - AI-Powered Life Navigator

## Overview

Cultural Compass is a comprehensive web application that serves as an AI-powered life navigator, providing personalized guidance for career, lifestyle, and cultural decisions. The application leverages cultural intelligence through the Qloo Taste AI™ API, combined with modern web technologies to deliver a sophisticated user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript throughout the entire stack
- **API Pattern**: RESTful API with JSON responses
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon Database serverless driver
- **Session Management**: PostgreSQL-based session storage

### Database Design
- **Primary Database**: PostgreSQL configured for serverless deployment
- **Schema Location**: Centralized in `shared/schema.ts` for type sharing
- **Migration Strategy**: Drizzle Kit for schema migrations
- **Storage Pattern**: In-memory storage implementation with interface for easy database swapping

## Key Components

### Authentication System
- User registration and management
- Session-based authentication
- User profile management with cultural preferences

### Cultural Intelligence Engine
- **Qloo API Integration**: Leverages Qloo Taste AI™ for cultural recommendations
- **Cultural Profiling**: Tracks user interests, values, and preference tags
- **Archetype System**: Categorizes users into cultural archetypes (e.g., "Conscious Explorer")
- **Experience Tracking**: Records and analyzes cultural experiences with ratings and match percentages

### AI Agent System
- **Multi-Agent Architecture**: Specialized agents for different life domains
  - Career Navigator: Professional development guidance
  - Lifestyle Guide: Ethical consumption recommendations
  - Travel Companion: Cultural travel experiences
  - Wellness Coach: Holistic well-being support
- **Chat Interface**: Interactive conversations with specialized AI agents
- **Session Management**: Persistent chat sessions per agent type

### Cultural GPS Feature
- Location-based cultural discovery
- Experience categorization and filtering
- Real-time recommendations based on user preferences
- Integration with Qloo's cultural database

### Analytics Dashboard
- Cultural alignment scoring
- Experience tracking and satisfaction metrics
- Domain-specific analytics breakdown
- Activity trend visualization

## Data Flow

1. **User Input**: Users interact through React components
2. **API Requests**: Frontend makes requests to Express.js backend
3. **Data Processing**: Backend processes requests using Drizzle ORM
4. **External Integration**: Qloo API calls for cultural intelligence
5. **Database Operations**: PostgreSQL operations through Drizzle
6. **Response Handling**: JSON responses sent back to frontend
7. **State Updates**: TanStack Query manages client-side state updates

## External Dependencies

### Third-Party Services
- **Qloo Taste AI™**: Primary cultural intelligence provider
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit**: Development and hosting platform integration

### Key Libraries
- **UI Framework**: React 18 with TypeScript
- **Component Library**: Radix UI primitives with shadcn/ui
- **Styling**: Tailwind CSS with custom design system
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for runtime type validation
- **HTTP Client**: Native fetch with TanStack Query

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite development server with HMR
- **Error Handling**: Runtime error overlay for development
- **Logging**: Structured logging for API requests and responses

### Production Build
- **Frontend**: Static build optimized by Vite
- **Backend**: ESBuild compilation for Node.js deployment
- **Database**: Automated schema migrations via Drizzle Kit
- **Environment**: Environment variable configuration for API keys and database URLs

### Hosting Architecture
- **Monorepo Structure**: Single repository with client/server separation
- **Asset Management**: Static asset serving through Express
- **Error Boundaries**: Comprehensive error handling at component and API levels

The application follows a privacy-first approach, particularly important for the sensitive cultural and personal data being processed, aligning with Qloo's privacy-preserving data practices.