"use client";

import { LightningBoltIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="p-3 flex justify-between border-b border-gray-400 dark:border-gray-800">
      <Link href="/">
        <LightningBoltIcon className="text-primary w-7 h-7 hover:text-yellow-300" />
      </Link>

      <div className="flex gap-5 items-center">
        <nav className="flex gap-5">
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
            href="/problem-list/blind-75"
            className={cn(
              "hover:text-primary",
              pathname === "/problem-list/blind-75" && "text-primary"
            )}
          >
            Blind 75
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
        <ModeToggle />
      </div>
    </header>
  );
}
