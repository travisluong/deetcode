import type { Metadata } from "next";
import { Inter, Rubik_Mono_One } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const rubik = Rubik_Mono_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: "DeetCode",
  description: "Debug and Visualize LeetCode",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, rubik.variable, "font-sans")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
