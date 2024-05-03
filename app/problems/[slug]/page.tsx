import ProblemDetail from "@/components/problem-detail";
import { db } from "@/lib/db";
import { problems } from "@/lib/schema";
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

  return (
    <div className="p-5">
      <div>
        <ProblemDetail problem={problem} />
      </div>
    </div>
  );
}
