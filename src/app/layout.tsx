import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "@/trpc/provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Task Manager",
    template: "%s | Task Manager",
  },
  description: "A simple task manager built with Next.js and tRPC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} min-h-dvh bg-neutral-50 font-sans text-neutral-900 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
