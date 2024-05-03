import { LightningBoltIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

export default function Header() {
  return (
    <header className="p-3 flex justify-between border-b border-gray-800">
      <Link href="/">
        <LightningBoltIcon className="text-primary w-7 h-7 hover:text-yellow-300" />
      </Link>

      <div className="flex gap-5 items-center">
        <nav>
          <Link href="/problems" className="hover:text-primary">
            Problems
          </Link>
        </nav>
        <ModeToggle />
      </div>
    </header>
  );
}
