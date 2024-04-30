// @ts-nocheck
"use client";

import { Editor } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import dc from "@/lib/deetcode";

/**
 * Hash Set - Early Exit
 * Time O(N) | Space O(N)
 * https://leetcode.com/problems/contains-duplicate/
 * @param {number[]} nums
 * @return {boolean}
 */

var code = `
var containsDuplicate = (nums) => {
  const numSet = new Set();
  debugger;
  for (const num of nums) {
    if (numSet.has(num)) return true;
    numSet.add(num);
  }
  return false;
};

const arr = [1, 2, 3, 1];
const res = containsDuplicate(arr);
console.log(res);
`;

export default function Page() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      dc.configure({ selector: "#deetcode" });
      window.dc = dc;
    }
  }, []);

  const editorRef = useRef(null);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  function handleSubmit(e) {
    e.preventDefault();
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
          defaultValue={code}
          onMount={handleEditorDidMount}
        />
        <button>submit</button>
      </form>
      <div id="deetcode"></div>
    </div>
  );
}
