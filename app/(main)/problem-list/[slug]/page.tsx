import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/problem-columns";
import {
  getAllStaticProblems,
  getAllStaticCategories,
} from "@/lib/static-data";
import { ProblemCategoryRow } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  return {
    title:
      slug.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()) +
      " | DeetCode",
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const problems = getAllStaticProblems();
  const categories = getAllStaticCategories();

  const data: ProblemCategoryRow[] = problems
    .map((problem) => {
      const category = categories.find((c) => c.id === problem.category_id);
      return category ? { problem, category } : null;
    })
    .filter((item): item is ProblemCategoryRow => item !== null)
    .sort((a, b) => {
      if (a.problem.difficulty !== b.problem.difficulty) {
        return (a.problem.difficulty || 0) - (b.problem.difficulty || 0);
      }
      if (a.category.position !== b.category.position) {
        return (a.category.position || 0) - (b.category.position || 0);
      }
      return (a.problem.id || "").localeCompare(b.problem.id || "");
    });

  return (
    <div className="max-w-3xl m-auto flex flex-col gap-0 pb-10">
      <h1 className="font-brand text-center">All Problems</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
