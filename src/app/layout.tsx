import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IdeaDen - AI-powered Project Ideas, PRDs, and Blog Generation",
    template: "%s | IdeaDen",
  },
  description:
    "IdeaDen is a purpose-built creative environment with two specialized engines for generating comprehensive project blueprints and SEO-optimized blog articles.",
  keywords: [
    "AI",
    "Project Ideas",
    "PRD Generator",
    "Blog Generator",
    "IdeaDen",
    "AI Writing",
    "Startup Toolkit",
  ],
  authors: [{ name: "Jowel Islam Habib" }],
  creator: "Jowel Islam Habib",
  publisher: "Jowel Islam Habib",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        spaceGrotesk.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Suspense>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
