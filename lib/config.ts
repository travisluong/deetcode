import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const config = {
  DB_URL: process.env.DB_URL!,
  APP_MODE: process.env.APP_MODE!,
  NEXT_PUBLIC_RUNNER_URL:
    process.env.NODE_ENV === "production"
      ? "https://travisluong.github.io/deetcode/runner"
      : "http://localhost:3000/runner",
  NEXT_PUBLIC_RUNNER_DOMAIN:
    process.env.NODE_ENV === "production"
      ? "https://travisluong.github.io"
      : "http://localhost:3000",
};
