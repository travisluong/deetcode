import ProblemDetailSandbox from "@/components/problem-detail-sandbox";
import Toolbar from "@/components/toolbar";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { problems } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await auth();
  const { slug } = params;

  const data = await db.query.problems.findFirst({
    where: eq(problems.slug, slug),
  });

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col px-2 h-full">
      <Toolbar />
      <ProblemDetailSandbox problem={data} session={session} />
    </div>
  );
}
