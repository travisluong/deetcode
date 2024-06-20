import ProblemDetailSandbox from "@/components/problem-detail-sandbox";
import Toolbar from "@/components/toolbar";
import { readFileAsString } from "@/lib/read-file-as-string";
import { PlaygroundProblem } from "@/lib/types";
import { removeFirstLine } from "@/lib/utils";

export const metadata = { title: "Playground | DeetCode" };

export default async function Page() {
  const content = await readFileAsString("app/(main)/playground/example.ts");
  const code = removeFirstLine(content);

  const problem: PlaygroundProblem = {
    id: "",
    solution: code,
    default_code: "",
  };

  return (
    <div className="flex flex-col h-full p-2">
      <h1 className="font-brand">Playground</h1>
      <Toolbar />
      <div className="h-full">
        {/* <ProblemDetail problem={problem} /> */}
        <ProblemDetailSandbox problem={problem} isPlayground={true} />
      </div>
    </div>
  );
}
