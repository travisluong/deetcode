import ProblemDetail from "@/components/problem-detail";
import Toolbar from "@/components/toolbar";
import { readFileAsString } from "@/lib/read-file-as-string";
import { PlaygroundProblem } from "@/lib/types";
import { removeFirstLine } from "@/lib/utils";

export default async function Page() {
  const content = await readFileAsString("app/(main)/playground/example.ts");
  const code = removeFirstLine(content);

  const problem: PlaygroundProblem = {
    solution: code,
  };

  return (
    <div className="flex flex-col gap-5 px-5 h-full">
      <div className="flex justify-between">
        <h1 className="font-brand">Playground</h1>
        <Toolbar />
      </div>
      <ProblemDetail problem={problem} />
    </div>
  );
}
