import { db } from "@/lib/db";

export default async function Page() {
  const problemsRes = await db.query.problems.findMany();

  return (
    <div>
      <h1>Problems</h1>
      <div>
        {problemsRes.map((problem) => (
          <div key={problem.id}>{problem.name}</div>
        ))}
      </div>
    </div>
  );
}
