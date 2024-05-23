"use client";

import { PlaygroundProblem, ProblemDB } from "@/lib/types";
import { Editor } from "@monaco-editor/react";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { DeetCode, DeetVis, DirectionMode, RenderMode } from "@/lib/deetcode";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import "@/styles/deetcode.css";
import _ from "lodash";

export default function ProblemDetail({
  problem,
}: {
  problem: ProblemDB | PlaygroundProblem;
}) {
  const editorRef = useRef(null);
  const { theme } = useTheme();
  const [deetcode, setDeetcode] = useState<DeetCode>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const renderModeStr = localStorage.getItem("deetcode-render-mode");
      let renderMode: RenderMode = "debug";
      switch (renderModeStr) {
        case "animate":
          renderMode = "animate";
          break;
        case "debug":
          renderMode = "debug";
          break;
        case "snapshot":
          renderMode = "snapshot";
        default:
          break;
      }

      let directionMode: DirectionMode = "row";
      const directionModeStr = localStorage.getItem("deetcode-direction-mode");
      switch (directionModeStr) {
        case "row":
          directionMode = "row";
          break;
        case "column":
          directionMode = "column";
          break;
        default:
          break;
      }

      let labelMode = false;
      const labelModeStr = localStorage.getItem("deetcode-label-mode");
      switch (labelModeStr) {
        case "true":
          labelMode = true;
          break;
        case "false":
          labelMode = false;
          break;
        default:
          break;
      }

      const animationDelayStr = localStorage.getItem(
        "deetcode-animation-delay"
      );
      const animationDelay = parseInt(animationDelayStr || "1000");

      const dcInstance = new DeetCode({
        selector: "#deetcode",
        renderMode: renderMode,
        directionMode: directionMode,
        labelMode: labelMode,
        animationDelay: animationDelay,
      });
      setDeetcode(dcInstance);
      DeetCode.setInstance(dcInstance);
      window.DeetVis = new DeetVis(dcInstance);
      dcInstance.startRenderLoop();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("clearCode", handleClearCodeEvent);

    return () => {
      document.removeEventListener("clearCode", handleClearCodeEvent);
    };
  }, []);

  function handleClearCodeEvent() {
    //@ts-ignore
    editorRef.current.setValue("");
  }

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!deetcode) {
      return;
    }
    if (!editorRef.current) {
      return;
    }
    // @ts-ignore
    const code = editorRef.current.getValue();
    console.log(code);
    try {
      deetcode.emptySnapshots();
      deetcode.init();
      eval(code);
      document.dispatchEvent(new CustomEvent("deetcodeEvalCompleted"));
      if (deetcode.renderMode === "snapshot") {
        deetcode.initialSnapshot();
      }
    } catch (error) {
      console.error(error);
    } finally {
      deetcode.undoMonkeyPatchAll();
    }
  }

  return (
    <div className="h-full w-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px] rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <div id="deetcode"></div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex dark:bg-[#1E1E1E] h-full w-full flex-grow">
            <div className="flex flex-col gap-2 h-full w-full flex-grow">
              <div className="flex px-5 pt-2 justify-end">
                <Button className="cursor-pointer" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
              <Editor
                height="100%"
                width="100%"
                defaultLanguage="javascript"
                defaultValue={problem.solution ?? undefined}
                onMount={handleEditorDidMount}
                theme={theme === "light" ? "vs-light" : "vs-dark"}
                options={{ minimap: { enabled: false } }}
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
