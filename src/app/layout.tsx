import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Global Tax API | Micro-SaaS Tax Compliance",
  description: "Cross-border Micro-Tax & VAT Lookup API for Indie Hackers. Support for 50 US States, EU, Japan, and Korea.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased`}>
      <body className="bg-mesh min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
