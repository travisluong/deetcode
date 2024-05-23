"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { getInstance } from "@/lib/deet-instance";

export default function AnimationDelayInput() {
  const [delay, setDelay] = useState<string>("500");

  useEffect(() => {
    const animationDelayStr = localStorage.getItem("deetcode-animation-delay");
    setDelay(animationDelayStr || "500");
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const delayStr = e.target.value;
    if (!delayStr) {
      localStorage.setItem("deetcode-animation-delay", "0");
      getInstance().changeAnimationDelay(0);
      setDelay("");
      return;
    }
    const delayInt = parseInt(e.target.value);
    localStorage.setItem("deetcode-animation-delay", delayStr);
    getInstance().changeAnimationDelay(delayInt);
    setDelay(delayStr);
  }

  return (
    <div className="flex gap-2 mx-5 items-center">
      <label>Delay:</label>
      <Input
        type="text"
        value={delay}
        onChange={handleChange}
        className="w-24"
      />
    </div>
  );
}
