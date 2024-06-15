import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const config = {
  DB_URL: process.env.DB_URL!,
  APP_MODE: process.env.APP_MODE!,
  NEXT_PUBLIC_RUNNER_URL: process.env.NEXT_PUBLIC_RUNNER_URL!,
  NEXT_PUBLIC_RUNNER_DOMAIN: process.env.NEXT_PUBLIC_RUNNER_DOMAIN!,
};
