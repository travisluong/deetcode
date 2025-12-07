"use client";

import { LightningBoltIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="flex flex-col md:flex-row justify-between border-b border-gray-400 dark:border-gray-800 bg-muted p-1 gap-5">
      <Link
        href="/"
        className="font-brand text-primary flex gap-2 items-center text-xl m-auto md:m-0"
      >
        <LightningBoltIcon className="text-primary w-7 h-7 hover:text-yellow-300" />{" "}
        DeetCode
      </Link>

      <div className="flex flex-col md:flex-row gap-5 items-center">
        <nav className="flex gap-5 items-center">
          <Link
            href="/problems"
            className={cn(
              "hover:text-primary",
              pathname === "/problems" && "text-primary"
            )}
          >
            Problems
          </Link>
          <Link
            href="/playground"
            className={cn(
              "hover:text-primary",
              pathname === "/playground" && "text-primary"
            )}
          >
            Playground
          </Link>
        </nav>
        <nav className="flex">
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
