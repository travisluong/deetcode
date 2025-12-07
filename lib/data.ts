import { cache } from "react";
import { getStaticProblem, getStaticCategory } from "./static-data";

export const getProblem = cache(async (slug: string) => {
  return getStaticProblem(slug);
});

export const getCategory = cache(async (id: string) => {
  return getStaticCategory(id);
});
