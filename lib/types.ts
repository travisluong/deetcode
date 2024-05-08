import { category, problem } from "./schema";

export type ProblemDB = typeof problem.$inferSelect;
export type CategoryDB = typeof category.$inferSelect;

export type ProblemCategoryRow = {
  problem: ProblemDB;
  category: CategoryDB;
};
