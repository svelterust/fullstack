import { sql, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Tables
export const userTable = sqliteTable("user", {
  id: integer().primaryKey(),
  email: text().unique().notNull(),
  method: text().notNull().$type<"password" | "google">(),
  data: text().notNull(),
  customerId: text(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const sessionTable = sqliteTable("session", {
  id: text().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Types
export type User = Omit<InferSelectModel<typeof userTable>, "data">;
export type Session = InferSelectModel<typeof sessionTable>;
