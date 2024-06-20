"use client";

import { getInstance, setInstance } from "@/lib/deet-instance";
import { DeetCode, DeetEngine } from "@/lib/deetcode";
import { useEffect, useRef } from "react";
import SnapshotControls from "./snapshot-controls";

export default function Runner() {
  const runOnce = useRef(false);

  useEffect(() => {
    if (runOnce.current) {
      return;
    }
    runOnce.current = true;
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
      let instance = getInstance();
      let errMsg = "";

      try {
        instance.init(deetConfig);
        result = eval(code);
        document.dispatchEvent(new CustomEvent("deetcodeEvalCompleted"));
      } catch (e) {
        result = "eval() threw an exception.";
        // @ts-ignore
        errMsg = e.message;
      } finally {
        instance.end();
        instance.renderError("Error: " + errMsg);
      }
      // @ts-ignore
      mainWindow.postMessage(result, event.origin);
    });
  }, []);

  return (
    <div>
      <SnapshotControls />
      <div id="deetcode"></div>
    </div>
  );
}
