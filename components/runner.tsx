"use client";

import { getInstance, setInstance } from "@/lib/deet-instance";
import { DeetCode, DeetEngine } from "@/lib/deetcode";
import { useEffect } from "react";

export default function Runner() {
  useEffect(() => {
    const deetEngine = new DeetEngine({
      selector: "#deetcode",
      renderMode: "animate",
      directionMode: "row",
      labelMode: true,
      animationDelay: 300,
    });
    setInstance(deetEngine);
    window.DeetCode = new DeetCode(deetEngine);

    window.addEventListener("message", function (e) {
      var mainWindow = e.source;
      var result = "";
      const deetConfig = e.data.deetConfig;
      const code = e.data.code;
      try {
        getInstance().init(deetConfig);
        result = eval(code);
      } catch (e) {
        result = "eval() threw an exception.";
      }
      // @ts-ignore
      mainWindow.postMessage(result, event.origin);
    });
  }, []);

  return (
    <div>
      <div id="deetcode"></div>
    </div>
  );
}
