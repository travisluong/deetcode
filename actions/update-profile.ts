"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  username: z.string().min(1).max(255),
});

export interface UpdateProfileState {
  errors?: {
    username?: string[];
  };
  message?: string;
  status?: "success" | "error";
}

export default async function updateProfile(
  prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const session = await auth();

  if (!session) {
    return { message: "not authenticated", status: "error" };
  }

  const validatedFields = UpdateProfileSchema.safeParse({
    username: formData.get("username"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "bad request",
      status: "error",
    };
  }

  const usernameExists = await db.query.users.findFirst({
    where: eq(users.username, validatedFields.data.username),
  });

  if (usernameExists?.id! === session.user?.id!) {
    return {
      message: "username unchanged",
      status: "success",
    };
  }

  if (usernameExists) {
    return {
      message: "username already taken",
      status: "error",
    };
  }

  await db
    .update(users)
    .set({
      username: validatedFields.data.username,
    })
    .where(eq(users.id, session.user?.id!));

  return {
    status: "success",
    message: "success ",
  };
}
