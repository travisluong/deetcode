import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removeFirstLine = (input: string): string => {
  const lines = input.split("\n");
  lines.shift();
  return lines.join("\n");
};
