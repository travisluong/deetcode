import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 h-[100vh]">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </section>
  );
}
