import {
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const problems = mysqlTable("problems", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  slug: varchar("slug", { length: 256 }).unique(),
  category: varchar("category", { length: 256 }),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]),
  leetcode_url: varchar("leetcode_url", { length: 256 }),
  youtube_url: varchar("youtube_url", { length: 256 }),
  github_url: varchar("github_url", { length: 256 }),
  neetcode_url: varchar("neetcode_url", { length: 256 }),
  notes: text("notes"),
  solution: text("solution"),
});
