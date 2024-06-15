"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function LabelModeToggle() {
  const [mode, setMode] = useState<boolean>(true);

  useEffect(() => {
    const labelMode = localStorage.getItem("deetcode-label-mode");
    switch (labelMode) {
      case "true":
        setMode(true);
        break;
      case "false":
        setMode(false);
        break;
      default:
        break;
    }
  }, []);

  function handleClick(mode: boolean) {
    setMode(mode);
    if (mode) {
      localStorage.setItem("deetcode-label-mode", "true");
    } else {
      localStorage.setItem("deetcode-label-mode", "false");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {mode === true && <EyeOpenIcon className="h-[1.2rem] w-[1.2rem]" />}
          {mode === false && <EyeNoneIcon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleClick(true)}>
          <EyeOpenIcon className="h-[1.2rem] w-[1.2rem] mr-2" /> Show Labels
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleClick(false)}>
          <EyeNoneIcon className="h-[1.2rem] w-[1.2rem] mr-2" />
          Hide Labels
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
