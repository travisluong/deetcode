"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { solutions } from "@/lib/schema";
import { eq } from "drizzle-orm";
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
    return { message: "not authenticated" };
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
    };
  }

  // check if solution belongs to user
  const solution = await db.query.solutions.findFirst({
    where: eq(solutions.user_id, session.user?.id!),
  });

  if (!solution) {
    return {
      message: "solution not found",
    };
  }

  await db
    .update(solutions)
    .set({
      title: validatedFields.data.title,
      content: validatedFields.data.content,
    })
    .where(eq(solutions.id, solution.id));

  return {
    status: "success",
  };
}
