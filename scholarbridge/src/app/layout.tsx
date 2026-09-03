import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ScholarBridge — Discover scholarships that fit you",
  description:
    "Discover scholarships tailored to your ambitions. Search, filter, and save opportunities with zero account required.",
};

function DevToolbar() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-md">
      <span className="text-secondary mr-1">Preview:</span>
      <Link href="/" className="hover:text-primary px-1.5 py-0.5 rounded hover:bg-secondary/10">Home</Link>
      <Link href="/scholarships" className="hover:text-primary px-1.5 py-0.5 rounded hover:bg-secondary/10">Directory</Link>
      <Link href="/scholarships/chevening-scholarship" className="hover:text-primary px-1.5 py-0.5 rounded hover:bg-secondary/10">Detail</Link>
      <Link href="/saved" className="hover:text-primary px-1.5 py-0.5 rounded hover:bg-secondary/10">Saved</Link>
      <Link href="/login" className="hover:text-primary px-1.5 py-0.5 rounded hover:bg-secondary/10">Login</Link>
      <Link href="/admin/scholarships/new" className="text-amber-600 dark:text-amber-400 hover:text-amber-500 px-1.5 py-0.5 rounded hover:bg-secondary/10">Admin</Link>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}