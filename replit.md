# MicroLend - Microfinance Platform

## Overview

MicroLend is a comprehensive microfinance platform designed to empower micro-entrepreneurs by providing access to loans, payment tracking, and smart contract integration. The application enables users to request loans, manage repayments, and track their financial journey through an intuitive web interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **State Management**: TanStack Query for server state management
- **Authentication**: Firebase Authentication with Firestore integration
- **Responsive Design**: Mobile-first approach with dedicated mobile navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Structure**: RESTful API with /api prefix routing
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot module replacement with Vite middleware integration

### Database Schema
The application uses a well-structured PostgreSQL schema with three main entities:

1. **Users Table**: Stores user profiles including Firebase UID, personal information, business details, and wallet addresses
2. **Loans Table**: Manages loan applications, approval status, terms, and smart contract addresses
3. **Repayments Table**: Tracks payment schedules, completion status, and transaction hashes

## Key Components

### Authentication System
- Firebase Authentication for user management
- Firestore for user profile storage
- Custom authentication context with React hooks
- Modal-based login/signup flow
- Automatic user session management

### Loan Management
- Loan request modal with form validation
- Loan status tracking (pending, approved, rejected, active, completed)
- Progress visualization for active loans
- Smart contract integration for loan agreements
- Loan history and details view

### Payment System
- Repayment scheduling and tracking
- Multiple payment methods (cryptocurrency and traditional)
- Payment history with transaction hashes
- Automated payment calculations based on income
- Overdue payment notifications

### User Interface
- Dashboard with financial overview
- Responsive navigation (desktop header + mobile bottom nav)
- Toast notifications for user feedback
- Loading states and error handling
- Consistent design system with Tailwind CSS

## Data Flow

1. **User Registration**: Firebase Authentication → Firestore profile creation → Database user record
2. **Loan Application**: Form submission → Firestore loan document → Admin approval workflow
3. **Loan Approval**: Admin action → Smart contract deployment → User notification
4. **Repayment**: Payment processing → Blockchain transaction → Database update → User confirmation
5. **Dashboard Updates**: Real-time data fetching → TanStack Query caching → UI updates

## External Dependencies

### Core Technologies
- **React Ecosystem**: React 18, React DOM, React Query
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Build tool with hot module replacement
- **Express.js**: Backend server framework

### Database & ORM
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle Kit**: Database migrations and schema management

### Authentication & Storage
- **Firebase**: Authentication and Firestore database
- **Firebase Admin**: Server-side Firebase operations

### UI & Styling
- **Shadcn/ui**: Pre-built accessible components
- **Radix UI**: Primitive components for accessibility
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production
- **TSX**: TypeScript execution for development
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with Vite dev server
- **Production**: Compiled Express server with static file serving
- **Database**: Neon Database with connection pooling
- **Environment Variables**: Separate configs for development/production

### Build Process
1. Frontend build with Vite (React → static assets)
2. Backend build with ESBuild (TypeScript → JavaScript)
3. Static file serving through Express
4. Database migrations with Drizzle Kit

### Hosting Setup
- **Platform**: Replit with autoscale deployment
- **Port Configuration**: Internal port 5000, external port 80
- **Static Assets**: Served from dist/public directory
- **Database**: Managed PostgreSQL instance

### Development Workflow
- **Hot Reload**: Vite development server with Express middleware
- **Database Sync**: Drizzle push for schema synchronization
- **Type Safety**: Shared types between frontend/backend
- **Code Quality**: TypeScript strict mode enabled

## Changelog

```
Changelog:
- June 18, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```