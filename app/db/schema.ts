import { sql } from "drizzle-orm";
import {
  check,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

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

export const strengthsEntries = sqliteTable("strengths_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  strength: text("strength").notNull(),
  reflection: text("reflection"),
  displayName: text("display_name").notNull().default("Anonymous"),
  countryCode: text("country_code"),
  ownerTokenHash: text("owner_token_hash"),
  status: text("status", { enum: ["pending", "approved", "rejected"] })
    .notNull()
    .default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  approvedAt: text("approved_at"),
});

export const homepageCheckins = sqliteTable("homepage_checkins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  displayName: text("display_name").notNull().default("Anonymous"),
  countryCode: text("country_code"),
  ownerTokenHash: text("owner_token_hash"),
  status: text("status", { enum: ["pending", "approved", "rejected"] })
    .notNull()
    .default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  approvedAt: text("approved_at"),
}, (table) => ({
  ratingRange: check(
    "homepage_checkins_rating_range",
    sql`${table.rating} BETWEEN 1 AND 10`
  ),
}));

export const liveAdventureInterests = sqliteTable(
  "live_adventure_interests",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    emailUnique: uniqueIndex("live_adventure_interests_email_unique").on(
      table.email
    ),
  })
);
