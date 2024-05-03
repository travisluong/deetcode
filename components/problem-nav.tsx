"use client";

import { Problem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Link2Icon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProblemNav({ problem }: { problem: Problem }) {
  const pathname = usePathname();
  const { slug } = problem;

  return (
    <nav className="flex gap-5 mx-5 border-b border-gray-400 dark:border-gray-600">
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
        Notes
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
    </nav>
  );
}
