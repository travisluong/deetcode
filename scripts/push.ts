/**
 * push local data to prod
 */

import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/lib/schema";
import { problem_to_list, problems } from "@/lib/schema";
import { sql } from "drizzle-orm";

dotenv.config({ path: ".env.local" });

const prodConn = await mysql.createConnection(process.env.PROD_MYSQL_URL!);
const devConn = await mysql.createConnection(process.env.DEV_MYSQL_URL!);

const prodDb = await drizzle(prodConn, { schema, mode: "default" });
const devDb = await drizzle(devConn, { schema, mode: "default" });

const problemsRes = await devDb.query.problems.findMany();

await prodDb
  .insert(problems)
  .values(problemsRes)
  .onDuplicateKeyUpdate({
    set: {
      id: sql`id`,
      solution: sql`VALUES(solution)`,
      difficulty: sql`VALUES(difficulty)`,
    },
  });

const problemToListRes = await devDb.query.problem_to_list.findMany();

await prodDb
  .insert(problem_to_list)
  .values(problemToListRes)
  .onDuplicateKeyUpdate({
    set: {
      problem_id: sql`problem_id`,
      list_id: sql`list_id`,
    },
  });

prodConn.end();
devConn.end();
