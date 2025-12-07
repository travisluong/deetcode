import { db } from "./script-db";
import { problems, category } from "@/lib/schema";
import * as fs from "fs";
import * as path from "path";

async function exportStaticData() {
  console.log("Exporting problems...");
  const allProblems = await db.select().from(problems);
  console.log(`Found ${allProblems.length} problems`);

  console.log("Exporting categories...");
  const allCategories = await db.select().from(category);
  console.log(`Found ${allCategories.length} categories`);

  const staticData = {
    problems: allProblems,
    categories: allCategories,
    exportedAt: new Date().toISOString(),
  };

  const outputPath = path.join(process.cwd(), "lib", "static-data.json");
  fs.writeFileSync(outputPath, JSON.stringify(staticData, null, 2));

  console.log(`Static data exported to ${outputPath}`);
  process.exit(0);
}

exportStaticData().catch((error) => {
  console.error("Error exporting static data:", error);
  process.exit(1);
});
