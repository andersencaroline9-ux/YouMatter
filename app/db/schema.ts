import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const gratitudes = sqliteTable("gratitudes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  message: text("message").notNull(),
  displayName: text("display_name").notNull().default("Anonymous"),
  countryCode: text("country_code"),
  submissionId: text("submission_id"),
  ownerTokenHash: text("owner_token_hash"),
  status: text("status", { enum: ["pending", "approved", "rejected"] })
    .notNull()
    .default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  approvedAt: text("approved_at"),
});

export const natureEntries = sqliteTable("nature_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  objectKey: text("object_key").notNull(),
  caption: text("caption").notNull().default(""),
  displayName: text("display_name").notNull().default("Anonymous"),
  ownerTokenHash: text("owner_token_hash"),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  approvedAt: text("approved_at"),
});

export const kindnessEntries = sqliteTable("kindness_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  message: text("message").notNull(),
  kind: text("kind", { enum: ["gave", "received", "witnessed"] }).notNull(),
  displayName: text("display_name").notNull().default("Anonymous"),
  ownerTokenHash: text("owner_token_hash"),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  approvedAt: text("approved_at"),
});
