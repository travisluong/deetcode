"use client";

import { PlaygroundProblem, ProblemDB, SolutionDB } from "@/lib/types";
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
import { PlayIcon, PlusIcon, ResetIcon } from "@radix-ui/react-icons";
import { config } from "@/lib/config";

export default function ProblemDetailSandbox({
  problem,
  solution,
  isPlayground = false,
}: {
  problem: ProblemDB | PlaygroundProblem;
  solution?: SolutionDB;
  isPlayground?: boolean;
}) {
  const editorRef = useRef(null);
  const { theme } = useTheme();
  const [sandboxId, setSandboxId] = useState<string | null>(null);

  useEffect(() => {
    setSandboxId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    document.addEventListener("clearCode", handleClearCodeEvent);

    return () => {
      document.removeEventListener("clearCode", handleClearCodeEvent);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("message", function (e) {
      // console.log("message in sandbox", e.data);
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
    const frame = document.getElementById(sandboxId!);
    if (!frame) {
      return;
    }

    const renderMode =
      (localStorage.getItem("deetcode-render-mode") as RenderMode) || "animate";
    const directionMode =
      (localStorage.getItem("deetcode-direction-mode") as DirectionMode) ||
      "row";
    let labelMode = true;
    if (
      (localStorage.getItem("deetcode-label-mode") as LabelMode) === "false"
    ) {
      labelMode = false;
    }

    const animationDelayStr = localStorage.getItem("deetcode-animation-delay");
    const animationDelay = parseInt(animationDelayStr || "500");

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
    frame.contentWindow.postMessage(
      message,
      config.NEXT_PUBLIC_RUNNER_DOMAIN + "/runner"
    );
  }

  function plus() {
    // @ts-ignore
    editorRef.current.setValue(problem.default_code ?? "");
  }

  function example() {
    // @ts-ignore
    editorRef.current.setValue(problem.solution);
  }

  return (
    <div className="h-full w-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[400px] rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center">
            <iframe
              sandbox="allow-scripts allow-same-origin allow-modals"
              src={config.NEXT_PUBLIC_RUNNER_URL}
              id={sandboxId!}
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
                {!solution && !isPlayground && (
                  <Button
                    variant="secondary"
                    className="flex gap-2"
                    onClick={plus}
                  >
                    <PlusIcon /> New
                  </Button>
                )}

                {!solution && !isPlayground && (
                  <Button
                    variant="secondary"
                    className="flex gap-2"
                    onClick={example}
                  >
                    <ResetIcon /> Example
                  </Button>
                )}

                <Button className="flex gap-2" onClick={evaluate}>
                  <PlayIcon /> Run
                </Button>
              </div>
              <Editor
                height="100%"
                width="100%"
                defaultLanguage="javascript"
                defaultValue={
                  solution?.content ?? problem.solution ?? undefined
                }
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
