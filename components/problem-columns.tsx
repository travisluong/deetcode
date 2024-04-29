"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Problem = {
  id: number;
  name: string | null;
  difficulty: number | null;
  category: string | null;
  slug: string;
};

type ColorMap = {
  1: string;
  2: string;
  3: string;
};

const colormap: ColorMap = {
  1: "bg-green-600 dark:bg-green-400",
  2: "bg-yellow-600 dark:bg-yellow-400",
  3: "bg-red-600 dark:bg-red-400",
};

type DisplayMap = {
  1: string;
  2: string;
  3: string;
};

const displaymap: DisplayMap = {
  1: "Easy",
  2: "Medium",
  3: "Hard",
};

export const columns: ColumnDef<Problem>[] = [
  {
    accessorKey: "name",
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
      const problem = row.original;
      return (
        <Link className="hover:text-primary" href={`/problems/${problem.slug}`}>
          {problem.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "category",
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
    accessorKey: "difficulty",
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
      if (!original.difficulty) {
        return "";
      }
      return (
        <Badge className={cn(colormap[original.difficulty as keyof ColorMap])}>
          {displaymap[original.difficulty as keyof DisplayMap]}
        </Badge>
      );
    },
  },
];
