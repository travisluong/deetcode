import { ProblemDB, CategoryDB, ProblemCategoryRow } from "./types";
import staticDataJson from "./static-data.json";

interface StaticData {
  problems: ProblemDB[];
  categories: CategoryDB[];
  exportedAt: string;
}

const staticData = staticDataJson as unknown as StaticData;

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
