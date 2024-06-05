import ProblemDetailSandbox from "@/components/problem-detail-sandbox";
import Toolbar from "@/components/toolbar";
import { db } from "@/lib/db";
import { problems, solutions, users } from "@/lib/schema";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { slug: string; solution_id: string };
}) {
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
    where: eq(users.id, solution.user_id),
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col p-2 h-full">
      <div className="px-5 mb-2 flex justify-between">
        <Link
          className="flex gap-2 items-center text-primary"
          href={`/problems/${problem.slug}/solutions`}
        >
          <ArrowLeftIcon /> All Solutions
        </Link>
        <div>{solution.title}</div>
        <div className="flex gap-2 items-center">
          <Image
            src={user.image!}
            alt="avatar"
            width={30}
            height={30}
            className="rounded-full"
          />
          {user.name}
        </div>
      </div>
      <Toolbar />
      <ProblemDetailSandbox problem={problem} solution={solution} />
    </div>
  );
}
