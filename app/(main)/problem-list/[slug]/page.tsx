import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/problem-columns";
import { category, problem, problem_list, problem_to_list } from "@/lib/schema";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const problemList = await db.query.problem_list.findFirst({
    where: eq(problem_list.slug, slug),
  });

  if (!problemList) {
    notFound();
  }

  const data = await db
    .select()
    .from(problem)
    .innerJoin(category, eq(problem.category_id, category.id))
    .innerJoin(problem_to_list, eq(problem.id, problem_to_list.problem_id))
    .innerJoin(problem_list, eq(problem_to_list.list_id, problem_list.id))
    .where(eq(problem_list.id, problemList.id))
    .orderBy(asc(problem.difficulty), asc(category.position));

  return (
    <div className="max-w-3xl m-auto flex flex-col gap-5">
      <h1 className="font-brand text-center">{problemList.name}</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
