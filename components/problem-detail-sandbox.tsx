"use client";

import { PlaygroundProblem, ProblemDB } from "@/lib/types";
import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { DirectionMode, RenderMode, LabelMode } from "@/lib/deetcode";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import "@/styles/deetcode.css";
import _ from "lodash";
import {
  Pencil2Icon,
  PlayIcon,
  PlusIcon,
  ResetIcon,
} from "@radix-ui/react-icons";

export default function ProblemDetailSandbox({
  problem,
}: {
  problem: ProblemDB | PlaygroundProblem;
}) {
  const editorRef = useRef(null);
  const { theme } = useTheme();
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    document.addEventListener("clearCode", handleClearCodeEvent);

    return () => {
      document.removeEventListener("clearCode", handleClearCodeEvent);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("message", function (e) {
      console.log("message in sandbox", e.data);
    });
  }, []);

  function handleClearCodeEvent() {
    //@ts-ignore
    editorRef.current.setValue("");
  }

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  function evaluate() {
    // @ts-ignore
    const code = editorRef.current.getValue();
    const frame = document.getElementById("sandboxed");
    if (!frame) {
      return;
    }

    const renderMode =
      (localStorage.getItem("deetcode-render-mode") as RenderMode) || "debug";
    const directionMode =
      (localStorage.getItem("deetcode-direction-mode") as DirectionMode) ||
      "row";
    const labelMode =
      (localStorage.getItem("deetcode-label-mode") as LabelMode) === "true"
        ? true
        : false;

    const animationDelayStr = localStorage.getItem("deetcode-animation-delay");
    const animationDelay = parseInt(animationDelayStr || "1000");

    const deetConfig = {
      renderMode,
      directionMode,
      labelMode,
      animationDelay,
    };

    const message = {
      code,
      deetConfig,
    };
    // @ts-ignore
    frame.contentWindow.postMessage(message, "*");
  }

  function plus() {
    setIsNew(true);
    // @ts-ignore
    editorRef.current.setValue(problem.default_code);
  }

  function reset() {
    setIsNew(false);
    // @ts-ignore
    editorRef.current.setValue(problem.solution);
  }

  function share() {}

  return (
    <div className="h-full w-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px] rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center">
            <iframe
              sandbox="allow-scripts allow-same-origin allow-modals"
              src="http://localhost:3000/runner"
              id="sandboxed"
              width="100%"
              height="100%"
            ></iframe>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex dark:bg-[#1E1E1E] h-full w-full flex-grow">
            <div className="flex flex-col gap-2 h-full w-full flex-grow">
              <div className="flex px-5 pt-2 justify-end gap-2">
                {isNew && (
                  <Button
                    variant="secondary"
                    className="flex gap-2"
                    onClick={share}
                  >
                    <Pencil2Icon /> Share
                  </Button>
                )}
                <Button
                  variant="secondary"
                  className="flex gap-2"
                  onClick={reset}
                >
                  <ResetIcon /> Reset
                </Button>
                <Button
                  variant="secondary"
                  className="flex gap-2"
                  onClick={plus}
                >
                  <PlusIcon /> New
                </Button>
                <Button className="flex gap-2" onClick={evaluate}>
                  <PlayIcon /> Run
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
