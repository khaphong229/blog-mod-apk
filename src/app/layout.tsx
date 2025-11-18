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
    default: "BlogModAPK - Tải Ứng Dụng, Game & Tools",
    template: "%s | BlogModAPK",
  },
  description: "Tải xuống ứng dụng, game và công cụ mới nhất. Download miễn phí, an toàn và nhanh chóng với đánh giá chi tiết và hướng dẫn.",
  keywords: ["apps", "games", "tools", "download", "modapk", "android", "ứng dụng", "game", "tải xuống"],
  authors: [{ name: "BlogModAPK" }],
  creator: "BlogModAPK",
  publisher: "BlogModAPK",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    title: "BlogModAPK - Tải Ứng Dụng, Game & Tools",
    description: "Tải xuống ứng dụng, game và công cụ mới nhất. Download miễn phí, an toàn và nhanh chóng.",
    siteName: "BlogModAPK",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BlogModAPK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BlogModAPK - Tải Ứng Dụng, Game & Tools",
    description: "Tải xuống ứng dụng, game và công cụ mới nhất.",
    creator: "@blogmodapk",
    images: ["/og-image.jpg"],
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
  verification: {
    google: "your-google-site-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
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
