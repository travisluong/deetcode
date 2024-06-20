import { Button } from "@/components/ui/button";
import { VideoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Page() {
  return (
    <div className="m-auto max-w-lg p-5 flex flex-col gap-5">
      <p>🚧 Video is under construction. 🚧</p>
      <Link href="https://www.youtube.com/@deetcode">
        <Button>
          <VideoIcon className="h-4 w-4 mr-2" /> Subscribe at YouTube for
          updates
        </Button>
      </Link>
    </div>
  );
}
