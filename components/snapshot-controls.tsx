"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { getInstance } from "@/lib/deet-instance";

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
    setSnapshotIndex(getInstance().snapshotIndex);
    setSnapshotLength(getInstance().snapshots.length);
  }

  function prevSnapshot() {
    setSnapshotIndex(getInstance().prevSnapshot());
  }

  function nextSnapshot() {
    setSnapshotIndex(getInstance().nextSnapshot());
  }

  function firstSnapshot() {
    setSnapshotIndex(getInstance().firstSnapshot());
  }

  function lastSnapshot() {
    setSnapshotIndex(getInstance().lastSnapshot());
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
