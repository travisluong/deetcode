import DifficultyBadge from "@/components/difficulty-badge";
import ProblemNav from "@/components/problem-nav";
import { getCategory, getProblem } from "@/lib/data";
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

  if (!problem.category_id) {
    notFound();
  }

  const category = await getCategory(problem.category_id);

  if (!category) {
    notFound();
  }

  return (
    <section className="flex flex-col h-full">
      <div className="flex items-center mx-5 gap-5">
        <h1 className="font-sans font-bold text-xl">{problem.name}</h1>
        <div>{category.name}</div>
        <div>
          {problem.difficulty && (
            <DifficultyBadge difficulty={problem.difficulty} />
          )}
        </div>
        <ProblemNav problem={problem} />
      </div>
      {children}
    </section>
  );
}
