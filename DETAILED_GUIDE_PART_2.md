# Hướng Dẫn Chi Tiết - PHẦN 2: ADMIN PANEL & ADVANCED FEATURES

> Tiếp theo từ PHẦN 1 (Bước 1-9)
>
> File này cover **Bước 10-20**: Admin Dashboard, Post Management, Rich Text Editor, Comments, SEO, Analytics, Settings...

---

## PHẦN 2: ADMIN PANEL & QUẢN LÝ WEBSITE

---

## Bước 10: Tạo Admin Dashboard

### 🎯 Bước này làm gì?
Tạo trang dashboard (bảng điều khiển) cho admin quản lý website.

### 🤔 Tại sao cần làm?
- **Quản lý tập trung**: Một nơi để xem tổng quan
- **Thống kê**: Số liệu về posts, users, views, downloads
- **Truy cập nhanh**: Quick actions đến các trang quản lý
- **Monitor**: Theo dõi hoạt động gần đây

### 📝 Làm như thế nào?

**Bước 10.1: Tạo Admin Layout**

File `src/app/admin/layout.tsx`:
```typescript
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Header } from "@/components/layout/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        {/* Sidebar - Fixed bên trái */}
        <AdminSidebar />

        {/* Main Content - Padding left để tránh sidebar */}
        <main className="pl-64 pt-0">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

**Giải thích layout:**
- `pl-64`: Padding left 256px (width của sidebar)
- Sidebar fixed, content scroll được

**Bước 10.2: Tạo Admin Sidebar**

File `src/components/layout/AdminSidebar.tsx`:
```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Bài viết", href: "/admin/posts", icon: FileText },
  { title: "Danh mục", href: "/admin/categories", icon: FolderOpen },
  { title: "Tags", href: "/admin/tags", icon: Tags },
  { title: "Bình luận", href: "/admin/comments", icon: MessageSquare },
  { title: "Người dùng", href: "/admin/users", icon: Users },
  { title: "Thống kê", href: "/admin/analytics", icon: BarChart3 },
  { title: "Cài đặt", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  // Hook lấy current path
  const pathname = usePathname();

  // Function check active link
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background">
      <div className="flex h-full flex-col gap-2 overflow-y-auto p-4">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold px-2">Admin Panel</h2>
          <p className="text-sm text-muted-foreground px-2">
            Quản lý nội dung
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive(item.href) && "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
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
```

**Bước 10.3: Tạo Dashboard Page**

File `src/app/admin/dashboard/page.tsx`:
```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Users,
  Eye,
  Download,
  TrendingUp,
  Loader2,
} from "lucide-react";
import axios from "@/lib/axios";
import Link from "next/link";

// Function fetch stats từ API
async function getDashboardStats() {
  const response = await axios.get("/api/admin/dashboard/stats?period=30");
  return response.data;
}

