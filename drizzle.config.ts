import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://postgres.rjxvsqvpjbqiuvvjzxex:Password-test@A123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres",
  },
});