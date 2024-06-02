"use client";

import { LightningBoltIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const session = useSession();
  const pathname = usePathname();
  return (
    <header className="p-3 flex justify-between border-b border-gray-400 dark:border-gray-800">
      <Link
        href="/"
        className="font-brand text-primary flex gap-2 items-center text-xl"
      >
        <LightningBoltIcon className="text-primary w-7 h-7 hover:text-yellow-300" />{" "}
        DeetCode
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
          {session.status === "authenticated" ? (
            <Image
              width={30}
              height={230}
              alt="avatar"
              src={session.data?.user?.image!}
              className="rounded-full"
            />
          ) : (
            <Button onClick={() => signIn()}>Sign In</Button>
          )}
        </nav>
        <ModeToggle />
      </div>
    </header>
  );
}
