# Overview

This is a full-stack e-commerce application built with React frontend and Express backend. The application provides a complete shopping experience with authentication, product browsing, shopping cart functionality, and secure payment processing. The project uses a monorepo structure with shared TypeScript types and implements modern web development practices with shadcn/ui components, TanStack Query for data management, and Drizzle ORM for database operations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React and TypeScript, using Vite as the build tool. The application follows a component-based architecture with:
- **Routing**: wouter for client-side routing with authentication-based route protection
- **State Management**: React Context API for cart state management and TanStack Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Authentication**: Session-based authentication with automatic redirects for unauthorized users

## Backend Architecture
The server is built with Express.js and follows a layered architecture:
- **Database Layer**: Drizzle ORM with PostgreSQL using Neon serverless database
- **Route Handlers**: RESTful API endpoints for products, orders, authentication, and payments
- **Storage Abstraction**: Interface-based storage layer for database operations
- **Payment Processing**: Custom payment service with RSA encryption for card data security
- **Authentication**: Replit OIDC integration with session management using PostgreSQL session store

## Database Schema
The application uses PostgreSQL with the following main entities:
- **Users**: Stores user profile information (required for Replit Auth)
- **Products**: Product catalog with pricing, descriptions, and features
- **Orders**: Order management with status tracking
- **Order Items**: Individual items within orders
- **Sessions**: Session storage table (required for authentication)

## Key Design Patterns
- **Separation of Concerns**: Clear separation between frontend components, backend services, and data access
- **Type Safety**: Shared TypeScript schemas between frontend and backend using Zod
- **Component Composition**: Reusable UI components with consistent styling and behavior
- **Error Handling**: Centralized error handling with user-friendly toast notifications
- **Security**: RSA encryption for payment data and session-based authentication

# External Dependencies

## Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Replit Deployment**: Hosted on Replit with development tooling integration

## Authentication
- **Replit Auth**: OIDC-based authentication system integrated with Replit's user management
- **OpenID Client**: For handling OAuth flows and token management
- **Passport.js**: Authentication middleware for Express

## UI and Styling
- **Radix UI**: Headless UI components for accessibility and keyboard navigation
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide Icons**: Consistent icon system throughout the application
- **Inter Font**: Modern typography via Google Fonts

## Data Management
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema definition

## Security and Payments
- **NodeRSA**: RSA encryption for secure payment card data handling
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple

## Development Tools
- **TypeScript**: Static typing across the entire stack
- **Vite**: Fast development server with hot module replacement
- **ESBuild**: Fast bundling for production builds
- **Drizzle Kit**: Database migration and schema management tools