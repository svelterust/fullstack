import * as schema from "$lib/schema";
import { Database } from "bun:sqlite";
import { env } from "$env/dynamic/private";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

// Create database
const sqlite = new Database(env.DATABASE_URL ?? "database.db");
export const db = drizzle(sqlite, { schema });

// Optimize database and run migrations
db.run(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA busy_timeout = 5000;
    PRAGMA cache_size = 1000000000;
    PRAGMA foreign_keys = true;
    PRAGMA temp_store = memory;
`);
migrate(db, { migrationsFolder: "migrations" });
