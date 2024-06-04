import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/problem-columns";
import { category, problems } from "@/lib/schema";
import { asc, eq } from "drizzle-orm";

export default async function Page() {
  const data = await db
    .select()
    .from(problems)
    .innerJoin(category, eq(problems.category_id, category.id))
    .orderBy(asc(problems.difficulty), asc(category.position));

  return (
    <div className="max-w-3xl m-auto flex flex-col gap-5">
      <h1 className="font-brand text-center">All Problems</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
