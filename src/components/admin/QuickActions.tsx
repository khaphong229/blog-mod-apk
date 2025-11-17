import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  FileText,
  FolderPlus,
  Tag,
  Image,
  Settings,
  Zap,
} from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      title: "Tạo bài viết mới",
      description: "Viết và xuất bản bài viết",
      icon: PlusCircle,
      href: "/admin/posts/new",
      variant: "default" as const,
    },
    {
      title: "Quản lý bài viết",
      description: "Xem và chỉnh sửa bài viết",
      icon: FileText,
      href: "/admin/posts",
      variant: "outline" as const,
    },
    {
      title: "Danh mục",
      description: "Quản lý danh mục",
      icon: FolderPlus,
      href: "/admin/categories",
      variant: "outline" as const,
    },
    {
      title: "Thẻ tags",
      description: "Quản lý tags",
      icon: Tag,
      href: "/admin/tags",
      variant: "outline" as const,
    },
    {
      title: "Thư viện media",
      description: "Quản lý hình ảnh và files",
      icon: Image,
      href: "/admin/media",
      variant: "outline" as const,
    },
    {
      title: "Cài đặt",
      description: "Cấu hình hệ thống",
      icon: Settings,
      href: "/admin/settings",
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-4 w-4" />
          Thao tác nhanh
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Button
                  variant={action.variant}
                  className="w-full h-auto flex-col items-start gap-2 p-4"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon className="h-4 w-4" />
                    <span className="font-semibold text-sm">
                      {action.title}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-normal">
                    {action.description}
                  </span>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
