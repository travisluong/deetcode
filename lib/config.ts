import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const config = {
  DB_URL: process.env.DB_URL!,
  RUNNER_URL: process.env.RUNNER_URL!,
};
