import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <Header />
      <main>{children}</main>
      <Footer />
    </section>
  );
}