// Component hiển thị stats card
function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  growth,
}: {
  title: string;
  value: number;
  icon: any;
  description?: string;
  growth?: { count: number; percent: string };
}) {
  const isPositive = growth && parseFloat(growth.percent) > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        {/* Số liệu chính */}
        <div className="text-2xl font-bold">
          {value.toLocaleString()}
        </div>

        {/* Growth indicator */}
        {growth && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <TrendingUp className={`h-3 w-3 ${
              isPositive ? "text-green-500" : "text-red-500"
            }`} />
            <span className={isPositive ? "text-green-500" : "text-red-500"}>
              {growth.percent}%
            </span>
            <span>({growth.count}) trong 30 ngày</span>
          </div>
        )}

        {description && !growth && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  // Fetch dashboard stats
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 60 * 1000, // Cache 1 phút
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">
          Không thể tải dữ liệu dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Chào mừng bạn trở lại! Đây là tổng quan hệ thống.
        </p>
      </div>

      {/* Main Stats - Grid 4 columns */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng bài viết"
          value={data.totals.posts}
          icon={FileText}
          growth={data.growth.posts}
        />
        <StatsCard
          title="Lượt xem"
          value={data.totals.views}
          icon={Eye}
          growth={data.growth.views}
        />
        <StatsCard
          title="Lượt tải"
          value={data.totals.downloads}
          icon={Download}
          growth={data.growth.downloads}
        />
        <StatsCard
          title="Người dùng"
          value={data.totals.users}
          icon={Users}
          growth={data.growth.users}
        />
      </div>

      {/* Recent Posts & Comments - Grid 2 columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Posts Card */}
        <Card>
          <CardHeader>
            <CardTitle>Bài viết gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentPosts.map((post) => (
                <div key={post.id} className="flex gap-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/post/${post.slug}`}
                      className="font-medium hover:text-primary line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={
                        post.status === "PUBLISHED" ? "default" : "secondary"
                      }>
                        {post.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Comments Card */}
        <Card>
          <CardHeader>
            <CardTitle>Bình luận gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentComments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <p className="text-sm line-clamp-2">{comment.content}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant={
                      comment.status === "APPROVED" ? "default" : "secondary"
                    }>
                      {comment.status}
                    </Badge>
                    <span>{comment.author.name || "Anonymous"}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/posts/create">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">Tạo bài viết</span>
                </CardContent>
              </Card>
            </Link>
            {/* More quick actions... */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Bước 10.4: Tạo API cho Dashboard Stats**

File `src/app/api/admin/dashboard/stats/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check role
  const userRole = (session.user as any).role;
  if (!["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(userRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get period từ query params
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("period") || "30");
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Fetch tất cả stats song song (parallel)
  const [
    totalPosts,
    totalUsers,
    totalDownloads,
    totalViews,
    recentPosts,
    recentComments,
    postsGrowth,
    downloadsGrowth,
  ] = await Promise.all([
    // Total counts
    prisma.post.count(),
    prisma.user.count(),
    prisma.download.count(),
    prisma.post.aggregate({ _sum: { viewCount: true } }),

    // Recent activities
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true,
      },
    }),

    prisma.comment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        status: true,
        createdAt: true,
        author: { select: { name: true } },
      },
    }),

    // Growth metrics
    prisma.post.count({
      where: { createdAt: { gte: startDate } },
    }),

    prisma.download.count({
      where: { createdAt: { gte: startDate } },
    }),
  ]);

  // Calculate growth percentages
  const postsGrowthPercent = totalPosts > 0
    ? ((postsGrowth / totalPosts) * 100).toFixed(1)
    : 0;

  const downloadsGrowthPercent = totalDownloads > 0
    ? ((downloadsGrowth / totalDownloads) * 100).toFixed(1)
    : 0;

  return NextResponse.json({
    totals: {
      posts: totalPosts,
      users: totalUsers,
      downloads: totalDownloads,
      views: totalViews._sum.viewCount || 0,
    },
    growth: {
      posts: { count: postsGrowth, percent: postsGrowthPercent },
      downloads: { count: downloadsGrowth, percent: downloadsGrowthPercent },
    },
    recentPosts,
    recentComments,
  });
}
```

### 💡 Kiến thức cần biết

**1. Admin Layout Pattern**
- Sidebar fixed bên trái
- Content area với padding
- Responsive: Sidebar ẩn trên mobile

**2. Protected Routes**
- Check session trước khi cho access
- Redirect nếu chưa đăng nhập
- Check role (ADMIN, EDITOR...)

**3. React Query Caching**
- `staleTime`: Bao lâu data coi là "fresh"
- Auto refetch khi tab focus lại
- Background refetching

**4. Parallel Data Fetching**
- `Promise.all([...])`: Fetch nhiều queries cùng lúc
- Nhanh hơn fetch tuần tự
- Dùng cho independent queries

**5. Stats Calculation**
- `aggregate`: Tính tổng, trung bình...
- `count`: Đếm số lượng
- Growth rate: `(new / old) * 100`

---

## Bước 11: Post Management (Quản Lý Bài Viết)

### 🎯 Bước này làm gì?
Tạo trang quản lý bài viết: xem danh sách, tạo mới, sửa, xóa.

### 🤔 Tại sao cần làm?
- **CRUD Operations**: Create, Read, Update, Delete posts
- **Filter & Search**: Tìm bài viết nhanh
- **Bulk Actions**: Xóa nhiều bài cùng lúc
- **Status Management**: Draft, Published, Archived

### 📝 Làm như thế nào?

**Bước 11.1: Tạo Posts List Page**

File `src/app/admin/posts/page.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Edit, Trash2, Plus } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

// Function fetch posts
async function getPosts(page: number, status: string, search: string) {
  const response = await axios.get("/api/admin/posts", {
    params: { page, limit: 20, status, search },
  });
  return response.data;
}

// Function delete post
async function deletePost(id: string) {
  await axios.delete(`/api/admin/posts/${id}`);
}

export default function PostsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Query posts
  const { data, isLoading } = useQuery({
    queryKey: ["admin-posts", page, status, search],
    queryFn: () => getPosts(page, status, search),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Xóa bài viết thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      setDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error("Không thể xóa bài viết");
    },
  });

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Bài viết</h1>
          <p className="text-muted-foreground mt-1">
            Tạo, chỉnh sửa và quản lý bài viết
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/create">
            <Plus className="mr-2 h-4 w-4" />
            Tạo bài viết
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="flex gap-2">
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status Filter */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="PUBLISHED">Đã xuất bản</SelectItem>
              <SelectItem value="DRAFT">Bản nháp</SelectItem>
              <SelectItem value="ARCHIVED">Lưu trữ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Posts Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : data && data.posts.length > 0 ? (
        <>
          <div className="space-y-4">
            {data.posts.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{post.title}</h3>
                      <Badge variant={
                        post.status === "PUBLISHED" ? "default" :
                        post.status === "DRAFT" ? "secondary" : "outline"
                      }>
                        {post.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Tác giả: {post.author.name}</span>
                      <span>•</span>
                      <span>Danh mục: {post.category?.name || "Chưa có"}</span>
                      <span>•</span>
                      <span>{post.viewCount} lượt xem</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Sửa
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: data.pagination.totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={page === i + 1 ? "default" : "outline"}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Không tìm thấy bài viết nào</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

**Bước 11.2: Tạo API cho Posts**

File `src/app/api/admin/posts/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Lấy danh sách posts
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search") || "";

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  if (status !== "all") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  // Fetch posts và count
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST - Tạo post mới
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  const post = await prisma.post.create({
    data: {
      ...data,
      authorId: session.user.id,
    },
  });

  return NextResponse.json({ success: true, post });
}
```

File `src/app/api/admin/posts/[id]/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH - Update post
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const data = await request.json();

  const post = await prisma.post.update({
    where: { id },
    data,
  });

  return NextResponse.json({ success: true, post });
}

// DELETE - Xóa post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  await prisma.post.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
```

### 💡 Kiến thức cần biết

**1. React Query Mutations**
- `useMutation`: Cho operations thay đổi data (POST, PUT, DELETE)
- `onSuccess`: Callback khi thành công
- `onError`: Callback khi lỗi
- `invalidateQueries`: Refetch data sau khi mutation

**2. Optimistic Updates**
- Update UI ngay lập tức
- Rollback nếu request fail
- Better UX

**3. Prisma Where Clause**
- `contains`: Tìm kiếm substring
- `mode: "insensitive"`: Không phân biệt hoa thường
- `OR`: Điều kiện OR
- `AND`: Điều kiện AND

**4. Toast Notifications**
- Thông báo nhỏ ở góc màn hình
- Auto dismiss sau vài giây
- Success (green), Error (red), Info (blue)

**5. Alert Dialog**
- Confirmation dialog
- Prevent accidental deletes
- Better UX

---

## Bước 12: Rich Text Editor (Tiptap)

### 🎯 Bước này làm gì?
Tích hợp editor WYSIWYG (What You See Is What You Get) để viết nội dung.

### 🤔 Tại sao cần làm?
- **User-friendly**: Viết như Word, không cần biết HTML
- **Rich formatting**: Bold, italic, lists, images, links...
- **Preview**: Thấy ngay kết quả như người dùng sẽ thấy

### 📝 Làm như thế nào?

**Bước 12.1: Cài đặt Tiptap**
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
```

**Giải thích packages:**
- `@tiptap/react`: Core React wrapper
- `@tiptap/starter-kit`: Các extensions cơ bản (bold, italic, heading...)
- `@tiptap/extension-image`: Thêm images
- `@tiptap/extension-link`: Thêm links

**Bước 12.2: Tạo TiptapEditor Component**

File `src/components/editor/TiptapEditor.tsx`:
```typescript
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  // Khởi tạo editor
  const editor = useEditor({
    extensions: [
      StarterKit,  // Bold, italic, heading, list...
      Image,       // Images
      Link.configure({
        openOnClick: false,  // Không mở link khi click trong editor
      }),
    ],
    content,  // Initial content
    onUpdate: ({ editor }) => {
      // Callback khi content thay đổi
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  // Toolbar button helper
  const ToolbarButton = ({
    onClick,
    isActive,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
  }) => (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
    >
      {children}
    </Button>
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Link */}
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("URL:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          isActive={editor.isActive("link")}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        {/* Image */}
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Image URL:");
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[400px] focus:outline-none"
      />
    </div>
  );
}
```

**Bước 12.3: Sử dụng Editor trong Post Form**

File `src/app/admin/posts/create/page.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post("/api/admin/posts", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Tạo bài viết thành công");
      router.push("/admin/posts");
    },
    onError: () => {
      toast.error("Không thể tạo bài viết");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate slug từ title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    createMutation.mutate({
      title,
      slug,
      excerpt,
      content,
      status: "DRAFT",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tạo bài viết mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Tiêu đề</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề bài viết..."
            required
          />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="excerpt">Mô tả ngắn</Label>
          <Input
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Mô tả ngắn gọn về bài viết..."
          />
        </div>

        {/* Content Editor */}
        <div className="space-y-2">
          <Label>Nội dung</Label>
          <TiptapEditor
            content={content}
            onChange={setContent}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Đang lưu..." : "Tạo bài viết"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
}
```

### 💡 Kiến thức cần biết

**1. Tiptap Architecture**
- **Editor**: Main editor instance
- **Extensions**: Plugin thêm features
- **Commands**: Methods để thao tác content
- **Schema**: Định nghĩa document structure

**2. Editor Methods**
- `chain()`: Chain nhiều commands
- `focus()`: Focus vào editor
- `run()`: Execute command
- `isActive()`: Check format active
- `getHTML()`: Get HTML content

**3. StarterKit Extensions**
Bao gồm:
- Bold, Italic, Strike, Code
- Heading (h1-h6)
- Paragraph
- Bullet List, Ordered List
- Blockquote
- Hard Break
- Undo/Redo

**4. Custom Extensions**
- Image: Thêm `<img>` tags
- Link: Thêm `<a>` tags với href
- Có thể tạo custom extensions

**5. Content Format**
- Input/Output: HTML string
- Storage: Lưu HTML vào database
- Display: Render HTML trực tiếp

---

## Bước 13: Category & Tag Management

### 🎯 Bước này làm gì?
Tạo hệ thống quản lý danh mục (categories) và thẻ (tags) để phân loại bài viết.

### 🤔 Tại sao cần làm?
- **Tổ chức nội dung**: Phân loại bài viết theo chủ đề
- **Navigation**: Người dùng dễ tìm nội dung liên quan
- **SEO**: Categories/tags tạo structure tốt cho SEO
- **Filter**: Lọc bài viết theo danh mục

### 📝 Làm như thế nào?

**Bước 13.1: Tạo Category Management Page**

File `src/app/admin/categories/page.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

// Function fetch categories
async function getCategories() {
  const response = await axios.get("/api/admin/categories");
  return response.data;
}

export default function CategoriesPage() {
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();

  // Query categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getCategories,
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingCategory) {
        // Update
        const response = await axios.patch(
          `/api/admin/categories/${editingCategory.id}`,
          data
        );
        return response.data;
      } else {
        // Create
        const response = await axios.post("/api/admin/categories", data);
        return response.data;
      }
    },
    onSuccess: () => {
      toast.success(
        editingCategory ? "Cập nhật thành công" : "Tạo danh mục thành công"
      );
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      handleCloseDialog();
    },
    onError: () => {
      toast.error("Có lỗi xảy ra");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/admin/categories/${id}`);
    },
    onSuccess: () => {
      toast.success("Xóa danh mục thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error("Không thể xóa danh mục");
    },
  });

  const handleOpenDialog = (category?: any) => {
    if (category) {
      // Edit mode
      setEditingCategory(category);
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || "");
    } else {
      // Create mode
      setEditingCategory(null);
      setName("");
      setSlug("");
      setDescription("");
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ name, slug, description });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  // Auto-generate slug từ name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!editingCategory) {
      // Only auto-generate slug when creating new
      const generatedSlug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generatedSlug);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Danh mục</h1>
          <p className="text-muted-foreground mt-1">
            Tạo và quản lý danh mục cho bài viết
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo danh mục
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category: any) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category.name}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {category._count?.posts || 0} bài
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                /{category.slug}
              </p>
              {category.description && (
                <p className="text-sm line-clamp-2 mb-4">
                  {category.description}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDialog(category)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Tên danh mục *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ví dụ: Game hành động"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="vi-du: game-hanh-dong"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL: /category/{slug || "..."}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ngắn gọn về danh mục..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa danh mục này? Các bài viết trong danh mục sẽ
              không bị xóa nhưng sẽ không còn danh mục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

**Bước 13.2: Tạo Category API Routes**

File `src/app/api/admin/categories/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Lấy tất cả categories
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  return NextResponse.json(categories);
}

// POST - Tạo category mới
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, slug, description } = await request.json();

  // Check slug unique
  const existing = await prisma.category.findUnique({
    where: { slug },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Slug đã tồn tại" },
      { status: 400 }
    );
  }

  const category = await prisma.category.create({
    data: { name, slug, description },
  });

  return NextResponse.json({ success: true, category });
}
```

File `src/app/api/admin/categories/[id]/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH - Update category
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, slug, description } = await request.json();

  // Check slug unique (exclude current category)
  const existing = await prisma.category.findFirst({
    where: {
      slug,
      NOT: { id: params.id },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Slug đã tồn tại" },
      { status: 400 }
    );
  }

  const category = await prisma.category.update({
    where: { id: params.id },
    data: { name, slug, description },
  });

  return NextResponse.json({ success: true, category });
}

// DELETE - Xóa category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.category.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
```

**Bước 13.3: Tag Management (Tương tự)**

Tags management tương tự categories, chỉ khác:
- Model: `Tag` thay vì `Category`
- Many-to-many relation với Post
- Không có description field

File `src/app/admin/tags/page.tsx` sẽ tương tự như categories page.

### 💡 Kiến thức cần biết

**1. Dialog Component**
- Modal popup để edit/create
- Controlled state với `open` prop
- `onOpenChange` để close dialog

**2. Auto-generate Slug**
- Chuyển tiếng Việt thành không dấu
- Lowercase và replace spaces với `-`
- Unique constraint trong database

**3. Prisma Relations Count**
```typescript
include: {
  _count: {
    select: { posts: true }
  }
}
```
- Đếm số bài viết trong mỗi category
- Không load hết posts (performance)

**4. Validation**
- Check slug unique trước khi create/update
- Return error 400 nếu duplicate
- Client-side validation với `required`

**5. Vietnamese Normalization**
```typescript
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.replace(/đ/g, "d")
```
- NFD: Tách ký tự và dấu thành 2 parts
- Remove dấu
- Replace đ -> d

---

## Bước 14: Media Library (Thư Viện Media)

### 🎯 Bước này làm gì?
Tạo hệ thống upload và quản lý hình ảnh, file cho website.

### 🤔 Tại sao cần làm?
- **Featured Images**: Ảnh đại diện cho bài viết
- **Content Images**: Ảnh trong nội dung
- **Organization**: Quản lý tất cả media ở một nơi
- **Reusability**: Dùng lại ảnh đã upload

### 📝 Làm như thế nào?

**Bước 14.1: Cài đặt Upload Library**
```bash
npm install uploadthing @uploadthing/react
```

**Giải thích:**
- `uploadthing`: Service upload file miễn phí
- `@uploadthing/react`: React components cho upload

**Bước 14.2: Setup UploadThing**

File `src/app/api/uploadthing/core.ts`:
```typescript
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  // Image uploader
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async () => {
      // Check authentication
      const session = await getServerSession(authOptions);
      if (!session?.user) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Save file info to database if needed
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
```

File `src/app/api/uploadthing/route.ts`:
```typescript
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
```

**Bước 14.3: Tạo Upload Component**

File `src/components/upload/ImageUpload.tsx`:
```typescript
"use client";

import { UploadButton, UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "react-hot-toast";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  mode?: "button" | "dropzone";
}

export function ImageUpload({
  onUploadComplete,
  mode = "button",
}: ImageUploadProps) {
  if (mode === "dropzone") {
    return (
      <UploadDropzone<OurFileRouter, "imageUploader">
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res?.[0]) {
            onUploadComplete(res[0].url);
            toast.success("Upload thành công!");
          }
        }}
        onUploadError={(error: Error) => {
          toast.error(`Lỗi upload: ${error.message}`);
        }}
      />
    );
  }

  return (
    <UploadButton<OurFileRouter, "imageUploader">
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        if (res?.[0]) {
          onUploadComplete(res[0].url);
          toast.success("Upload thành công!");
        }
      }}
      onUploadError={(error: Error) => {
        toast.error(`Lỗi upload: ${error.message}`);
      }}
    />
  );
}
```

**Bước 14.4: Sử dụng trong Post Form**

Update `src/app/admin/posts/create/page.tsx`:
```typescript
import { ImageUpload } from "@/components/upload/ImageUpload";

export default function CreatePostPage() {
  const [featuredImage, setFeaturedImage] = useState("");

  return (
    <form>
      {/* ... other fields ... */}

      {/* Featured Image */}
      <div className="space-y-2">
        <Label>Ảnh đại diện</Label>
        {featuredImage ? (
          <div className="relative">
            <img
              src={featuredImage}
              alt="Featured"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setFeaturedImage("")}
            >
              Xóa
            </Button>
          </div>
        ) : (
          <ImageUpload
            onUploadComplete={setFeaturedImage}
            mode="dropzone"
          />
        )}
      </div>
    </form>
  );
}
```

**Bước 14.5: Media Library Page (Optional)**

File `src/app/admin/media/page.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { X, Copy } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

async function getMedia() {
  const response = await axios.get("/api/admin/media");
  return response.data;
}

export default function MediaPage() {
  const [showUpload, setShowUpload] = useState(false);
  const { data: media, refetch } = useQuery({
    queryKey: ["admin-media"],
    queryFn: getMedia,
  });

  const handleUploadComplete = (url: string) => {
    setShowUpload(false);
    refetch();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Đã copy URL");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Thư viện Media</h1>
        <Button onClick={() => setShowUpload(!showUpload)}>
          {showUpload ? "Hủy" : "Upload ảnh"}
        </Button>
      </div>

      {showUpload && (
        <Card className="p-6">
          <ImageUpload
            onUploadComplete={handleUploadComplete}
            mode="dropzone"
          />
        </Card>
      )}

      {/* Media Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {media?.map((item: any) => (
          <Card key={item.id} className="overflow-hidden">
            <img
              src={item.url}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-3 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => copyUrl(item.url)}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy URL
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### 💡 Kiến thức cần biết

**1. UploadThing Service**
- Free tier: 2GB storage, 2GB bandwidth/month
- Auto resize và optimize images
- CDN delivery
- Alternative: Cloudinary, AWS S3

**2. File Upload Flow**
1. User chọn file
2. Client upload trực tiếp lên UploadThing
3. UploadThing trả về URL
4. Client gửi URL lên server để save vào DB

**3. Middleware Pattern**
- Check authentication trước khi upload
- Attach metadata (userId, ...)
- Prevent unauthorized uploads

**4. File Constraints**
- `maxFileSize`: Giới hạn kích thước
- `maxFileCount`: Số file tối đa
- File types: image, pdf, video...

**5. onUploadComplete**
- Callback khi upload xong
- Có thể save metadata vào database
- Return data về client

---

## Bước 15: Download System & Tracking

### 🎯 Bước này làm gì?
Tạo hệ thống download file APK và tracking số lượt tải.

### 🤔 Tại sao cần làm?
- **Download Links**: Cho phép user tải APK
- **Analytics**: Thống kê lượt download
- **Tracking**: Biết ai download, khi nào, từ đâu
- **Reports**: Báo cáo top downloads

### 📝 Làm như thế nào?

**Bước 15.1: Thêm Download Fields vào Post**

Prisma schema đã có:
```prisma
model Post {
  // ... other fields
  downloadUrl    String?
  downloadCount  Int     @default(0)
  downloads      Download[]
}

model Download {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String?
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  ipAddress String?
  userAgent String?  @db.Text
  createdAt DateTime @default(now())

  @@index([postId])
  @@index([userId])
}
```

**Bước 15.2: Tạo Download Button Component**

File `src/components/post/DownloadButton.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ExternalLink } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

interface DownloadButtonProps {
  postSlug: string;
  downloadUrl: string;
  downloadCount?: number;
}

async function trackDownload(slug: string) {
  const response = await axios.post(`/api/posts/${slug}/download`);
  return response.data;
}

export function DownloadButton({
  postSlug,
  downloadUrl,
  downloadCount = 0,
}: DownloadButtonProps) {
  const [localCount, setLocalCount] = useState(downloadCount);

  const downloadMutation = useMutation({
    mutationFn: () => trackDownload(postSlug),
    onSuccess: (data) => {
      // Update local count
      setLocalCount(data.downloadCount);

      // Open download link in new tab
      window.open(downloadUrl, "_blank");

      toast.success("Đang tải xuống...");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra");
    },
  });

  const handleDownload = () => {
    downloadMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <Button
        size="lg"
        className="w-full text-lg"
        onClick={handleDownload}
        disabled={downloadMutation.isPending}
      >
        {downloadMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <Download className="mr-2 h-5 w-5" />
            Tải xuống APK
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Download className="h-4 w-4" />
        <span>{localCount.toLocaleString()} lượt tải</span>
      </div>

      {/* External Link */}
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
      >
        <ExternalLink className="h-4 w-4" />
        Link tải trực tiếp
      </a>
    </div>
  );
}
```

**Bước 15.3: Tạo Download API**

File `src/app/api/posts/[slug]/download/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Get post
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true, downloadUrl: true, downloadCount: true },
  });

  if (!post || !post.downloadUrl) {
    return NextResponse.json(
      { error: "Post not found or no download link" },
      { status: 404 }
    );
  }

  // Get user (if logged in)
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;

  // Get IP and User Agent
  const ipAddress = request.headers.get("x-forwarded-for") ||
                    request.headers.get("x-real-ip") ||
                    "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  // Create download record
  await prisma.download.create({
    data: {
      postId: post.id,
      userId,
      ipAddress,
      userAgent,
    },
  });

  // Increment download count
  const updatedPost = await prisma.post.update({
    where: { id: post.id },
    data: { downloadCount: { increment: 1 } },
    select: { downloadCount: true },
  });

  return NextResponse.json({
    success: true,
    downloadCount: updatedPost.downloadCount,
  });
}
```

**Bước 15.4: Sử dụng trong Post Detail Page**

Update `src/components/post/PostPageClient.tsx`:
```typescript
import { DownloadButton } from "@/components/post/DownloadButton";

