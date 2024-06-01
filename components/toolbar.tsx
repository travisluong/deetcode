"use client";

import { useEffect, useRef } from "react";
import AnimateModeToggle from "./animate-mode-toggle";
import AnimationDelayInput from "./animation-delay-input";
import DirectionModeToggle from "./direction-mode-toggle";
import LabelModeToggle from "./label-mode-toggle";

export default function Toolbar() {
  const ref = useRef<HTMLElement | null>(null);

  function handleScroll() {
    console.log("handle scroll");

    if (!ref) {
      return;
    }
    const div = ref.current;
    const sticky = div!.offsetTop;
    if (window.scrollY > sticky) {
      div!.classList.add("fixed", "bg-muted", "z-10", "top-0", "w-full", "p-2");
    } else {
      div!.classList.remove(
        "fixed",
        "bg-muted",
        "z-10",
        "top-0",
        "w-full",
        "p-2"
      );
    }
  }

  useEffect(() => {
    window.onscroll = handleScroll;
    return () => {
      window.onscroll = null;
    };
  }, []);

  return (
    // @ts-ignore
    <div ref={ref} className="flex gap-2 items-center px-5 mb-2">
      <div>
        <LabelModeToggle />
      </div>
      <div>
        <AnimateModeToggle />
      </div>
      <div>
        <DirectionModeToggle />
      </div>
      <div>
        <AnimationDelayInput />
      </div>
    </div>
  );
}
