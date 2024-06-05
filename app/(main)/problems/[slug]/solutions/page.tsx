import { columns } from "@/components/solution-columns";
import { DataTable } from "@/components/ui/data-table";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { problems, solutions, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await auth();
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

  let mySolutions;
  if (session) {
    mySolutions = await db
      .select()
      .from(problems)
      .innerJoin(solutions, eq(problems.id, solutions.problem_id))
      .innerJoin(users, eq(solutions.user_id, users.id))
      .where(eq(users.id, session.user?.id!));
  }

  return (
    <div className="max-w-3xl m-auto flex flex-col gap-5">
      {session && mySolutions && (
        <div className="flex flex-col gap-5">
          <h2 className="font-brand text-center">My Solutions</h2>
          <DataTable columns={columns} data={mySolutions} />
        </div>
      )}
      <h2 className="font-brand text-center">All Solutions</h2>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
