import { sql } from "drizzle-orm";
import {
  int,
  mysqlTable,
  text,
  varchar,
  char,
  timestamp,
  unique,
} from "drizzle-orm/mysql-core";

export const problems = mysqlTable("problems", {
  id: char("id", { length: 36 })
    .primaryKey()
    .notNull()
    .default(sql`(uuid())`),
  categoryId: char("category_id", { length: 36 }).references(
    () => categories.id
  ),
  name: varchar("name", { length: 255 }),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  difficulty: int("difficulty"),
  leetcodeUrl: varchar("leetcode_url", { length: 255 }),
  youtubeUrl: varchar("youtube_url", { length: 255 }),
  neetcodeUrl: varchar("neetcode_url", { length: 255 }),
  solution: text("solution"),
  notes: text("notes"),
  neetcodeNotes: text("neetcode_notes"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const categories = mysqlTable("categories", {
  id: char("id", { length: 36 })
    .primaryKey()
    .notNull()
    .default(sql`(uuid())`),
  name: varchar("name", { length: 255 }),
  slug: varchar("slug", { length: 255 }).unique(),
  position: int("position"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const lists = mysqlTable("lists", {
  id: char("id", { length: 36 })
    .primaryKey()
    .notNull()
    .default(sql`(uuid())`),
  name: varchar("name", { length: 255 }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const problems_to_lists = mysqlTable(
  "problems_to_lists",
  {
    problemId: char("problem_id", { length: 36 })
      .notNull()
      .references(() => problems.id),
    listId: char("list_id", { length: 36 })
      .notNull()
      .references(() => lists.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    unq: unique().on(t.problemId, t.listId),
  })
);
