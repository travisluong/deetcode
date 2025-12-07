import Footer from "@/components/footer";
import Header from "@/components/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-0 h-[100vh]">
      <Header />
      <main className="flex-grow">{children}</main>
    </section>
  );
}
