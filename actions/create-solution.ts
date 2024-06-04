"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { problems, solutions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import z from "zod";

const CreateSolutionSchema = z.object({
  problem_id: z.string().uuid(),
  title: z.string().min(1).max(255),
  content: z.string().min(1).max(2048),
});

export interface CreateSolutionState {
  errors?: {
    title?: string[];
    content?: string[];
  };
  message?: string;
}

export default async function createSolution(
  prevState: CreateSolutionState,
  formData: FormData
): Promise<CreateSolutionState> {
  const session = await auth();

  if (!session) {
    return { message: "not authenticated" };
  }

  console.log(formData);

  const validatedFields = CreateSolutionSchema.safeParse({
    problem_id: formData.get("problem_id"),
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error",
    };
  }

  const problem = await db.query.problems.findFirst({
    where: eq(problems.id, validatedFields.data.problem_id),
  });

  if (!problem) {
    return { message: "problem not found" };
  }

  const id = crypto.randomUUID();
  await db.insert(solutions).values({
    id: id,
    user_id: session.user?.id!,
    problem_id: problem.id,
    title: validatedFields.data.title,
    content: validatedFields.data.content,
  });

  redirect(`/problems/${problem.slug}/solutions/${id}`);
}
