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

export default function ProblemDetail({ problem }: { problem: Problem }) {
  const editorRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      dc.configure({ selector: "#deetcode" });
      window.dc = dc;
      window.DeetSet = dc.DeetSet;
      window.DeetMap = dc.DeetMap;
      window.DeetMinPriorityQueue = dc.DeetMinPriorityQueue;
      window.DeetMaxPriorityQueue = dc.DeetMaxPriorityQueue;
      window.MinPriorityQueue = MinPriorityQueue;
      window.MaxPriorityQueue = MaxPriorityQueue;
    }
  }, []);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    // @ts-ignore
    const code = editorRef.current.getValue();
    console.log(code);
    try {
      dc.DeetSet.monkeyPatch();
      dc.DeetMap.monkeyPatch();
      dc.DeetArray.monkeyPatch();
      dc.DeetMinPriorityQueue.monkeyPatch();
      dc.DeetMaxPriorityQueue.monkeyPatch();
      eval(code);
    } catch (error) {
      console.error(error);
    } finally {
      dc.DeetSet.undoMonkeyPatch();
      dc.DeetMap.undoMonkeyPatch();
      dc.DeetArray.undoMonkeyPatch();
      dc.DeetMinPriorityQueue.undoMonkeyPatch();
      dc.DeetMaxPriorityQueue.undoMonkeyPatch();
    }
  }

  return (
    <div>
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px] rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <div className="dark:bg-[#1E1E1E]">
            <div className="flex flex-col gap-5">
              <Editor
                height="50vh"
                width="100%"
                defaultLanguage="javascript"
                defaultValue={problem.solution ?? undefined}
                onMount={handleEditorDidMount}
                theme={theme === "dark" ? "vs-dark" : "vs-light"}
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
