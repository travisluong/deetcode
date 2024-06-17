"use client";

import { useEffect, useState } from "react";
import { RenderMode } from "@/lib/deetcode";
import { Button } from "./ui/button";
import {
  CameraIcon,
  Crosshair2Icon,
  LoopIcon,
  PlayIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function AnimateModeToggle() {
  const [mode, setMode] = useState<RenderMode>("animate");

  useEffect(() => {
    const renderMode =
      (localStorage.getItem("deetcode-render-mode") as RenderMode) || "animate";
    setMode(renderMode);
  }, []);

  function handleClick(mode: RenderMode) {
    setMode(mode);
    switch (mode) {
      case "animate":
        localStorage.setItem("deetcode-render-mode", "animate");
        break;
      case "debug":
        localStorage.setItem("deetcode-render-mode", "debug");
        break;
      case "snapshot":
        localStorage.setItem("deetcode-render-mode", "snapshot");
        break;
      case "loop":
        localStorage.setItem("deetcode-render-mode", "loop");
      default:
        break;
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
          {mode === "snapshot" && (
            <CameraIcon className="h-[1.2rem] w-[1.2rem]" />
          )}
          {mode === "loop" && <LoopIcon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleClick("animate")}>
          <PlayIcon className="h-[1.2rem] w-[1.2rem] mr-2" /> Animate Mode
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleClick("snapshot")}>
          <CameraIcon className="h-[1.2rem] w-[1.2rem] mr-2" /> Snapshot Mode
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleClick("loop")}>
          <LoopIcon className="h-[1.2rem] w-[1.2rem] mr-2" /> Loop Mode
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
