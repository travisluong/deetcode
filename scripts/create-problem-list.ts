import { problem_list } from "@/lib/schema";
import { db } from "./script-db";

const name = process.argv[2];
const slug = process.argv[3];

await db.insert(problem_list).values({ name: name, slug: slug });

process.exit();
