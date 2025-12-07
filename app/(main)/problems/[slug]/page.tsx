import ProblemDetailSandbox from "@/components/problem-detail-sandbox";
import Toolbar from "@/components/toolbar";
import { notFound } from "next/navigation";
import { getProblem } from "@/lib/data";
import { getAllStaticProblems } from "@/lib/static-data";

export function generateStaticParams() {
  const problems = getAllStaticProblems();
  return problems.map((problem) => ({
    slug: problem.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const data = await getProblem(slug);
  if (!data) {
    notFound();
  }
  return {
    title: data.name + " Problem | DeetCode",
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const data = await getProblem(slug);

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col px-2 h-full">
      <Toolbar />
      <ProblemDetailSandbox problem={data} />
    </div>
  );
}
