import { category, problems, solutions, users } from "./schema";

export type ProblemDB = typeof problems.$inferSelect;
export type CategoryDB = typeof category.$inferSelect;
export type UserDB = typeof users.$inferSelect;
export type SolutionDB = typeof solutions.$inferSelect;

export type ProblemCategoryRow = {
  problem: ProblemDB;
  category: CategoryDB;
};

export type ProblemSolutionUserRow = {
  problem: Partial<ProblemDB>;
  solution: Partial<SolutionDB>;
  user: Partial<UserDB>;
};

export type PlaygroundProblem = {
  id: "";
  solution: string;
  default_code: string;
};
