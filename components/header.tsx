"use client";

import {
  ExitIcon,
  LightningBoltIcon,
  Pencil2Icon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserDB } from "@/lib/types";

export default function Header({ user }: { user?: UserDB }) {
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <Image
                    width={30}
                    height={230}
                    alt="avatar"
                    src={session.data?.user?.image!}
                    className="rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link
                    className="flex gap-2"
                    href={`/users/${user?.username}`}
                  >
                    <PersonIcon /> Public Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link className="flex gap-2" href="/profile">
                    <Pencil2Icon /> Edit Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <ExitIcon className="mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => signIn()}>Sign In</Button>
          )}
        </nav>
        <ModeToggle />
      </div>
    </header>
  );
}
