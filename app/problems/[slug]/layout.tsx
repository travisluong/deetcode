import ProblemNav from "@/components/problem-nav";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = params;

  return (
    <section>
      <ProblemNav slug={slug} />
      {children}
    </section>
  );
}
