import type { Metadata } from "next";
import { Inter, Rubik_Mono_One } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#22c55e"
        />
        <meta name="msapplication-TileColor" content="#0c0a09" />
        <meta name="theme-color" content="#0c0a09" />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-CXP4PG8REY"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-CXP4PG8REY');
          `}
        </Script>
      </head>
      <body className={cn(inter.variable, rubik.variable, "font-sans")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
