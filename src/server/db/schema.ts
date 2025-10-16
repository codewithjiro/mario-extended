// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

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

export const characters = createTable(
  "characters",
  (d) => ({
    id: d.serial("id").primaryKey(),
    name: d.varchar("name", { length: 50 }).notNull(),
    type: d.varchar("type", { length: 20 }).notNull(), // Hero / Enemy
    power: d.varchar("power", { length: 50 }).notNull(),
    description: d.text("description"),
    imageUrl: d.varchar("image_url", { length: 512 }),
  }),
);

export const powerups = createTable(
  "powerups",
  (d) => ({
    id: d.serial("id").primaryKey(),
    name: d.varchar("name", { length: 50 }).notNull(),
    effect: d.text("effect"),
    rarity: d.varchar("rarity", { length: 20 }),
    imageUrl: d.varchar("image_url", { length: 512 }),
  }),
);