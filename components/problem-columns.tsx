"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import DifficultyBadge from "./difficulty-badge";
import { ProblemCategoryRow } from "@/lib/types";

export const columns: ColumnDef<ProblemCategoryRow>[] = [
  {
    accessorKey: "problem.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const problemCategory = row.original;
      return (
        <Link
          className="hover:text-primary"
          href={`/problems/${problemCategory.problem.slug}`}
        >
          {problemCategory.problem.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "category.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "problem.difficulty",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Difficulty
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const original = row.original;
      if (!original.problem.difficulty) {
        return "";
      }
      return <DifficultyBadge difficulty={original.problem.difficulty} />;
    },
  },
];
