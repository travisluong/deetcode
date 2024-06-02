import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createConnection } from "mysql2";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url =
  process.argv[2] === "prod" ? process.env.PROD_MYSQL_URL : process.env.DB_URL;

if (!url) {
  throw new Error("url not found");
}

const connection = createConnection(url);
const db = drizzle(connection);
await migrate(db, { migrationsFolder: "drizzle" });
await connection.end();
