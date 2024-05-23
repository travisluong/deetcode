import { promises as fs } from "fs";
import path from "path";

export const readFileAsString = async (filePath: string): Promise<string> => {
  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    const fileContent = await fs.readFile(absolutePath, "utf-8");
    return fileContent;
  } catch (error) {
    console.error(`Error reading file from path: ${filePath}`, error);
    throw error;
  }
};
