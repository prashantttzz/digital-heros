import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Digital Heroes | Performance, Impact, Rewards",
  description: "A premium subscription platform for golfers to track performance, support charities, and win monthly prizes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} font-outfit antialiased selection:bg-primary/20 selection:text-primary`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
