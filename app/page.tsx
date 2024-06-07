import Footer from "@/components/footer";
import Header from "@/components/header";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const session = await auth();

  let user;
  if (session) {
    user = await db.query.users.findFirst({
      where: eq(users.id, session.user?.id!),
    });
  }

  return (
    <div>
      <Header user={user} />
      <main className="max-w-md m-auto p-5">
        <h1 className="font-bold text-5xl text-center text-primary font-brand">
          DeetCode
        </h1>
      </main>
      <Footer />
    </div>
  );
}
