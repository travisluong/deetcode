import { category, problems } from "./schema";

export type ProblemDB = typeof problems.$inferSelect;
export type CategoryDB = typeof category.$inferSelect;

export type ProblemCategoryRow = {
  problem: ProblemDB;
  category: CategoryDB;
};

export type PlaygroundProblem = {
  solution: string;
};
