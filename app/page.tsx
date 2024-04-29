import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="max-w-md m-auto p-5">
        <h1 className="font-bold text-5xl text-center text-primary font-brand">
          DeetCode
        </h1>
      </main>
      <Footer />
    </div>
  );
}
