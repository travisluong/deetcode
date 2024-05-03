import { eq } from "drizzle-orm";
import { db } from "./db";
import { problems } from "./schema";
import { cache } from "react";

export const getProblem = cache(async (slug: string) => {
  const problem = await db.query.problems.findFirst({
    where: eq(problems.slug, slug),
  });
  return problem;
});
