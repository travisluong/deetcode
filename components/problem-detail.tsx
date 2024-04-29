"use client";

import { Problem } from "@/lib/types";
import { Editor } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import dc from "@/lib/deetcode";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export default function ProblemDetail({ problem }: { problem: Problem }) {
  const editorRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      dc.configure({ selector: "#deetcode" });
      // @ts-ignore
      window.dc = dc;
    }
  }, []);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  // @ts-ignore
  function handleSubmit(e) {
    debugger;
    e.preventDefault();
    // @ts-ignore
    const code = editorRef.current.getValue();
    console.log(code);
    dc.monkeyPatch(window);
    eval(code);
    dc.undoMonkeyPatch(window);
  }

  return (
    <div>
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
          <div className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Editor
                height="50vh"
                width="100%"
                defaultLanguage="javascript"
                defaultValue={problem.solution ?? undefined}
                onMount={handleEditorDidMount}
                theme={theme === "dark" ? "vs-dark" : "vs-light"}
              />
              <div>
                <Button type="submit">submit</Button>
              </div>
            </form>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
