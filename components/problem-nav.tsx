"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProblemNav({ slug }: { slug: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-5 mx-5 border-b border-gray-400">
      <Link
        className={cn(
          "border border-gray-400 p-1 border-b-0 rounded-t min-w-24 text-center",
          pathname === `/problems/${slug}` && "bg-slate-800"
        )}
        href={`/problems/${slug}`}
      >
        Code
      </Link>
      <Link
        className={cn(
          "border border-gray-400 p-1 border-b-0 rounded-t min-w-24 text-center",
          pathname === `/problems/${slug}/video` && "bg-slate-800"
        )}
        href={`/problems/${slug}/video`}
      >
        Video
      </Link>
      <Link
        className={cn(
          "border border-gray-400 p-1 border-b-0 rounded-t min-w-24 text-center",
          pathname === `/problems/${slug}/notes` && "bg-slate-800"
        )}
        href={`/problems/${slug}/notes`}
      >
        Notes
      </Link>
    </nav>
  );
}