export function PostPageClient({ post }: { post: any }) {
  return (
    <article>
      {/* ... content ... */}

      {/* Download Section */}
      {post.downloadUrl && (
        <div className="mt-8 p-6 bg-accent/50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Tải xuống {post.title}
          </h2>
          <DownloadButton
            postSlug={post.slug}
            downloadUrl={post.downloadUrl}
            downloadCount={post.downloadCount}
          />
        </div>
      )}

      {/* ... comments ... */}
    </article>
  );
}
```

**Bước 15.5: Download Analytics**

File `src/app/admin/analytics/page.tsx`:
```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import axios from "@/lib/axios";

async function getDownloadStats() {
  const response = await axios.get("/api/admin/analytics/downloads");
  return response.data;
}

export default function AnalyticsPage() {
  const { data } = useQuery({
    queryKey: ["download-stats"],
    queryFn: getDownloadStats,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Thống kê Download</h1>

      {/* Top Downloads */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 bài viết được tải nhiều nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.topPosts?.map((post: any, index: number) => (
              <div key={post.id} className="flex items-center gap-4">
                <span className="text-2xl font-bold text-muted-foreground w-8">
                  #{index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {post.category?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold">
                    {post.downloadCount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download by Date */}
      {/* Add charts here with recharts library */}
    </div>
  );
}
```

File `src/app/api/admin/analytics/downloads/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Top 10 most downloaded posts
  const topPosts = await prisma.post.findMany({
    take: 10,
    orderBy: { downloadCount: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      downloadCount: true,
      category: { select: { name: true } },
    },
  });

  // Download trend (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentDownloads = await prisma.download.groupBy({
    by: ["createdAt"],
    where: { createdAt: { gte: thirtyDaysAgo } },
    _count: true,
  });

  return NextResponse.json({
    topPosts,
    recentDownloads,
  });
}
```

### 💡 Kiến thức cần biết

**1. Download Tracking**
- Track mỗi lần click download
- Lưu: userId (nếu có), IP, user agent, timestamp
- Increment counter trong Post

**2. IP Address Detection**
- `x-forwarded-for`: IP khi qua proxy/CDN
- `x-real-ip`: Real IP header
- Fallback: "unknown"

**3. User Agent**
- Chuỗi identify browser/device
- Dùng để phân tích: Mobile vs Desktop
- Device brand, OS version

**4. Optimistic UI Update**
- Update count ngay lập tức
- Không đợi server response
- Better UX

**5. Analytics Queries**
- `orderBy`: Sắp xếp theo download count
- `groupBy`: Nhóm theo ngày
- `_count`: Đếm số records

---

## Bước 16: Comment System (Hệ Thống Bình Luận)

### 🎯 Bước này làm gì?
Tạo hệ thống bình luận với nested replies và moderation (kiểm duyệt).

### 🤔 Tại sao cần làm?
- **Engagement**: Tương tác với người đọc
- **Community**: Xây dựng cộng đồng
- **Feedback**: Nhận phản hồi về bài viết
- **Moderation**: Kiểm soát nội dung spam/toxic

### 📝 Làm như thế nào?

**Bước 16.1: Comment Model (Đã có trong Schema)**

```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  status    CommentStatus @default(PENDING)

  // Relations
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  // Nested comments (replies)
  parentId  String?
  parent    Comment? @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies   Comment[] @relation("CommentReplies")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum CommentStatus {
  PENDING
  APPROVED
  SPAM
  REJECTED
}
```

**Bước 16.2: Tạo Comment API**

File `src/app/api/posts/[slug]/comments/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Lấy comments của post (chỉ APPROVED)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Get post
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Get approved comments
  const comments = await prisma.comment.findMany({
    where: {
      postId: post.id,
      status: "APPROVED",
      parentId: null, // Only top-level comments
    },
    include: {
      author: {
        select: { id: true, name: true, image: true, role: true },
      },
      replies: {
        where: { status: "APPROVED" },
        include: {
          author: {
            select: { id: true, name: true, image: true, role: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

// POST - Tạo comment mới
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Check authentication
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = params;
  const { content, parentId } = await request.json();

  // Validate content
  if (!content || content.trim().length === 0) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  // Get post
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Verify parent comment exists (if replying)
  if (parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parentComment || parentComment.postId !== post.id) {
      return NextResponse.json(
        { error: "Invalid parent comment" },
        { status: 400 }
      );
    }
  }

  // Create comment (status: PENDING by default)
  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      postId: post.id,
      authorId: session.user.id,
      parentId: parentId || null,
      status: "PENDING",
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  return NextResponse.json({
    success: true,
    comment,
    message: "Comment đang chờ kiểm duyệt",
  });
}
```

**Bước 16.3: Tạo Admin Comments API**

File `src/app/api/admin/comments/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status !== "all") {
    where.status = status;
  }

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      skip,
      take: limit,
      include: {
        author: { select: { name: true } },
        post: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.comment.count({ where }),
  ]);

  return NextResponse.json({
    comments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
```

File `src/app/api/admin/comments/[id]/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH - Update comment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await request.json();

  const comment = await prisma.comment.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json({ success: true, comment });
}

// DELETE - Xóa comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.comment.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
```

**Bước 16.4: Tạo Comment Components**

File `src/components/comments/CommentItem.tsx`:
```typescript
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, User } from "lucide-react";

interface CommentItemProps {
  comment: any;
  onReply?: (parentId: string, content: string) => void;
  isAuthenticated: boolean;
}

export function CommentItem({
  comment,
  onReply,
  isAuthenticated,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = () => {
    if (onReply && replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent("");
      setShowReplyForm(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Comment */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.author.image ? (
            <img
              src={comment.author.image}
              alt={comment.author.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          {/* Author & Date */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{comment.author.name}</span>

            {/* Role Badge */}
            {comment.author.role === "ADMIN" && (
              <Badge variant="default">Admin</Badge>
            )}
            {comment.author.role === "EDITOR" && (
              <Badge variant="secondary">Editor</Badge>
            )}

            <span className="text-xs text-muted-foreground">
              {format(new Date(comment.createdAt), "dd MMM yyyy, HH:mm", {
                locale: vi,
              })}
            </span>
          </div>

          {/* Comment Text */}
          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

          {/* Reply Button */}
          {isAuthenticated && onReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Trả lời
            </Button>
          )}

          {/* Reply Form */}
          {showReplyForm && (
            <div className="space-y-2 pt-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Viết phản hồi..."
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReply}>
                  Gửi
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent("");
                  }}
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 space-y-4 border-l-2 border-accent pl-4">
          {comment.replies.map((reply: any) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

File `src/components/comments/CommentSection.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CommentItem } from "./CommentItem";
import { MessageSquare, Loader2 } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface CommentSectionProps {
  postSlug: string;
}

async function getComments(slug: string) {
  const response = await axios.get(`/api/posts/${slug}/comments`);
  return response.data;
}

async function postComment(slug: string, data: any) {
  const response = await axios.post(`/api/posts/${slug}/comments`, data);
  return response.data;
}

export function CommentSection({ postSlug }: CommentSectionProps) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  // Fetch comments
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", postSlug],
    queryFn: () => getComments(postSlug),
  });

  // Post comment mutation
  const commentMutation = useMutation({
    mutationFn: (data: any) => postComment(postSlug, data),
    onSuccess: (data) => {
      toast.success(data.message || "Bình luận đã được gửi");
      setNewComment("");
      // Refetch comments
      queryClient.invalidateQueries({ queryKey: ["comments", postSlug] });
    },
    onError: () => {
      toast.error("Không thể gửi bình luận");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    commentMutation.mutate({ content: newComment });
  };

  const handleReply = (parentId: string, content: string) => {
    commentMutation.mutate({ content, parentId });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-2xl font-bold">
          Bình luận ({comments?.length || 0})
        </h2>
      </div>

      {/* Comment Form */}
      {session ? (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              rows={4}
              required
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Bình luận sẽ được kiểm duyệt trước khi hiển thị
              </p>
              <Button type="submit" disabled={commentMutation.isPending}>
                {commentMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi bình luận"
                )}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="p-4 text-center">
          <p className="text-muted-foreground mb-4">
            Bạn cần đăng nhập để bình luận
          </p>
          <Button asChild>
            <Link href="/auth/login">Đăng nhập</Link>
          </Button>
        </Card>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment: any) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              isAuthenticated={!!session}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        </div>
      )}
    </div>
  );
}
```

**Bước 16.5: Admin Comment Management Page**

File `src/app/admin/comments/page.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle, Flag, Trash2 } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

async function getComments(status: string, page: number) {
  const response = await axios.get("/api/admin/comments", {
    params: { status, page },
  });
  return response.data;
}

async function updateCommentStatus(id: string, status: string) {
  const response = await axios.patch(`/api/admin/comments/${id}`, { status });
  return response.data;
}

async function deleteComment(id: string) {
  await axios.delete(`/api/admin/comments/${id}`);
}

export default function AdminCommentsPage() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-comments", status, page],
    queryFn: () => getComments(status, page),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateCommentStatus(id, status),
    onSuccess: () => {
      toast.success("Cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      toast.success("Xóa bình luận thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="default">Đã duyệt</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Chờ duyệt</Badge>;
      case "SPAM":
        return <Badge variant="destructive">Spam</Badge>;
      case "REJECTED":
        return <Badge variant="outline">Từ chối</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý Bình luận</h1>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="PENDING">Chờ duyệt</SelectItem>
            <SelectItem value="APPROVED">Đã duyệt</SelectItem>
            <SelectItem value="SPAM">Spam</SelectItem>
            <SelectItem value="REJECTED">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {data?.comments?.map((comment: any) => (
          <Card key={comment.id} className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.author.name}</span>
                    {getStatusBadge(comment.status)}
                  </div>
                  <Link
                    href={`/post/${comment.post.slug}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {comment.post.title}
                  </Link>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    statusMutation.mutate({ id: comment.id, status: "APPROVED" })
                  }
                  disabled={comment.status === "APPROVED"}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Duyệt
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    statusMutation.mutate({ id: comment.id, status: "SPAM" })
                  }
                  disabled={comment.status === "SPAM"}
                >
                  <Flag className="h-4 w-4 mr-1" />
                  Spam
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    statusMutation.mutate({ id: comment.id, status: "REJECTED" })
                  }
                  disabled={comment.status === "REJECTED"}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Từ chối
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(comment.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xóa
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### 💡 Kiến thức cần biết

**1. Nested Comments (Self-Referencing Relation)**
```prisma
parentId  String?
parent    Comment? @relation("CommentReplies", ...)
replies   Comment[] @relation("CommentReplies")
```
- Comment có thể reply comment khác
- Tạo cấu trúc cây (tree structure)

**2. Comment Moderation Flow**
1. User submit comment → Status: PENDING
2. Admin review comment
3. Admin approve/reject/spam
4. Chỉ APPROVED comments hiện lên

**3. Recursive Component**
- CommentItem render chính nó cho replies
- Border left để phân biệt levels
- Margin left để indent

**4. Comment Status Enum**
- PENDING: Chờ kiểm duyệt
- APPROVED: Đã duyệt, hiển thị
- SPAM: Đánh dấu spam
- REJECTED: Từ chối

**5. Optimistic Refetch**
- Sau khi post comment → refetch list
- Real-time updates cho user
- Show pending message

---

## Bước 17: SEO Optimization (Tối Ưu SEO)

### 🎯 Bước này làm gì?
Tối ưu website cho công cụ tìm kiếm (Google, Bing...) để được index và rank tốt hơn.

### 🤔 Tại sao cần làm?
- **Organic Traffic**: Người dùng tìm thấy site qua Google
- **Social Sharing**: Hiển thị đẹp khi share lên Facebook/Twitter
- **Indexing**: Google biết site có những gì
- **Ranking**: Rank cao hơn trong kết quả tìm kiếm

### 📝 Làm như thế nào?

**Bước 17.1: Tạo SEO Utilities**

File `src/lib/seo.ts`:
```typescript
import { Metadata } from "next";

export const SITE_NAME = "BlogModAPK";
export const SITE_DESCRIPTION =
  "Tải xuống các ứng dụng và game MOD APK miễn phí cho Android. Cập nhật hàng ngày, an toàn và đáng tin cậy.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SEOConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  noindex?: boolean;
}

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags,
  noindex = false,
}: SEOConfig): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const imageUrl = image || DEFAULT_OG_IMAGE;
  const pageUrl = url || SITE_URL;

  return {
    title: fullTitle,
    description,
    keywords: tags?.join(", "),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "vi_VN",
      type: type === "article" ? "article" : "website",
      ...(publishedTime && {
        publishedTime,
      }),
      ...(modifiedTime && {
        modifiedTime,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: "@blogmodapk",
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : {
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
    alternates: {
      canonical: pageUrl,
    },
  };
}

// Structured Data (JSON-LD) Generators

export function generateArticleSchema(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage || DEFAULT_OG_IMAGE,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateSoftwareAppSchema(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: post.title,
    description: post.excerpt,
    image: post.featuredImage || DEFAULT_OG_IMAGE,
    operatingSystem: "Android",
    applicationCategory: "GameApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "VND",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      ratingCount: post.downloadCount || 0,
    },
  };
}
```

**Bước 17.2: Tạo Sitemap**

File `src/app/sitemap.ts`:
```typescript
import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Get all published posts
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  // Get all categories
  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  });

  // Get all tags
  const tags = await prisma.tag.findMany({
    select: { slug: true, updatedAt: true },
  });

  // Static pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // Post pages
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Category pages
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Tag pages
  const tagRoutes = tags.map((tag) => ({
    url: `${baseUrl}/tag/${tag.slug}`,
    lastModified: tag.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...routes, ...postRoutes, ...categoryRoutes, ...tagRoutes];
}
```

**Bước 17.3: Tạo Robots.txt**

File `src/app/robots.ts`:
```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/auth"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

**Bước 17.4: Update Root Layout với Global SEO**

File `src/app/layout.tsx`:
```typescript
import { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "mod apk",
    "android games",
    "download apk",
    "game mod",
    "ứng dụng android",
    "tải game",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
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
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};
```

**Bước 17.5: Update Post Page với Dynamic Metadata**

File `src/app/(main)/post/[slug]/page.tsx`:
```typescript
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateMetadata as genMeta, generateArticleSchema, generateBreadcrumbSchema, generateSoftwareAppSchema, SITE_URL } from "@/lib/seo";
import { PostPageClient } from "@/components/post/PostPageClient";

interface Props {
  params: { slug: string };
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: true,
      category: true,
      tags: true,
    },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return genMeta({
    title: post.title,
    description: post.excerpt,
    image: post.featuredImage || undefined,
    url: `${SITE_URL}/post/${post.slug}`,
    type: "article",
    publishedTime: post.createdAt.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    author: post.author.name || undefined,
    tags: post.tags.map((t) => t.name),
  });
}

export default async function PostPage({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: { select: { id: true, name: true, slug: true } },
      tags: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!post) {
    notFound();
  }

  // Structured data
  const articleSchema = generateArticleSchema(post);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: post.category?.name || "Uncategorized", url: `/category/${post.category?.slug}` },
    { name: post.title, url: `/post/${post.slug}` },
  ]);
  const softwareSchema = generateSoftwareAppSchema(post);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      {/* Client Component */}
      <PostPageClient post={JSON.parse(JSON.stringify(post))} />
    </>
  );
}
```

### 💡 Kiến thức cần biết

**1. Open Graph Protocol**
- Facebook, LinkedIn, Discord sử dụng
- Tags: `og:title`, `og:description`, `og:image`
- Hiển thị rich preview khi share link

**2. Twitter Cards**
- Twitter sử dụng
- `summary_large_image`: Ảnh to
- `summary`: Ảnh nhỏ bên phải

**3. Structured Data (Schema.org)**
- JSON-LD format
- Google hiểu nội dung page
- Rich snippets trong search results
- Types: Article, BreadcrumbList, SoftwareApplication

**4. Sitemap XML**
- List tất cả URLs của site
- Google crawl nhanh hơn
- Priority và changeFrequency
- Submit lên Google Search Console

**5. Meta Tags**
- `title`: Tiêu đề page (50-60 chars)
- `description`: Mô tả (150-160 chars)
- `keywords`: Từ khóa (optional)
- `canonical`: URL chính thức

---

## Bước 18: Users & Settings Management

### 🎯 Bước này làm gì?
Quản lý người dùng (roles, permissions) và cài đặt website (site info, social links).

### 🤔 Tại sao cần làm?
- **User Management**: Phân quyền ADMIN, EDITOR, USER
- **Security**: Kiểm soát ai có quyền gì
- **Site Configuration**: Thay đổi thông tin site không cần code
- **Flexibility**: Admin tự config được

### 📝 Làm như thế nào?

**Bước 18.1: User Management API**

File `src/app/api/admin/users/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || "all";
  const search = searchParams.get("search") || "";

  const where: any = {};
  if (role !== "all") {
    where.role = role;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: {
        select: { posts: true, comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}
```

File `src/app/api/admin/users/[id]/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = (session.user as any).role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { role, name } = await request.json();

  // Prevent changing own role
  if (params.id === session.user.id) {
    return NextResponse.json(
      { error: "Cannot change your own role" },
      { status: 400 }
    );
  }

  // Only SUPER_ADMIN can manage SUPER_ADMIN roles
  if (role === "SUPER_ADMIN" && userRole !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Only SUPER_ADMIN can manage SUPER_ADMIN roles" },
      { status: 403 }
    );
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { role, name },
  });

  return NextResponse.json({ success: true, user });
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = (session.user as any).role;
  if (userRole !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Prevent self-deletion
  if (params.id === session.user.id) {
    return NextResponse.json(
      { error: "Cannot delete yourself" },
      { status: 400 }
    );
  }

  await prisma.user.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
```

**Bước 18.2: Settings API**

File `src/app/api/admin/settings/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get all settings
export async function GET() {
  const settings = await prisma.setting.findMany();

  // Convert to key-value object
  const settingsObject = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);

  return NextResponse.json(settingsObject);
}

// POST - Update settings
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = (session.user as any).role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await request.json();

  // Upsert each setting
  await Promise.all(
    Object.entries(data).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string },
      })
    )
  );

  return NextResponse.json({ success: true });
}
```

**Bước 18.3: Admin Users Page**

File `src/app/admin/users/page.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, User } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

