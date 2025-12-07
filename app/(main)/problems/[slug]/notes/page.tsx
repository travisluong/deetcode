import { getProblem } from "@/lib/data";
import { getAllStaticProblems } from "@/lib/static-data";

export function generateStaticParams() {
  const problems = getAllStaticProblems();
  return problems.map((problem) => ({
    slug: problem.slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const problem = await getProblem(slug);

  return <div className="m-5">{problem?.notes}</div>;
}
