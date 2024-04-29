import Footer from "@/components/footer";
import Header from "@/components/header";
import { cn } from "@/lib/utils";
import { Rubik_Mono_One } from "next/font/google";

const rubik = Rubik_Mono_One({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <Header />
      <main className="max-w-md m-auto p-5">
        <h1
          className={cn(
            "font-bold text-5xl text-center text-primary",
            rubik.className
          )}
        >
          DeetCode
        </h1>
      </main>
      <Footer />
    </div>
  );
}
