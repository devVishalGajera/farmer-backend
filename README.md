# Farmer Advisory Platform - Backend API

Backend API service for the Farmer Advisory Platform built with ExpressJS, Prisma, and PostgreSQL.

## Tech Stack

- **Framework**: ExpressJS
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (Access + Refresh Tokens)
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v20.10.0 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   - Copy `env.example` to `.env`
   - Update the values according to your setup

3. **Set up database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database with initial data

## API Documentation

Once the server is running, Swagger documentation will be available at:
- http://localhost:3000/api/docs

## Project Structure

```
src/
├── config/          # Configuration files
├── database/        # Database connection and Prisma client
├── common/          # Shared utilities, DTOs, guards, etc.
├── modules/         # Feature modules (auth, users, crops, etc.)
└── main.ts          # Application entry point
```

## API Versioning

All APIs are versioned:
- `/api/v1/...`

## License

ISC

