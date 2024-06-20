"use client";

import { useEffect, useRef } from "react";
import AnimateModeToggle from "./animate-mode-toggle";
import AnimationDelayInput from "./animation-delay-input";
import DirectionModeToggle from "./direction-mode-toggle";
import LabelModeToggle from "./label-mode-toggle";
import { SolutionDB, UserDB } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export default function Toolbar({
  solution,
  user,
}: {
  solution?: SolutionDB;
  user?: Partial<UserDB>;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center py-2">
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
        <div className="px-5 flex justify-between gap-2 items-center">
          <div>
            <Link
              className="flex gap-2 items-center"
              href={`/users/${user.username}`}
            >
              <Image
                src={user.image!}
                alt="avatar"
                width={30}
                height={30}
                className="rounded-full"
              />
              {user.username}
            </Link>
          </div>
          <div>&bull;</div>
          <div>{solution.title}</div>
        </div>
      )}
    </div>
  );
}
