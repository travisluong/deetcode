"use client";

import { useEffect, useState } from "react";
import { DeetCode } from "@/lib/deetcode";
import { Button } from "./ui/button";
import { Crosshair2Icon, PlayIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type RenderMode = "animate" | "debug";

export default function AnimateModeToggle() {
  const [mode, setMode] = useState<RenderMode>("animate");

  useEffect(() => {
    const renderMode = localStorage.getItem("deetcode-render-mode");
    switch (renderMode) {
      case "animate":
        setMode("animate");
        break;
      case "debug":
        setMode("debug");
        break;
      default:
        break;
    }
  }, []);

  function handleClick(mode: RenderMode) {
    setMode(mode);
    if (mode === "animate") {
      DeetCode.instance.changeRenderMode("animate");
      localStorage.setItem("deetcode-render-mode", "animate");
    } else {
      DeetCode.instance.changeRenderMode("debug");
      localStorage.setItem("deetcode-render-mode", "debug");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {mode === "animate" && <PlayIcon className="h-[1.2rem] w-[1.2rem]" />}
          {mode === "debug" && (
            <Crosshair2Icon className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleClick("animate")}>
          <PlayIcon className="h-[1.2rem] w-[1.2rem] mr-2" /> Animate Mode
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleClick("debug")}>
          <Crosshair2Icon className="h-[1.2rem] w-[1.2rem] mr-2" /> Debug Mode
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
