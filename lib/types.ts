import {
  category,
  problems,
  solutions,
  users,
  problem_list,
  problem_to_list,
} from "./schema";

export type ProblemDB = typeof problems.$inferSelect;
export type CategoryDB = typeof category.$inferSelect;
export type UserDB = typeof users.$inferSelect;
export type SolutionDB = typeof solutions.$inferSelect;
export type ProblemListDB = typeof problem_list.$inferSelect;
export type ProblemToListDB = typeof problem_to_list.$inferSelect;

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
