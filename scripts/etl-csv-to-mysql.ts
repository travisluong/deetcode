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
      const leetcodeUrl = row["Link"];
      const pathSegments = leetcodeUrl
        .split("/")
        .filter((segment: string) => segment !== "");
      const lastSubpath = pathSegments[pathSegments.length - 1];

      const difficultyMap = {
        e: 1,
        m: 2,
        h: 3,
      };

      const category = row["Category"];

      const [categoryRes, fields] = await conn.execute(
        "SELECT * FROM categories WHERE name = ?",
        [category]
      );

      const data = {
        neetcode_url: row["Video Solution"],
        category_id: categoryRes[0].id,
        name: row["Name"],
        leetcode_url: row["Link"],
        neetcode_notes: row["Notes"],
        slug: lastSubpath,
        //@ts-ignore
        difficulty: difficultyMap[row["Difficulty"]],
      };

      console.log(data);

      try {
        const [results, fields] = await conn.query(
          "INSERT INTO problems SET ? ON DUPLICATE KEY UPDATE id=id",
          data
        );
        console.log("Data inserted successfully");
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
