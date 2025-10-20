// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator, varchar } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `mario-extended_${name}`);

export const apiKeys = createTable("api_keys", (d) => ({
  id: d.text("id").primaryKey(),
  userId: d.varchar("user_id", { length: 255 }).notNull(),
  name: d.varchar({ length: 256 }).notNull(),
  hashedKey: d.text("hashed_key").notNull(),
  last4: d.varchar("last4", { length: 4 }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  revoked: d.boolean("revoked").notNull().default(false),
}));

export const gameItems = createTable("game_items", (d) => ({
  id: d.serial("id").primaryKey(),
  name: d.varchar("name", { length: 100 }).notNull(),
  category: d.varchar("category", { length: 50 }).notNull(), // e.g. "Character" or "Power-up"
  type: d.varchar("type", { length: 50 }).default("Generic").notNull(),
  power: d.varchar("power", { length: 100 }), // for characters
  effect: d.varchar("effect", { length: 255 }), // for power-ups
  rarity: d.varchar("rarity", { length: 50 }).default("Common"),
  description: d.text("description"),
  imageUrl: d.varchar("image_url", { length: 512 }),
  userId: d.varchar("user_id", { length: 64 }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  fileName: d.varchar({ length: 256 }),
}));