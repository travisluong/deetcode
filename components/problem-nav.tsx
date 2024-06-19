"use client";

import { ProblemDB } from "@/lib/types";
import { cn } from "@/lib/utils";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProblemNav({ problem }: { problem: ProblemDB }) {
  const pathname = usePathname();
  const { slug } = problem;

  return (
    <nav className="flex gap-5 mx-5 relative top-[1px] bg-background">
      <div className="flex gap-2">
        <Link
          className={cn(
            "border border-gray-400 dark:border-gray-600 px-3 border-b-0 rounded-t min-w-24 text-center",
            pathname === `/problems/${slug}` &&
              "bg-slate-200 dark:bg-background relative top-[2px]"
          )}
          href={`/problems/${slug}`}
        >
          Code
        </Link>
        <Link
          className={cn(
            "border border-gray-400 dark:border-gray-600 px-3 border-b-0 rounded-t min-w-24 text-center",
            pathname === `/problems/${slug}/solutions` &&
              "bg-slate-200 dark:bg-background relative top-[2px]"
          )}
          href={`/problems/${slug}/solutions`}
        >
          Solutions
        </Link>
        <Link
          className={cn(
            "border border-gray-400 dark:border-gray-600 px-3 border-b-0 rounded-t min-w-24 text-center",
            pathname === `/problems/${slug}/video` &&
              "bg-slate-200 dark:bg-background relative top-[2px]"
          )}
          href={`/problems/${slug}/video`}
        >
          Video
        </Link>
        <Link
          className={cn(
            "border border-gray-400 dark:border-gray-600 px-3 border-b-0 rounded-t min-w-24 text-center flex gap-2 items-center"
          )}
          href={problem.leetcode_url ?? ""}
          target="new"
        >
          LeetCode <OpenInNewWindowIcon />
        </Link>
      </div>
    </nav>
  );
}
