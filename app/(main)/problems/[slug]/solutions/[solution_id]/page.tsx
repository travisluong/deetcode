import ProblemDetailSandbox from "@/components/problem-detail-sandbox";
import Toolbar from "@/components/toolbar";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { problems, solutions, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const data = await db.query.problems.findFirst({
    where: eq(problems.slug, slug),
  });
  if (!data) {
    notFound();
  }
  return {
    title: data.name + " Solution | DeetCode",
  };
}

export default async function Page({
  params,
}: {
  params: { slug: string; solution_id: string };
}) {
  const session = await auth();
  const { slug, solution_id } = params;
  const problem = await db.query.problems.findFirst({
    where: eq(problems.slug, slug),
  });

  if (!problem) {
    notFound();
  }

  const solution = await db.query.solutions.findFirst({
    where: eq(solutions.id, solution_id),
  });

  if (!solution) {
    notFound();
  }

  const user = await db.query.users.findFirst({
    columns: {
      id: true,
      username: true,
      image: true,
    },
    where: eq(users.id, solution.user_id),
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col p-2 h-full">
      <Toolbar solution={solution} user={user} />
      <ProblemDetailSandbox
        problem={problem}
        solution={solution}
        session={session}
      />
    </div>
  );
}