async function getUsers(role: string, search: string) {
  const response = await axios.get("/api/admin/users", {
    params: { role, search },
  });
  return response.data;
}

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState("");
  const [editName, setEditName] = useState("");

  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ["admin-users", roleFilter, searchQuery],
    queryFn: () => getUsers(roleFilter, searchQuery),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, role, name }: any) =>
      axios.patch(`/api/admin/users/${id}`, { role, name }),
    onSuccess: () => {
      toast.success("Cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Có lỗi xảy ra");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/admin/users/${id}`),
    onSuccess: () => {
      toast.success("Xóa người dùng thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Không thể xóa");
    },
  });

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditName(user.name || "");
    setDialogOpen(true);
  };

  const handleUpdate = () => {
    updateMutation.mutate({
      id: editingUser.id,
      role: editRole,
      name: editName,
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Badge variant="destructive">Super Admin</Badge>;
      case "ADMIN":
        return <Badge variant="default">Admin</Badge>;
      case "EDITOR":
        return <Badge variant="secondary">Editor</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <Input
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="EDITOR">Editor</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {users?.map((user: any) => (
          <Card key={user.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{user.name}</h3>
                    {getRoleBadge(user.role)}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user._count.posts} bài viết • {user._count.comments} bình luận
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(user.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xóa
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tên</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdate} className="w-full">
              Lưu thay đổi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

**Bước 18.4: Admin Settings Page**

File `src/app/admin/settings/page.tsx`:
```typescript
"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

async function getSettings() {
  const response = await axios.get("/api/admin/settings");
  return response.data;
}

async function updateSettings(data: any) {
  const response = await axios.post("/api/admin/settings", data);
  return response.data;
}

export default function SettingsPage() {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: getSettings,
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      toast.success("Lưu cài đặt thành công");
    },
    onError: () => {
      toast.error("Không thể lưu cài đặt");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cài đặt Website</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tên website</Label>
              <Input
                value={formData.site_name || ""}
                onChange={(e) => handleChange("site_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                value={formData.site_description || ""}
                onChange={(e) => handleChange("site_description", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact & Social */}
        <Card>
          <CardHeader>
            <CardTitle>Liên hệ & Mạng xã hội</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email liên hệ</Label>
              <Input
                type="email"
                value={formData.contact_email || ""}
                onChange={(e) => handleChange("contact_email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Facebook URL</Label>
              <Input
                value={formData.facebook_url || ""}
                onChange={(e) => handleChange("facebook_url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Twitter URL</Label>
              <Input
                value={formData.twitter_url || ""}
                onChange={(e) => handleChange("twitter_url", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader>
            <CardTitle>SEO & Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Google Analytics ID</Label>
              <Input
                value={formData.ga_id || ""}
                onChange={(e) => handleChange("ga_id", e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label>Google Site Verification</Label>
              <Input
                value={formData.google_verification || ""}
                onChange={(e) => handleChange("google_verification", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button type="submit" size="lg" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            "Lưu cài đặt"
          )}
        </Button>
      </form>
    </div>
  );
}
```

### 💡 Kiến thức cần biết

**1. Role-Based Access Control (RBAC)**
- USER: Bình luận, view posts
- EDITOR: Tạo, sửa posts
- ADMIN: Quản lý users, settings
- SUPER_ADMIN: Full access

**2. Security Rules**
- Không cho user đổi role của chính mình
- Chỉ SUPER_ADMIN quản lý SUPER_ADMIN
- Không cho xóa chính mình

**3. Settings Pattern**
- Key-value storage
- Flexible, easy to extend
- Upsert: Update nếu có, Create nếu chưa

**4. Prisma Upsert**
```typescript
await prisma.setting.upsert({
  where: { key },
  update: { value },
  create: { key, value },
});
```

**5. Form State Management**
- Controlled components
- Single source of truth
- Batch update nhiều settings

---

## Bước 19: Analytics & Performance (Phân Tích & Hiệu Suất)

### 🎯 Bước này làm gì?
Tối ưu hiệu suất website và thêm analytics để theo dõi performance.

### 🤔 Tại sao cần làm?
- **Speed**: Website load nhanh → Better UX, better SEO
- **Monitoring**: Biết website có chậm không
- **Core Web Vitals**: Google đánh giá performance
- **User Experience**: Người dùng thích site nhanh

### 📝 Làm như thế nào?

**Bước 19.1: Dashboard với Updated Stats**

Dashboard API đã được tạo ở Bước 10, giờ update dashboard page:

File `src/app/admin/dashboard/page.tsx` (Updated với charts):
```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Users,
  Eye,
  Download,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import axios from "@/lib/axios";
import Link from "next/link";

async function getDashboardStats() {
  const response = await axios.get("/api/admin/dashboard/stats?period=30");
  return response.data;
}

function StatsCard({ title, value, icon: Icon, description, growth }: any) {
  const isPositive = growth && parseFloat(growth.percent) > 0;
  const GrowthIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {growth && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <GrowthIcon
              className={`h-3 w-3 ${isPositive ? "text-green-500" : "text-red-500"}`}
            />
            <span className={isPositive ? "text-green-500" : "text-red-500"}>
              {growth.percent}%
            </span>
            <span>({growth.count}) trong 30 ngày</span>
          </div>
        )}
        {description && !growth && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Không thể tải dữ liệu</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Chào mừng bạn trở lại! Đây là tổng quan hệ thống.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng bài viết"
          value={data.totals.posts}
          icon={FileText}
          growth={data.growth.posts}
        />
        <StatsCard
          title="Lượt xem"
          value={data.totals.views}
          icon={Eye}
          growth={data.growth.views}
        />
        <StatsCard
          title="Lượt tải"
          value={data.totals.downloads}
          icon={Download}
          growth={data.growth.downloads}
        />
        <StatsCard
          title="Người dùng"
          value={data.totals.users}
          icon={Users}
          growth={data.growth.users}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bài viết gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentPosts.map((post: any) => (
                <div key={post.id} className="flex gap-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/post/${post.slug}`}
                      className="font-medium hover:text-primary line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          post.status === "PUBLISHED" ? "default" : "secondary"
                        }
                      >
                        {post.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bình luận gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentComments.map((comment: any) => (
                <div key={comment.id} className="space-y-2">
                  <p className="text-sm line-clamp-2">{comment.content}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                      variant={
                        comment.status === "APPROVED" ? "default" : "secondary"
                      }
                    >
                      {comment.status}
                    </Badge>
                    <span>{comment.author.name || "Anonymous"}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts */}
      {data.topPosts && (
        <Card>
          <CardHeader>
            <CardTitle>Top 5 bài viết phổ biến</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topPosts.map((post: any, index: number) => (
                <div key={post.id} className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-muted-foreground w-8">
                    #{index + 1}
                  </span>
                  <div className="flex-1">
                    <Link
                      href={`/post/${post.slug}`}
                      className="font-medium hover:text-primary"
                    >
                      {post.title}
                    </Link>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{post.viewCount} views</span>
                    <span>{post.downloadCount} downloads</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

**Bước 19.2: Performance Utilities**

File `src/lib/performance.ts`:
```typescript
// Web Vitals monitoring
export function reportWebVitals(metric: any) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(metric);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === "production") {
    // Example: Send to Google Analytics
    window.gtag?.("event", metric.name, {
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

// Performance marks
export function performanceMark(name: string) {
  if (typeof window !== "undefined" && window.performance) {
    performance.mark(name);
  }
}

export function performanceMeasure(name: string, startMark: string, endMark: string) {
  if (typeof window !== "undefined" && window.performance) {
    performance.measure(name, startMark, endMark);
  }
}

// Debounce helper
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle helper
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Cache utilities
const cache = new Map<string, { data: any; timestamp: number }>();

export function getCached<T>(key: string, ttl: number = 5 * 60 * 1000): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const isExpired = Date.now() - cached.timestamp > ttl;
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

export function setCache(key: string, data: any) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// Network speed detection
export function getConnectionSpeed(): string {
  if (typeof navigator === "undefined") return "unknown";

  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  if (!connection) return "unknown";

  return connection.effectiveType || "unknown";
}
```

**Bước 19.3: Loading Components**

File `src/components/ui/loading.tsx`:
```typescript
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function Loading({ size = "md", text, className }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 className={cn(sizeClasses[size], "animate-spin text-primary")} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

// Skeleton loaders
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
```

**Bước 19.4: Next.js Performance Config**

Update `next.config.ts`:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Optimize CSS
  experimental: {
    optimizeCss: true,
  },

  // Compression
  compress: true,

  // Headers for caching
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

### 💡 Kiến thức cần biết

**1. Core Web Vitals**
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

**2. Performance Optimization Techniques**
- Image optimization (AVIF, WebP)
- Code splitting
- Lazy loading
- Caching strategies
- Compression

**3. Caching Headers**
- `max-age`: Bao lâu browser cache
- `immutable`: File không bao giờ đổi
- `public`: Có thể cache bởi CDN

**4. Debounce vs Throttle**
- **Debounce**: Delay execution cho đến khi stop
- **Throttle**: Limit số lần execute trong time period

**5. Loading States**
- Skeleton loaders: Better UX than spinners
- Progressive loading
- Suspense boundaries

---

## Bước 20: Final Polish & Additional Features

### 🎯 Bước này làm gì?
Hoàn thiện các tính năng cuối cùng: error pages, loading states, scroll to top, breadcrumbs.

### 🤔 Tại sao cần làm?
- **Error Handling**: User-friendly error pages
- **UX**: Smooth navigation, feedback
- **Polish**: Professional finishing touches
- **Accessibility**: Better cho tất cả users

### 📝 Làm như thế nào?

**Bước 20.1: Custom 404 Page**

File `src/app/not-found.tsx`:
```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-lg">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
            404
          </h1>
          <div className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-primary to-purple-600"></div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Không tìm thấy trang</h2>
          <p className="text-muted-foreground">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Tìm kiếm
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>

        {/* Suggestions */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            Hoặc xem các danh mục phổ biến:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/category/game"
              className="text-sm px-3 py-1 rounded-full bg-accent hover:bg-accent/80 transition"
            >
              Games
            </Link>
            <Link
              href="/category/app"
              className="text-sm px-3 py-1 rounded-full bg-accent hover:bg-accent/80 transition"
            >
              Apps
            </Link>
            <Link
              href="/category/tools"
              className="text-sm px-3 py-1 rounded-full bg-accent hover:bg-accent/80 transition"
            >
              Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Bước 20.2: Global Error Page**

File `src/app/error.tsx`:
```typescript
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-lg">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <AlertCircle className="h-24 w-24 text-destructive" />
            <div className="absolute inset-0 blur-xl opacity-30 bg-destructive"></div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Có lỗi xảy ra!</h2>
          <p className="text-muted-foreground">
            Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm font-medium">
                Chi tiết lỗi (Development only)
              </summary>
              <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} size="lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/">
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Bước 20.3: Scroll to Top Button**

File `src/components/ui/scroll-to-top.tsx`:
```typescript
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-8 right-8 z-50 rounded-full shadow-lg transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16 pointer-events-none"
      )}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
```

Add to main layout:

File `src/app/(main)/layout.tsx`:
```typescript
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
```

**Bước 20.4: Global Loading Page**

File `src/app/loading.tsx`:
```typescript
import { Loading } from "@/components/ui/loading";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading size="lg" text="Đang tải..." />
    </div>
  );
}
```

**Bước 20.5: Breadcrumb Component (Already created)**

The breadcrumb and back-button components were already created. They're located at:
- `src/components/ui/breadcrumb.tsx`
- `src/components/ui/back-button.tsx`

### 💡 Kiến thức cần biết

**1. Error Boundaries**
- `error.tsx`: Catch React errors
- Must be Client Component
- `reset()` function to retry

**2. Not Found Handling**
- `not-found.tsx`: Custom 404 page
- `notFound()`: Trigger from Server Component
- Better UX than default page

**3. Smooth Scrolling**
```typescript
window.scrollTo({
  top: 0,
  behavior: "smooth"
});
```

**4. Visibility Detection**
- Listen to `scroll` event
- Toggle button based on scroll position
- Cleanup event listener

**5. Loading States**
- `loading.tsx`: Route-level loading
- Suspense boundaries
- Skeleton loaders

---

## 🎉 KẾT LUẬN

Chúc mừng! Bạn đã hoàn thành tất cả **20 bước** để xây dựng một website BlogModAPK full-stack hoàn chỉnh!

### 📚 Tổng kết những gì đã làm:

**PHẦN 1 (Bước 1-9):**
- ✅ Setup project Next.js 16
- ✅ Database với Prisma + PostgreSQL
- ✅ Authentication với NextAuth v5
- ✅ Layout & UI components
- ✅ Homepage với post grid
- ✅ Category & Tag pages
- ✅ Search functionality
- ✅ Post detail page

**PHẦN 2 (Bước 10-20):**
- ✅ Admin dashboard với stats
- ✅ Post management (CRUD)
- ✅ Rich text editor (Tiptap)
- ✅ Category & Tag management
- ✅ Media library (Upload images)
- ✅ Download system với tracking
- ✅ Comment system với moderation
- ✅ SEO optimization (metadata, sitemap, structured data)
- ✅ User & Settings management
- ✅ Analytics & Performance
- ✅ Error pages & Final polish

### 🚀 Bước tiếp theo:

1. **Deploy lên Production:**
   - Vercel (recommended for Next.js)
   - Railway/Render cho database
   - Setup environment variables

2. **Improve Performance:**
   - Add Redis caching
   - Implement ISR (Incremental Static Regeneration)
   - CDN cho static assets

3. **Add More Features:**
   - Email notifications
   - Advanced search với Elasticsearch
   - Real-time updates với WebSocket
   - Mobile app với React Native

4. **Monitor & Maintain:**
   - Setup error tracking (Sentry)
   - Analytics (Google Analytics, Posthog)
   - Performance monitoring
   - Regular backups

### 💡 Kiến thức đã học:

- ⚛️ **React & Next.js 16**: Server Components, Client Components, App Router
- 🗄️ **Database**: Prisma ORM, PostgreSQL, Relations, Migrations
- 🔐 **Authentication**: NextAuth v5, JWT sessions, Role-based access
- 🎨 **UI/UX**: Tailwind CSS, shadcn/ui, Responsive design
- 🌐 **API**: REST API, Route handlers, Middleware
- 📊 **State Management**: React Query, Server state, Client state
- 🔍 **SEO**: Metadata, Sitemap, Structured data
- ⚡ **Performance**: Image optimization, Caching, Loading states
- 🛡️ **Security**: RBAC, Input validation, CSRF protection

**Chúc bạn thành công với dự án BlogModAPK của mình! 🎊**
