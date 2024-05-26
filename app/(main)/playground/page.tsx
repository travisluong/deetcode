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
    <div className="flex flex-col gap-2 h-full">
      <h1 className="font-brand px-5">Playground</h1>
      <Toolbar />
      <div className="px-5 h-full">
        <ProblemDetail problem={problem} />
      </div>
    </div>
  );
}
