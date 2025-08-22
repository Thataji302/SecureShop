import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as sqliteDrizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import ws from "ws";
import { nanoid } from 'nanoid';

// Import schemas based on environment
import * as pgSchema from "@shared/schema";
import * as sqliteSchema from "@shared/schema-sqlite";

// Check if running in local development (no DATABASE_URL)
const isLocal = !process.env.DATABASE_URL;

let db: any;
let pool: Pool | null = null;

if (isLocal) {
  // Use SQLite for local development
  console.log('🔧 Using SQLite database for local development');
  const sqlite = new Database('./local.db');
  
  // Enable foreign keys for SQLite
  sqlite.exec('PRAGMA foreign_keys = ON;');
  
  db = sqliteDrizzle({ client: sqlite, schema: sqliteSchema });
} else {
  // Use Neon PostgreSQL for production
  console.log('🚀 Using PostgreSQL database for production');
  neonConfig.webSocketConstructor = ws;
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema: pgSchema });
}

export { db, pool };

// Utility function to generate IDs for local development
export const generateId = () => nanoid();