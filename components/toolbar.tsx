"use client";

import { useEffect, useRef } from "react";
import AnimateModeToggle from "./animate-mode-toggle";
import AnimationDelayInput from "./animation-delay-input";
import DirectionModeToggle from "./direction-mode-toggle";
import LabelModeToggle from "./label-mode-toggle";
import { SolutionDB, UserDB } from "@/lib/types";
import Image from "next/image";

export default function Toolbar({
  solution,
  user,
}: {
  solution?: SolutionDB;
  user?: UserDB;
}) {
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
    <div
      // @ts-ignore
      ref={ref}
      className="flex gap-2 justify-between items-center px-5 mb-2"
    >
      <div className="flex gap-2 items-center">
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
      {solution && user && (
        <div className="px-5 mb-2 flex justify-between gap-2 items-center">
          <div className="flex gap-2 items-center">
            <Image
              src={user.image!}
              alt="avatar"
              width={30}
              height={30}
              className="rounded-full"
            />
            {user.username}
          </div>
          <div>&bull;</div>
          <div>{solution.title}</div>
        </div>
      )}
    </div>
  );
}
