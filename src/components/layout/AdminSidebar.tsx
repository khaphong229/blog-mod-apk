"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  Image,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Bài viết",
    href: "/admin/posts",
    icon: FileText,
    children: [
      { title: "Tất cả", href: "/admin/posts", icon: FileText },
      { title: "Tạo mới", href: "/admin/posts/create", icon: FileText },
    ],
  },
  {
    title: "Danh mục",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    title: "Thẻ",
    href: "/admin/tags",
    icon: Tags,
  },
  {
    title: "Media",
    href: "/admin/media",
    icon: Image,
  },
  {
    title: "Bình luận",
    href: "/admin/comments",
    icon: MessageSquare,
    badge: 5,
  },
  {
    title: "Người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Thống kê",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (href: string) => {
    setOpenItems((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    // Exact match or starts with the href followed by /
    if (pathname === href) return true;
    // For nested routes, check if pathname starts with href
    if (href !== "/admin/dashboard" && pathname.startsWith(href + "/")) {
      return true;
    }
    return false;
  };

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background">
      <div className="flex h-full flex-col gap-2 overflow-y-auto p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold px-2">Admin Panel</h2>
          <p className="text-sm text-muted-foreground px-2">
            Quản lý nội dung
          </p>
        </div>

        <Separator className="my-2" />

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <div key={item.href}>
              {item.children ? (
                <>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between",
                      isActive(item.href) && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => toggleItem(item.href)}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openItems.includes(item.href) && "rotate-180"
                      )}
                    />
                  </Button>
                  {openItems.includes(item.href) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start",
                              isActive(child.href) && "bg-accent text-accent-foreground"
                            )}
                          >
                            {child.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      isActive(item.href) && "bg-accent text-accent-foreground"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </nav>

        <Separator className="my-2" />

        <div className="pt-2">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start">
              ← Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
