"use client";

import { Problem } from "@/lib/types";
import { Editor } from "@monaco-editor/react";
import { MouseEvent, useEffect, useRef } from "react";
import dc from "@/lib/deetcode";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import "@/styles/deetcode.css";
import {
  MinPriorityQueue,
  MaxPriorityQueue,
} from "@datastructures-js/priority-queue";

// TODO: MOVE SHARED TYPES INTO PROPER FILE
type RenderMode = "animate" | "debug";
type DirectionMode = "row" | "column";

export default function ProblemDetail({ problem }: { problem: Problem }) {
  const editorRef = useRef(null);
  const { theme } = useTheme();

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
        default:
          break;
      }

      let directionMode: DirectionMode = "row";
      const directionModeStr = localStorage.getItem("deetcode-direction-mode");
      switch (directionModeStr) {
        case "row":
          directionMode = "row";
          break;
        case "col":
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

      const dcInstance = new dc.DeetCode({
        selector: "#deetcode",
        renderMode: renderMode,
        directionMode: directionMode,
        labelMode: labelMode,
        animationDelay: animationDelay,
      });
      dc.DeetCode.setInstance(dcInstance);
      dc.DeetCode.instance.startRenderLoop();
      // these declarations are only necessary if we want to use the Deet classes in the editor
      window.DeetSet = dc.DeetSet;
      window.DeetMap = dc.DeetMap;
      window.DeetArray = dc.DeetArray;
      window.DeetMinPriorityQueue = dc.DeetMinPriorityQueue;
      window.DeetMaxPriorityQueue = dc.DeetMaxPriorityQueue;
      window.DeetPriorityQueue = dc.DeetPriorityQueue;
      window.MinPriorityQueue = MinPriorityQueue;
      window.MaxPriorityQueue = MaxPriorityQueue;
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
    // @ts-ignore
    const code = editorRef.current.getValue();
    console.log(code);
    try {
      dc.DeetCode.monkeyPatchAll();
      eval(code);
    } catch (error) {
      console.error(error);
    } finally {
      dc.DeetCode.undoMonkeyPatchAll();
    }
  }

  return (
    <div className="h-full w-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px] rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex dark:bg-[#1E1E1E] h-full w-full flex-grow">
            <div className="flex flex-col gap-5 h-full w-full flex-grow">
              <Editor
                height="100%"
                width="100%"
                defaultLanguage="javascript"
                defaultValue={problem.solution ?? undefined}
                onMount={handleEditorDidMount}
                theme={theme === "light" ? "vs-light" : "vs-dark"}
                options={{ minimap: { enabled: false } }}
              />
              <div className="p-5">
                <Button className="cursor-pointer" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <div id="deetcode"></div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
