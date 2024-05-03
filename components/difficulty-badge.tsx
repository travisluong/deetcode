import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

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

export default function DifficultyBadge({
  difficulty,
}: {
  difficulty: number;
}) {
  return (
    <Badge className={cn(colormap[difficulty as keyof ColorMap])}>
      {displaymap[difficulty as keyof DisplayMap]}
    </Badge>
  );
}
