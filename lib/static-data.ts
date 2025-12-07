import {
  ProblemDB,
  CategoryDB,
  ProblemListDB,
  ProblemToListDB,
  ProblemCategoryRow,
} from "./types";
import staticDataJson from "./static-data.json";

interface StaticData {
  problems: ProblemDB[];
  categories: CategoryDB[];
  problemLists: ProblemListDB[];
  problemToList: ProblemToListDB[];
  exportedAt: string;
}

const staticData = staticDataJson as StaticData;

export function getStaticProblem(slug: string): ProblemDB | undefined {
  return staticData.problems.find((problem) => problem.slug === slug);
}

export function getStaticCategory(id: string): CategoryDB | undefined {
  return staticData.categories.find((category) => category.id === id);
}

export function getAllStaticProblems(): ProblemDB[] {
  return staticData.problems;
}

export function getAllStaticCategories(): CategoryDB[] {
  return staticData.categories;
}

export function getStaticDataInfo() {
  return {
    problemCount: staticData.problems.length,
    categoryCount: staticData.categories.length,
    exportedAt: staticData.exportedAt,
  };
}

export function getStaticProblemList(slug: string): ProblemListDB | undefined {
  return staticData.problemLists.find((list) => list.slug === slug);
}

export function getStaticProblemsForList(listId: string): ProblemCategoryRow[] {
  // Get all problem IDs for this list
  const problemIds = staticData.problemToList
    .filter((ptl) => ptl.list_id === listId)
    .map((ptl) => ptl.problem_id);

  // Get problems and their categories
  const results: ProblemCategoryRow[] = [];

  for (const problemId of problemIds) {
    const problem = staticData.problems.find((p) => p.id === problemId);
    if (problem && problem.category_id) {
      const category = staticData.categories.find(
        (c) => c.id === problem.category_id
      );
      if (category) {
        results.push({ problem, category });
      }
    }
  }

  // Sort by difficulty, category position, then problem id
  return results.sort((a, b) => {
    if (a.problem.difficulty !== b.problem.difficulty) {
      return (a.problem.difficulty || 0) - (b.problem.difficulty || 0);
    }
    if (a.category.position !== b.category.position) {
      return (a.category.position || 0) - (b.category.position || 0);
    }
    return (a.problem.id || "").localeCompare(b.problem.id || "");
  });
}
