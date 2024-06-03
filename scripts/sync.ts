/**
 * sync local db to production db
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/lib/schema";
import { desc, eq, gt } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prodConn = await mysql.createConnection(process.env.PROD_MYSQL_URL!);
const devConn = await mysql.createConnection(process.env.DEV_MYSQL_URL!);

const prodDb = await drizzle(prodConn, { schema, mode: "default" });
const devDb = await drizzle(devConn, { schema, mode: "default" });

const lastSyncLog = await devDb.query.sync_log.findFirst({
  orderBy: desc(schema.sync_log.started_at),
});

if (!lastSyncLog) {
  throw new Error("sync log not found");
}

await devDb.insert(schema.sync_log).values({});
const newSyncLog = await devDb.query.sync_log.findFirst({
  orderBy: desc(schema.sync_log.started_at),
});

if (!newSyncLog) {
  throw new Error("new sync log not found");
}

// category
const categoryRes = await devDb.query.category.findMany({
  where: gt(schema.category.updated_at, lastSyncLog.started_at),
});

// problem
const problemRes = await devDb.query.problems.findMany({
  where: gt(schema.problems.updated_at, lastSyncLog.started_at),
});

// problem list
const problemListRes = await devDb.query.problem_list.findMany({
  where: gt(schema.problem_list.updated_at, lastSyncLog.started_at),
});

// problem to list
const problemTolistRes = await devDb.query.problem_to_list.findMany({
  where: gt(schema.problem_to_list.updated_at, lastSyncLog.started_at),
});

console.log("category ", categoryRes.length);
console.log("problem ", problemRes.length);
console.log("problem_list ", problemListRes.length);
console.log("problem_to_list", problemTolistRes.length);

for (let category of categoryRes) {
  await prodDb
    .insert(schema.category)
    .values(category)
    .onDuplicateKeyUpdate({ set: { ...category } });
}

for (let problem of problemRes) {
  await prodDb
    .insert(schema.problems)
    .values(problem)
    .onDuplicateKeyUpdate({ set: { ...problem } });
}

for (let problemList of problemListRes) {
  await prodDb
    .insert(schema.problem_list)
    .values(problemList)
    .onDuplicateKeyUpdate({ set: { ...problemList } });
}

for (let problemToList of problemTolistRes) {
  await prodDb
    .insert(schema.problem_to_list)
    .values(problemToList)
    .onDuplicateKeyUpdate({ set: { ...problemToList } });
}

await devDb
  .update(schema.sync_log)
  .set({ completed_at: new Date() })
  .where(eq(schema.sync_log.id, newSyncLog.id));

const updatedSyncLog = await devDb.query.sync_log.findFirst({
  where: eq(schema.sync_log.id, newSyncLog.id),
});

if (!updatedSyncLog) {
  throw new Error("updated sync log not found");
}

await prodDb.insert(schema.sync_log).values(updatedSyncLog);

prodConn.end();
devConn.end();
