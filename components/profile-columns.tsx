"use client";

import { ProblemSolutionUserRow } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "./ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import Image from "next/image";

export const columns: ColumnDef<ProblemSolutionUserRow>[] = [
  {
    accessorKey: "problem.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Problem
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
        <Link
          className="hover:text-primary"
          href={`/problems/${data.problem.slug}`}
        >
          {data.problem.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "solution.title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
        <Link
          className="hover:text-primary"
          href={`/problems/${data.problem.slug}/solutions/${data.solution.id}`}
        >
          {data.solution.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "solution.created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = row.original;
      return <div>{data.solution.created_at.toLocaleDateString()}</div>;
    },
  },
];
