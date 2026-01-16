# React + Supabase + Drizzle ORM

This project demonstrates how to connect a React application with Supabase and use Drizzle ORM for database operations.

## Features

- **Supabase Integration**: Authentication and real-time database
- **Drizzle ORM**: Type-safe database operations
- **PostgreSQL**: Robust database backend
- **TypeScript**: Full type safety
- **Vite**: Fast development and building

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and anon key
3. Go to Settings → Database to get your database password

### 3. Environment Variables

Update `.env.local` with your Supabase credentials:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Database Configuration (for Drizzle)
DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres
```

### 4. Database Schema

Generate and push your database schema:

```bash
# Generate migration files
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Development

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Project Structure

```
src/
├── lib/
│   ├── db.ts          # Drizzle database client
│   ├── schema.ts      # Database schema definitions
│   └── supabase.ts    # Supabase client
└── App.tsx            # Main app component
```
