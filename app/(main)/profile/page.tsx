import ProfileForm from "@/components/profile-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session?.user?.id!),
  });

  return (
    <div className="p-5 m-auto max-w-md">
      <h1 className="font-brand">Profile</h1>
      <ProfileForm user={user} />
    </div>
  );
}
