"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { DeetCode } from "@/lib/deetcode";
import { useEffect, useState } from "react";

export default function SnapshotControls() {
  const [snapshotIndex, setSnapshotIndex] = useState(0);
  const [snapshotLength, setSnapshotLength] = useState(0);

  useEffect(() => {
    document.addEventListener("deetcodeEvalCompleted", deetcodeEvalCompleted);

    return () => {
      document.removeEventListener(
        "deetcodeEvalCompleted",
        deetcodeEvalCompleted
      );
    };
  }, []);

  function deetcodeEvalCompleted() {
    setSnapshotIndex(DeetCode.instance.snapshotIndex);
    setSnapshotLength(DeetCode.instance.snapshots.length);
  }

  function prevSnapshot() {
    setSnapshotIndex(DeetCode.instance.prevSnapshot());
  }

  function nextSnapshot() {
    setSnapshotIndex(DeetCode.instance.nextSnapshot());
  }

  function firstSnapshot() {
    setSnapshotIndex(DeetCode.instance.firstSnapshot());
  }

  function lastSnapshot() {
    setSnapshotIndex(DeetCode.instance.lastSnapshot());
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={firstSnapshot}
        disabled={snapshotIndex <= 0}
      >
        <DoubleArrowLeftIcon />
      </Button>
      <Button
        variant="outline"
        onClick={prevSnapshot}
        disabled={snapshotIndex <= 0}
      >
        <ChevronLeftIcon />
      </Button>
      <Button variant="ghost" disabled>
        {snapshotIndex + 1} / {snapshotLength}
      </Button>
      <Button
        variant="outline"
        onClick={nextSnapshot}
        disabled={snapshotIndex >= snapshotLength - 1}
      >
        <ChevronRightIcon />
      </Button>
      <Button
        variant="outline"
        onClick={lastSnapshot}
        disabled={snapshotIndex >= snapshotLength - 1}
      >
        <DoubleArrowRightIcon />
      </Button>
    </div>
  );
}
