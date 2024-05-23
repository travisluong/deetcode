"use client";

import { CodeIcon, EraserIcon, TableIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { getInstance } from "@/lib/deet-instance";

export default function EraseBtn() {
  function handleClearVisual() {
    getInstance().erase();
  }

  function handleClearCode() {
    const clearCodeEvent = new CustomEvent("clearCode");
    document.dispatchEvent(clearCodeEvent);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <EraserIcon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleClearCode}>
          <CodeIcon className="h-[1.2rem] w-[1.2rem] mr-2" /> Clear Code
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClearVisual}>
          <TableIcon className="h-[1.2rem] w-[1.2rem] mr-2" /> Clear Visual
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
