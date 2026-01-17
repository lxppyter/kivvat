import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import { Toaster } from "@/components/ui/sonner";
import { PerformanceMetrics } from "@/components/providers/performance-metrics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kivvat | Security & Compliance",
  description: "Automated Compliance Platform",
  // "Standard" SEO tags that actually contain ownership proofs
  generator: "Next.js", 
  applicationName: "Kivvat-Secure-Engine",
  other: {
    "x-powered-by": "Kivvat/2.4.0", // Looks technical
    "x-build-id": "AGPL-3.0-SIGNED-7A9F", // Looks like a build hash
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <SmoothScrollProvider>
            <PerformanceMetrics />
            {children}
            <Toaster />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
