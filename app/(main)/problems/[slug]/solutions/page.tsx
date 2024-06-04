import { columns } from "@/components/solution-columns";
import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/db";
import { problems, solutions, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const problem = await db.query.problems.findFirst({
    where: eq(problems.slug, slug),
  });
  if (!problem) {
    notFound();
  }
  const data = await db
    .select()
    .from(problems)
    .innerJoin(solutions, eq(problems.id, solutions.problem_id))
    .innerJoin(users, eq(solutions.user_id, users.id));

  return (
    <div className="max-w-3xl m-auto flex flex-col gap-5">
      <h1 className="font-brand text-center">Solutions</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
