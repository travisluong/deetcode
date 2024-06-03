import { eq } from "drizzle-orm";
import { db } from "./db";
import { category, problems } from "./schema";
import { cache } from "react";

export const getProblem = cache(async (slug: string) => {
  const data = await db.query.problems.findFirst({
    where: eq(problems.slug, slug),
  });
  return data;
});

export const getCategory = cache(async (id: string) => {
  const data = await db.query.category.findFirst({
    where: eq(category.id, id),
  });
  return data;
});
