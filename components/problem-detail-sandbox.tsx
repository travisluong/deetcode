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
import {
  BookmarkIcon,
  Pencil2Icon,
  PlayIcon,
  PlusIcon,
  ResetIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useSession } from "next-auth/react";
import createSolution, { CreateSolutionState } from "@/actions/create-solution";
import { useFormState, useFormStatus } from "react-dom";
import updateSolution from "@/actions/update-solution";
import { useToast } from "@/components/ui/use-toast";
import deleteSolution from "@/actions/delete-solution";
import { SubmitButton } from "./submit-button";

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
  const [isNew, setIsNew] = useState(false);
  const session = useSession();
  const initialState: CreateSolutionState = { errors: {} };
  const [state, dispatch] = useFormState(createSolution, initialState);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const { pending } = useFormStatus();
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
    console.log(sandboxId);
    // @ts-ignore
    const code = editorRef.current.getValue();
    const frame = document.getElementById(sandboxId!);
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
    // @ts-ignore
    editorRef.current.setValue(problem.default_code);
    setIsNew(true);
  }

  function example() {
    // @ts-ignore
    editorRef.current.setValue(problem.solution);
    setIsNew(false);
  }

  function handleShare() {
    // @ts-ignore
    setContent(editorRef.current.getValue());
  }

  async function handleSave() {
    if (!solution?.title) {
      throw new Error("solution not found");
    }
    // @ts-ignore
    const content = editorRef.current.getValue();
    const formData = new FormData();
    formData.set("id", solution.id);
    formData.set("title", solution.title);
    formData.set("content", content);
    const res = await updateSolution({}, formData);
    if (res.status === "success") {
      toast({
        description: "Save Success",
        variant: "success",
      });
    } else if (res.status === "error") {
      toast({
        description: "Save Failed",
        variant: "destructive",
      });
    }
  }

  async function handleDelete() {
    if (!solution) {
      throw new Error("solution not found");
    }
    const formData = new FormData();
    formData.set("id", solution.id);
    await deleteSolution({}, formData);
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
              src="http://localhost:3000/runner"
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
                {session.status === "unauthenticated" && isNew && !solution && (
                  <Dialog>
                    <DialogTrigger className="flex gap-2 items-center">
                      <Pencil2Icon /> Share
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Solution</DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div>Sign in to share your solution.</div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {!solution && session.status === "authenticated" && isNew && (
                  <Dialog>
                    <DialogTrigger
                      className="flex gap-2 items-center"
                      onClick={handleShare}
                    >
                      <Pencil2Icon /> Share
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Solution</DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>
                      <form action={dispatch} className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            name="title"
                            value={title}
                            className="col-span-3"
                            placeholder="Enter your title"
                            onChange={(e) => setTitle(e.target.value)}
                          />
                          {state.errors?.title && (
                            <div>
                              {state.errors?.title?.map((error) => (
                                <p key={error} className="text-red-500">
                                  {error}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                        <Input type="hidden" name="content" value={content} />
                        {state.errors?.content && (
                          <div>
                            <Label htmlFor="content">Content</Label>
                            {state.errors?.content?.map((error) => (
                              <p key={error} className="text-red-500">
                                {error}
                              </p>
                            ))}
                          </div>
                        )}
                        <Input
                          type="hidden"
                          name="problem_id"
                          value={problem.id}
                        />
                        <div>
                          <SubmitButton />
                        </div>
                        {state.message && (
                          <p className="text-red-500">{state.message}</p>
                        )}
                        {!state.errors && !state.message && (
                          <p className="text-green-500">Success</p>
                        )}
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
                {session.status === "authenticated" &&
                  session.data.user?.id === solution?.user_id && (
                    <>
                      <Button
                        variant="destructive"
                        className="flex gap-2"
                        onClick={handleDelete}
                      >
                        <TrashIcon /> Delete
                      </Button>
                      <Button
                        variant="secondary"
                        className="flex gap-2"
                        onClick={handleSave}
                      >
                        <BookmarkIcon /> Save
                      </Button>
                    </>
                  )}

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
