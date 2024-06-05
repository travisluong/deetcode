import mysql from "mysql2/promise";
import fs from "fs";
import csv from "csv-parser";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const dbConfig: mysql.PoolOptions = {
  uri: process.env.DB_URL!,
};

const conn = await mysql.createConnection(dbConfig);

async function loadDataFromCSV() {
  const csvFilePath = process.argv[2];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", async (row) => {
      const name = row["Name"];
      const category = row["Category"];

      try {
        const [catRes, catFields] = await conn.query(
          "select * from category where ?",
          { name: category }
        );
        const [problemRes, problemFields] = await conn.query(
          "select * from problem where ?",
          { name: name }
        );
        await conn.query("update problem set category_id = ? where id = ?", [
          // @ts-ignore
          catRes[0].id,
          // @ts-ignore
          problemRes[0].id,
        ]);
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
      // pool.end();
    })
    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
    });
}

loadDataFromCSV();
