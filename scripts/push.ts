/**
 * push local data to prod
 */

import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/lib/schema";
import { problems } from "@/lib/schema";
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
    set: { id: sql`id`, solution: sql`VALUES(solution)` },
  });

prodConn.end();
devConn.end();
