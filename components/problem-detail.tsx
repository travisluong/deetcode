"use client";

import { Problem } from "@/lib/types";
import { Editor } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import dc from "@/lib/deetcode";

export default function ProblemDetail({ problem }: { problem: Problem }) {
  const editorRef = useRef(null);

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
      <form onSubmit={handleSubmit}>
        <Editor
          height="50vh"
          defaultLanguage="javascript"
          defaultValue={problem.solution ?? undefined}
          onMount={handleEditorDidMount}
        />
        <button>submit</button>
      </form>
      <div id="deetcode"></div>
    </div>
  );
}
