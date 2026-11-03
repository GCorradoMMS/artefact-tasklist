import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { AppHeader } from "@/components/app-header";
import { Providers } from "@/trpc/provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const frauncesDisplay = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"], // loads the full 9–144 optical-size range; without this the file is pinned to one optical size
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Task Manager",
    template: "%s | Task Manager",
  },
  description: "A simple task manager backed by a tRPC API.",
};

export const viewport: Viewport = {
  // Aurora base (ink-50) — keeps the browser UI chrome on the page ground.
  themeColor: "#f7f7fb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${frauncesDisplay.variable} ${geistMono.variable} min-h-dvh bg-ink-50 font-sans text-ink-900 antialiased`}
      >
        <AppHeader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
