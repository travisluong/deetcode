import Footer from "@/components/footer";
import Header from "@/components/header";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let user;
  if (session) {
    user = await db.query.users.findFirst({
      where: eq(users.id, session.user?.id!),
    });
  }
  return (
    <section className="flex flex-col gap-0 h-[100vh]">
      <Header user={user} />
      <main className="flex-grow">{children}</main>
    </section>
  );
}
