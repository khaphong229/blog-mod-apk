import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Blog ModAPK - Download Apps, Games & Tools",
    template: "%s | Blog ModAPK",
  },
  description: "Download latest apps, games, and tools. Free, safe, and fast downloads with detailed reviews and guides.",
  keywords: ["apps", "games", "tools", "download", "modapk", "android"],
  authors: [{ name: "Blog ModAPK" }],
  creator: "Blog ModAPK",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    title: "Blog ModAPK - Download Apps, Games & Tools",
    description: "Download latest apps, games, and tools. Free, safe, and fast downloads.",
    siteName: "Blog ModAPK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog ModAPK",
    description: "Download latest apps, games, and tools.",
    creator: "@blogmodapk",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          <QueryProvider>
            {children}
            <ToastProvider />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
