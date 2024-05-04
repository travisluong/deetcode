"use client";

import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";

export default function AnimateModeSwitch() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const renderMode = localStorage.getItem("deetcode-render-mode");
    switch (renderMode) {
      case "animate":
        setChecked(true);
        break;
      case "debug":
        setChecked(false);
        break;
      default:
        break;
    }
  }, []);

  function handleChange() {
    const newVal = !checked;
    setChecked(newVal);
    if (newVal) {
      window.dcInstance.changeRenderMode("animate");
      localStorage.setItem("deetcode-render-mode", "animate");
    } else {
      window.dcInstance.changeRenderMode("debug");
      localStorage.setItem("deetcode-render-mode", "debug");
    }
  }

  return (
    <div>
      <Switch checked={checked} onCheckedChange={handleChange} /> Animate Mode
    </div>
  );
}
