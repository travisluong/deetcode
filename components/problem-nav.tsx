"use client";

import { ProblemDB } from "@/lib/types";
import { cn } from "@/lib/utils";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Toolbar from "./toolbar";

export default function ProblemNav({ problem }: { problem: ProblemDB }) {
  const pathname = usePathname();
  const { slug } = problem;

  return (
    <nav className="flex justify-between gap-5 mx-5 border-b border-gray-400 dark:border-gray-600">
      <div className="flex gap-5">
        <Link
          className={cn(
            "border border-gray-400 dark:border-gray-600 p-1 border-b-0 rounded-t min-w-24 text-center",
            pathname === `/problems/${slug}` && "bg-slate-200 dark:bg-slate-800"
          )}
          href={`/problems/${slug}`}
        >
          Code
        </Link>
        <Link
          className={cn(
            "border border-gray-400 dark:border-gray-600 p-1 border-b-0 rounded-t min-w-24 text-center",
            pathname === `/problems/${slug}/video` &&
              "bg-slate-200 dark:bg-slate-800"
          )}
          href={`/problems/${slug}/video`}
        >
          Video
        </Link>
        <Link
          className={cn(
            "border border-gray-400 dark:border-gray-600 p-1 border-b-0 rounded-t min-w-24 text-center",
            pathname === `/problems/${slug}/notes` &&
              "bg-slate-200 dark:bg-slate-800"
          )}
          href={`/problems/${slug}/notes`}
        >
          Deetails
        </Link>
        <Link
          className={cn(
            "border border-gray-400 dark:border-gray-600 p-1 border-b-0 rounded-t min-w-24 text-center flex gap-2 items-center"
          )}
          href={problem.leetcode_url ?? ""}
          target="new"
        >
          LeetCode <OpenInNewWindowIcon />
        </Link>
      </div>
      <div className="self-end">
        <Toolbar />
      </div>
    </nav>
  );
}
