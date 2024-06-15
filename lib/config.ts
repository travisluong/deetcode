import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const config = {
  DB_URL: process.env.DB_URL!,
  NEXT_PUBLIC_RUNNER_URL: process.env.NEXT_PUBLIC_RUNNER_URL!,
};
