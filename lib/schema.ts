import { int, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const problems = mysqlTable("problems", {
  id: int("id").primaryKey().autoincrement(),
  categoryId: int("category_id").references(() => categories.id),
  name: varchar("name", { length: 255 }),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  difficulty: int("difficulty"),
  leetcodeUrl: varchar("leetcode_url", { length: 255 }),
  youtubeUrl: varchar("youtube_url", { length: 255 }),
  neetcodeUrl: varchar("neetcode_url", { length: 255 }),
  solution: text("solution"),
  notes: text("notes"),
  neetcodeNotes: text("neetcode_notes"),
});

export const categories = mysqlTable("categories", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).unique(),
  position: int("position"),
});

export const lists = mysqlTable("lists", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
});

export const problems_to_lists = mysqlTable("problems_to_lists", {
  problemId: int("problem_id")
    .notNull()
    .references(() => problems.id),
  listId: int("list_id")
    .notNull()
    .references(() => lists.id),
});
