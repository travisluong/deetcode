import Footer from "@/components/footer";
import Header from "@/components/header";
import ProblemDetailSandbox from "@/components/problem-detail-sandbox";
import ToolbarSticky from "@/components/toolbar-sticky";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { config } from "@/lib/config";
import { db } from "@/lib/db";
import { problems, users } from "@/lib/schema";
import {
  CameraIcon,
  CheckIcon,
  Crosshair2Icon,
  LoopIcon,
  PlayIcon,
} from "@radix-ui/react-icons";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Script from "next/script";

export default async function Home() {
  if (config.APP_MODE === "runner") {
    redirect("/runner");
  }
  const session = await auth();

  let user;
  if (session) {
    user = await db.query.users.findFirst({
      where: eq(users.id, session.user?.id!),
    });
  }

  const problem1 = await db.query.problems.findFirst({
    where: eq(problems.slug, "invert-binary-tree"),
  });

  if (!problem1) notFound();

  const problem2 = await db.query.problems.findFirst({
    where: eq(problems.slug, "course-schedule"),
  });

  if (!problem2) notFound();

  const problem3 = await db.query.problems.findFirst({
    where: eq(problems.slug, "number-of-islands"),
  });

  if (!problem3) notFound();

  const problem4 = await db.query.problems.findFirst({
    where: eq(problems.slug, "word-search-ii"),
  });

  if (!problem4) notFound();

  return (
    <div className="h-full">
      <Header user={user} />
      <main className="flex flex-col h-full gap-5">
        <h1 className="font-bold text-5xl text-center text-primary font-brand mt-10">
          DeetCode
        </h1>
        <h2 className="text-3xl text-center font-bold">
          Debug and Visualize LeetCode Problems
        </h2>
        <p className="text-center mb-10">
          A new way to train for technical interviews.
        </p>

        <h2 className="text-2xl text-center text-primary font-brand">
          Data Structures
        </h2>
        <p className="text-center p-5">
          Visualize LeetCode algorithms and data structures with minimal code
          using DeetCode utility functions
        </p>
        <ul className="grid grid-cols-3 max-w-5xl m-auto p-5">
          <li className="flex gap-2 items-center">
            <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" /> Set
          </li>
          <li className="flex gap-2 items-center">
            <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" /> Map
          </li>
          <li className="flex gap-2 items-center">
            <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" /> Array
          </li>
          <li className="flex gap-2 items-center">
            <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" /> 2D
            Array
          </li>
          <li className="flex gap-2 items-center">
            <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" /> Min
            Priority Queue
          </li>
          <li className="flex gap-2 items-center">
            <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" /> Max
            Priority Queue
          </li>
          <li className="flex gap-2 items-center">
            <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" />{" "}
            Priority Queue
          </li>
          <li className="flex gap-2 items-center">
            <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" /> Linked
            List
          </li>
          <li className="flex gap-2 items-center">
            <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" /> Bitwise
          </li>
          <li className="flex gap-2 items-center">
            <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" /> Tree
          </li>
          <li className="flex gap-2 items-center">
            <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" /> Trie
          </li>
          <li className="flex gap-2 items-center">
            <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" /> Graph
          </li>
        </ul>

        <h2 className="text-2xl text-center text-primary font-brand mt-10">
          Rendering Modes
        </h2>
        <ul className="flex flex-col m-auto max-w-lg gap-5 p-5">
          <li className="flex gap-5 items-center">
            <PlayIcon className="text-primary w-8 h-8 flex-shrink-0" /> Animate
            - Visualize the algorithm one time.
          </li>
          <li className="flex gap-5 items-center">
            <Crosshair2Icon className="text-primary w-8 h-8 flex-shrink-0" />{" "}
            Debug - Visualize the algorithm as you step through the code using a
            debugger and browser dev tool.
          </li>
          <li className="flex gap-5 items-center">
            <CameraIcon className="text-primary w-8 h-8 flex-shrink-0" />{" "}
            Snapshot - View snapshots of your algorithm going backward or
            forward.
          </li>
          <li className="flex gap-5 items-center">
            <LoopIcon className="text-primary w-8 h-8 flex-shrink-0" /> Loop -
            Continuously loop through your algorithm animation.
          </li>
        </ul>

        <h2 className="text-2xl text-center text-primary font-brand mt-10">
          Try DeetCode
        </h2>
        <div className="flex flex-col justify-center text-center gap-5">
          <p className="p-5">
            Switch between different rendering modes and display options with
            the toolbar.
          </p>
          <div className="bg-muted pt-2">
            <ToolbarSticky />
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-2xl font-bold">{problem1.name}</h3>
          <ProblemDetailSandbox problem={problem1} isPlayground={true} />
        </div>
        <div className="p-5">
          <h3 className="text-2xl font-bold">{problem2.name}</h3>
          <ProblemDetailSandbox problem={problem2} isPlayground={true} />
        </div>
        <div className="p-5">
          <h3 className="text-2xl font-bold">{problem3.name}</h3>
          <ProblemDetailSandbox problem={problem3} isPlayground={true} />
        </div>
        <div className="p-5">
          <h3 className="text-2xl font-bold">{problem4.name}</h3>
          <ProblemDetailSandbox problem={problem4} isPlayground={true} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10 p-5">
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl text-center text-primary font-brand">
              Problems
            </h2>
            <p className="text-center">
              View all the problems currently on DeetCode
            </p>
            <div className="text-center">
              <Link href="/problems">
                <Button>All Problems</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl text-center text-primary font-brand">
              Blind 75
            </h2>
            <p className="text-center">
              Get started with the popular Blind 75 curated list
            </p>
            <div className="text-center">
              <Link href="/problem-list/blind-75">
                <Button>Blind 75 List</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl text-center text-primary font-brand">
              Playground
            </h2>
            <p className="text-center">
              Try the different DeetCode utilities at the Playground
            </p>
            <div className="text-center">
              <Link href="/playground">
                <Button>Try Now</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 m-auto max-w-lg flex flex-col gap-5 p-5">
          <h2 className="text-2xl text-center text-primary font-brand">
            FREE Download
          </h2>
          <p>
            If you&apos;re serious about becoming great at leetcoding, then you
            should download DeetCode&apos;s amazingly useful guide. Download
            includes:
          </p>
          <ul>
            <li className="flex gap-2 items-center">
              <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" />
              DeetCode&apos;s Guide To LeetCoding
            </li>
            <li className="flex gap-2 items-center">
              <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" />
              JavaScript Cheat Sheet For LeetCoding
            </li>
            <li className="flex gap-2 items-center">
              <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" />
              Exclusive Deals
            </li>
            <li className="flex gap-2 items-center">
              <CheckIcon className="text-primary w-8 h-8 flex-shrink-0" />
              Latest News
            </li>
          </ul>
          <div className="flex justify-center mb-10">
            <a
              data-formkit-toggle="af437c0185"
              href="https://deetcode.ck.page/af437c0185"
              className="bg-primary text-primary-foreground rounded-2xl p-3 font-bold hover:bg-primary/85"
            >
              Subscribe &amp; Download
            </a>
            <Script
              async
              data-uid="af437c0185"
              src="https://deetcode.ck.page/af437c0185/index.js"
              strategy="afterInteractive"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
