import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/problem-columns";
import { category, problem } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function Page() {
  const data = await db
    .select()
    .from(problem)
    .innerJoin(category, eq(problem.category_id, category.id));
  console.log(data);

  return (
    <div className="max-w-3xl m-auto flex flex-col gap-5">
      <h1 className="font-brand text-center">Problems</h1>
      <h2 className="text-muted-foreground text-center">
        The Blind 75 Debugged and Visualized
      </h2>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
