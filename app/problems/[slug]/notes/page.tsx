import { getProblem } from "@/lib/data";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const problem = await getProblem(slug);

  return <div className="m-5">{problem?.notes}</div>;
}
