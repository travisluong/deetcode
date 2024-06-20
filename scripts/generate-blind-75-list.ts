import { problem_to_list } from "@/lib/schema";
import { connection, db } from "./script-db";
import { sql } from "drizzle-orm";

const problems = await db.query.problems.findMany();
const problemList = await db.query.problem_list.findFirst();

if (!problemList) {
  throw new Error("problem list not found");
}

for (const problem of problems) {
  await db
    .insert(problem_to_list)
    .values({ problem_id: problem.id, list_id: problemList.id })
    .onDuplicateKeyUpdate({ set: { problem_id: sql`problem_id` } });
}

connection.end();
