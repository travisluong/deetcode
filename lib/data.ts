import { eq } from "drizzle-orm";
import { db } from "./db";
import { category, problem } from "./schema";
import { cache } from "react";

export const getProblem = cache(async (slug: string) => {
  const data = await db.query.problem.findFirst({
    where: eq(problem.slug, slug),
  });
  return data;
});

export const getCategory = cache(async (id: string) => {
  const data = await db.query.category.findFirst({
    where: eq(category.id, id),
  });
  return data;
});
