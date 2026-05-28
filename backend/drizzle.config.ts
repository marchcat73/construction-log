import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
  // Настройки для pg_trgm и других расширений
  migrations: {
    schema: 'public',
  },
  // Включаем строгую типизацию
  strict: true,
});
