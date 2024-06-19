"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { problems, solutions } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UpdateSolutionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255),
  content: z.string().min(1).max(2048),
});

export interface UpdateSolutionState {
  errors?: {
    title?: string[];
    content?: string[];
  };
  message?: string;
  status?: "success" | "error";
}

export default async function updateSolution(
  prevState: UpdateSolutionState,
  formData: FormData
): Promise<UpdateSolutionState> {
  const session = await auth();

  if (!session) {
    return { message: "not authenticated", status: "error" };
  }

  const validatedFields = UpdateSolutionSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "bad request",
      status: "error",
    };
  }

  // check if solution belongs to user
  const solution = await db.query.solutions.findFirst({
    where: and(
      eq(solutions.user_id, session.user?.id!),
      eq(solutions.id, validatedFields.data.id)
    ),
  });

  if (!solution) {
    return {
      message: "solution not found",
      status: "error",
    };
  }

  // get problem
  const problem = await db.query.problems.findFirst({
    where: eq(problems.id, solution.problem_id),
  });

  if (!problem) {
    return {
      message: "problem not found",
      status: "error",
    };
  }

  await db
    .update(solutions)
    .set({
      title: validatedFields.data.title,
      content: validatedFields.data.content,
    })
    .where(eq(solutions.id, solution.id));

  revalidatePath(`/problems/${problem.slug}/solutions`);
  revalidatePath(`/problems/${problem.slug}/solutions/${solution.id}`);

  return {
    status: "success",
  };
}
