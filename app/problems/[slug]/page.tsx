import ProblemDetail from "@/components/problem-detail";
import { db } from "@/lib/db";
import { problem } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const data = await db.query.problem.findFirst({
    where: eq(problem.slug, slug),
  });

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col p-5 h-full">
      <ProblemDetail problem={data} />
    </div>
  );
}
