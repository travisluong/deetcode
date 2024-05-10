"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { DeetCode } from "@/lib/deetcode";

export default function AnimationDelayInput() {
  const [delay, setDelay] = useState<number>(1000);

  useEffect(() => {
    const animationDelayStr = localStorage.getItem("deetcode-animation-delay");
    setDelay(parseInt(animationDelayStr || "1000"));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const delayStr = e.target.value;

    if (!delayStr) {
      return;
    }
    const delay = parseInt(e.target.value);
    localStorage.setItem("deetcode-animation-delay", delayStr);
    DeetCode.instance.changeAnimationDelay(delay);
    setDelay(delay);
  }

  return (
    <div className="flex gap-2 mx-5 items-center">
      <label>Delay:</label>
      <Input
        type="number"
        defaultValue={delay}
        onChange={handleChange}
        className="w-24"
      />
    </div>
  );
}
