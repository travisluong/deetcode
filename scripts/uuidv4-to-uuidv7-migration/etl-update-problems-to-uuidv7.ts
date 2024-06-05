import { problems } from "@/lib/schema";
import { db, connection } from "../script-db";
import { uuidv7 } from "uuidv7";
import { asc, eq } from "drizzle-orm";

const res = await db.query.problems.findMany({
  orderBy: asc(problems.difficulty),
});

for (const problem of res) {
  await db
    .update(problems)
    .set({ id: uuidv7() })
    .where(eq(problems.id, problem.id));
}

await connection.end();
