export const siteConfig = {
  name: "Blog ModAPK",
  description: "Download latest apps, games, and tools. Free, safe, and fast downloads with detailed reviews and guides.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/blogmodapk",
    facebook: "https://facebook.com/blogmodapk",
    github: "https://github.com/blogmodapk",
  },
  keywords: [
    "apps",
    "games",
    "tools",
    "download",
    "modapk",
    "android",
    "ios",
    "software",
    "free download",
  ],
  author: {
    name: "Blog ModAPK Team",
    email: "contact@blogmodapk.com",
  },
  mainNav: [
    {
      title: "Trang chủ",
      href: "/",
    },
    {
      title: "Ứng dụng",
      href: "/apps",
    },
    {
      title: "Game",
      href: "/games",
    },
    {
      title: "Công cụ",
      href: "/tools",
    },
    {
      title: "Về chúng tôi",
      href: "/about",
    },
    {
      title: "Liên hệ",
      href: "/contact",
    },
  ],
  footerNav: [
    {
      title: "Về chúng tôi",
      items: [
        { title: "Giới thiệu", href: "/about" },
        { title: "Liên hệ", href: "/contact" },
        { title: "Điều khoản", href: "/terms" },
        { title: "Chính sách", href: "/privacy" },
      ],
    },
    {
      title: "Danh mục",
      items: [
        { title: "Ứng dụng", href: "/apps" },
        { title: "Game", href: "/games" },
        { title: "Công cụ", href: "/tools" },
        { title: "Phổ biến", href: "/popular" },
      ],
    },
    {
      title: "Hỗ trợ",
      items: [
        { title: "Hướng dẫn", href: "/guides" },
        { title: "FAQs", href: "/faqs" },
        { title: "Báo lỗi", href: "/report" },
      ],
    },
  ],
};

export type SiteConfig = typeof siteConfig;
