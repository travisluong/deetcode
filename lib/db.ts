import { drizzle } from "drizzle-orm/mysql2";
import mysql, { Pool } from "mysql2/promise";
import { config } from "./config";
import * as schema from "./schema";

declare global {
  var poolConnection: Pool;
}

function getPool() {
  if (global.poolConnection) {
    return global.poolConnection;
  }

  const poolConnection = mysql.createPool({
    uri: config.DB_URL,
  });

  global.poolConnection = poolConnection;

  return global.poolConnection;
}

const poolConnection = getPool();

export const db = drizzle(poolConnection, { schema, mode: "default" });
