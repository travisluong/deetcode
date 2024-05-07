import DifficultyBadge from "@/components/difficulty-badge";
import ProblemNav from "@/components/problem-nav";
import { Badge } from "@/components/ui/badge";
import { getProblem } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = params;

  const problem = await getProblem(slug);

  if (!problem) {
    notFound();
  }

  return (
    <section className="flex flex-col h-full">
      <div className="flex items-center mx-5 mb-5 gap-14">
        <h1 className="font-sans font-bold text-xl">{problem.name}</h1>
        <div>{problem.category}</div>
        <div>
          {problem.difficulty && (
            <DifficultyBadge difficulty={problem.difficulty} />
          )}
        </div>
      </div>
      <ProblemNav problem={problem} />
      {children}
    </section>
  );
}
