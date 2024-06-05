"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { problems, solutions } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

const DeleteSolutionSchema = z.object({
  id: z.string().uuid(),
});

export interface DeleteSolutionState {
  errors?: {
    id?: string[];
  };
  message?: string;
  status?: "success" | "error";
}

export default async function deleteSolution(
  prevState: DeleteSolutionState,
  formData: FormData
): Promise<DeleteSolutionState> {
  const session = await auth();

  if (!session) {
    return { message: "not authenticated", status: "error" };
  }

  const validatedFields = DeleteSolutionSchema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      status: "error",
    };
  }

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

  const problem = await db.query.problems.findFirst({
    where: eq(problems.id, solution.problem_id),
  });

  if (!problem) {
    return {
      message: "problem not found",
      status: "error",
    };
  }

  await db.delete(solutions).where(eq(solutions.id, solution.id));

  redirect(`/problems/${problem.slug}/solutions`);
}
