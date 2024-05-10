"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ColumnsIcon, RowsIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DeetCode } from "@/lib/deetcode";

type DirectionMode = "row" | "column";

export default function DirectionModeToggle() {
  const [mode, setMode] = useState<DirectionMode>("row");

  useEffect(() => {
    const directionMode = localStorage.getItem("deetcode-direction-mode");
    switch (directionMode) {
      case "row":
        setMode("row");
        break;
      case "column":
        setMode("column");
        break;
      default:
        break;
    }
  }, []);

  function handleClick(mode: DirectionMode) {
    setMode(mode);
    if (mode === "row") {
      localStorage.setItem("deetcode-direction-mode", "row");
      DeetCode.instance.changeDirectionMode("row");
    } else if (mode === "column") {
      localStorage.setItem("deetcode-direction-mode", "column");
      DeetCode.instance.changeDirectionMode("column");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {mode === "column" && <RowsIcon className="h-[1.2rem] w-[1.2rem]" />}
          {mode === "row" && <ColumnsIcon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleClick("row")}>
          <ColumnsIcon className="h-[1.2rem] w-[1.2rem] mr-2" /> Row Mode
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleClick("column")}>
          <RowsIcon className="h-[1.2rem] w-[1.2rem] mr-2" />
          Column Mode
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
