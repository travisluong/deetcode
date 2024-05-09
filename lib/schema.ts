import {
  int,
  mysqlTable,
  text,
  varchar,
  char,
  timestamp,
  unique,
} from "drizzle-orm/mysql-core";

export const problem = mysqlTable("problem", {
  id: char("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  category_id: char("category_id", { length: 36 }).references(
    () => category.id
  ),
  name: varchar("name", { length: 255 }),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  difficulty: int("difficulty"),
  leetcode_url: varchar("leetcode_url", { length: 255 }),
  youtube_url: varchar("youtube_url", { length: 255 }),
  neetcode_url: varchar("neetcode_url", { length: 255 }),
  solution: text("solution"),
  notes: text("notes"),
  neetcode_notes: text("neetcode_notes"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const category = mysqlTable("category", {
  id: char("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  slug: varchar("slug", { length: 255 }).unique(),
  position: int("position"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const problem_list = mysqlTable("problem_list", {
  id: char("id", { length: 36 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  slug: varchar("slug", { length: 255 }).unique(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const problem_to_list = mysqlTable(
  "problem_to_list",
  {
    problem_id: char("problem_id", { length: 36 })
      .notNull()
      .references(() => problem.id),
    list_id: char("list_id", { length: 36 })
      .notNull()
      .references(() => problem_list.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    unq: unique().on(t.problem_id, t.list_id),
  })
);
