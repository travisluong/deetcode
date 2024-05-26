"use client";

import { PlaygroundProblem, ProblemDB } from "@/lib/types";
import { Editor } from "@monaco-editor/react";
import { MouseEvent, useEffect, useRef } from "react";
import {
  DeetEngine,
  DeetCode,
  DirectionMode,
  RenderMode,
  LabelMode,
} from "@/lib/deetcode";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import "@/styles/deetcode.css";
import _ from "lodash";
import { getInstance, setInstance } from "@/lib/deet-instance";

export default function ProblemDetail({
  problem,
}: {
  problem: ProblemDB | PlaygroundProblem;
}) {
  const editorRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const renderMode =
        (localStorage.getItem("deetcode-render-mode") as RenderMode) || "debug";
      const directionMode =
        (localStorage.getItem("deetcode-direction-mode") as DirectionMode) ||
        "row";
      const labelMode =
        (localStorage.getItem("deetcode-label-mode") as LabelMode) === "true"
          ? true
          : false;

      const animationDelayStr = localStorage.getItem(
        "deetcode-animation-delay"
      );
      const animationDelay = parseInt(animationDelayStr || "1000");

      const deetEngine = new DeetEngine({
        selector: "#deetcode",
        renderMode: renderMode,
        directionMode: directionMode,
        labelMode: labelMode,
        animationDelay: animationDelay,
      });
      setInstance(deetEngine);
      window.DeetCode = new DeetCode(deetEngine);
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
    if (!getInstance()) {
      return;
    }
    if (!editorRef.current) {
      return;
    }
    // @ts-ignore
    const code = editorRef.current.getValue();
    console.log(code);
    try {
      getInstance().init();
      eval(code);
      document.dispatchEvent(new CustomEvent("deetcodeEvalCompleted"));
    } catch (error) {
      console.error(error);
    } finally {
      getInstance().end();
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
