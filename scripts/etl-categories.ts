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

  const catSet = new Set();

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", async (row) => {
      const category = row["Category"];

      if (catSet.has(category)) {
        return;
      }

      catSet.add(category);

      const newCategory = {
        name: category,
      };

      try {
        // Insert data into MySQL table
        const [insertRes, insertFields] = await conn.query(
          "INSERT INTO categories SET ?",
          newCategory
        );
        console.log("Data inserted successfully");
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
      // Close MySQL connection pool
      // pool.end();
    })
    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
    });
}

// Load data from CSV into MySQL database
loadDataFromCSV();
