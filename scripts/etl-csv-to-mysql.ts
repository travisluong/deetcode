import mysql from "mysql2/promise";
import fs from "fs";
import csv from "csv-parser";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// MySQL database connection settings
const dbConfig: mysql.PoolOptions = {
  uri: process.env.DB_URL!,
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Function to load data from CSV file into MySQL database
async function loadDataFromCSV() {
  const csvFilePath = process.argv[2]; // Path to your CSV file

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", async (row) => {
      // Map CSV columns to MySQL table columns
      const leetcodeUrl = row["Link"];
      const pathSegments = leetcodeUrl
        .split("/")
        .filter((segment: string) => segment !== ""); // Split path and remove empty segments
      const lastSubpath = pathSegments[pathSegments.length - 1]; // Get the last subpath

      const difficultyMap = {
        e: "easy",
        m: "medium",
        h: "hard",
      };

      const data = {
        neetcode_url: row["Video Solution"],
        category: row["Category"],
        name: row["Name"],
        leetcode_url: row["Link"],
        notes: row["Notes"],
        slug: lastSubpath,
        //@ts-ignore
        difficulty: difficultyMap[row["Difficulty"]],
      };

      console.log(data);

      try {
        // Insert data into MySQL table
        const [results, fields] = await pool.query(
          "INSERT INTO problems SET ? ON DUPLICATE KEY UPDATE difficulty=difficulty",
          data
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
