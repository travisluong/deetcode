import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/problem-columns";

export default async function Page() {
  const problemsRes = await db.query.problems.findMany();

  return (
    <div className="max-w-3xl m-auto flex flex-col gap-5">
      <h1 className="font-brand text-center">Problems</h1>
      <h2 className="text-muted-foreground text-center">
        The Blind 75 Debugged and Visualized
      </h2>
      <DataTable columns={columns} data={problemsRes} />
    </div>
  );
}
