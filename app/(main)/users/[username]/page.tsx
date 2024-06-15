import { columns } from "@/components/profile-columns";
import { DataTable } from "@/components/ui/data-table";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { problems, solutions, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  const user = await db.query.users.findFirst({
    columns: {
      id: true,
      image: true,
      username: true,
    },
    where: eq(users.username, username),
  });

  if (!user) {
    notFound();
  }

  const solutionsRes = await db
    .select({
      user: {
        id: users.id,
        username: users.username,
        image: users.image,
      },
      solution: {
        id: solutions.id,
        title: solutions.title,
        created_at: solutions.created_at,
      },
      problem: {
        id: problems.id,
        name: problems.name,
        slug: problems.slug,
      },
    })
    .from(solutions)
    .innerJoin(problems, eq(solutions.problem_id, problems.id))
    .innerJoin(users, eq(users.id, solutions.user_id))
    .where(eq(solutions.user_id, user.id));

  return (
    <div className="m-auto max-w-md flex flex-col gap-5 justify-center items-center">
      <Image
        src={user.image!}
        width={50}
        height={50}
        alt="avatar"
        className="rounded-full"
      />
      <h1 className="font-brand">{user.username}</h1>
      <h2 className="font-brand">Solutions</h2>
      <DataTable columns={columns} data={solutionsRes} />
    </div>
  );
}
