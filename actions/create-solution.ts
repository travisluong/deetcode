"use server";

import { auth } from "@/lib/auth";
import z from "zod";

const CreateSolutionSchema = z.object({
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
    throw new Error("unauthenticated");
  }

  const validatedFields = CreateSolutionSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error",
    };
  }

  return {
    message: "Success",
  };
}
