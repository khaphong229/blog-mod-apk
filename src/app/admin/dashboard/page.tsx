"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Users,
  MessageSquare,
  Eye,
  Download,
  FolderOpen,
  Tag,
  TrendingUp,
  TrendingDown,
  Clock,
  Loader2,
} from "lucide-react";
import axios from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface DashboardStats {
  totals: {
    posts: number;
    publishedPosts: number;
    draftPosts: number;
    users: number;
    categories: number;
    tags: number;
    comments: number;
    pendingComments: number;
    approvedComments: number;
    downloads: number;
    views: number;
  };
  growth: {
    posts: { count: number; percent: string };
    downloads: { count: number; percent: string };
    views: { count: number; percent: string };
    users: { count: number; percent: string };
  };
  recentPosts: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    createdAt: string;
    featuredImage: string | null;
    author: { name: string | null; image: string | null };
  }>;
  recentComments: Array<{
    id: string;
    content: string;
    status: string;
    createdAt: string;
    author: { name: string | null; image: string | null };
    post: { title: string; slug: string };
  }>;
  topPosts: Array<{
    id: string;
    title: string;
    slug: string;
    viewCount: number;
    downloadCount: number;
    featuredImage: string | null;
  }>;
}

async function getDashboardStats(): Promise<DashboardStats> {
  const response = await axios.get("/api/admin/dashboard/stats?period=30");
  return response.data;
}

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
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {growth && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
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
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 60 * 1000, // 1 minute
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
          Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.
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

      {/* Main Stats Cards */}
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

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Bài đã xuất bản"
          value={data.totals.publishedPosts}
          icon={FileText}
          description={`${data.totals.draftPosts} bản nháp`}
        />
        <StatsCard
          title="Bình luận"
          value={data.totals.comments}
          icon={MessageSquare}
          description={`${data.totals.pendingComments} chờ duyệt`}
        />
        <StatsCard
          title="Danh mục"
          value={data.totals.categories}
          icon={FolderOpen}
        />
        <StatsCard title="Tags" value={data.totals.tags} icon={Tag} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Bài viết gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentPosts.map((post) => (
                <div key={post.id} className="flex gap-3">
                  {post.featuredImage && (
                    <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
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
                        className="text-xs"
                      >
                        {post.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Comments */}
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
                    <Badge
                      variant={
                        comment.status === "APPROVED" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {comment.status}
                    </Badge>
                    <span>{comment.author.name || "Anonymous"}</span>
                    <span>•</span>
                    <Link
                      href={`/post/${comment.post.slug}`}
                      className="hover:text-primary truncate"
                    >
                      {comment.post.title}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Bài viết nổi bật</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topPosts.slice(0, 5).map((post, index) => (
              <div key={post.id} className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
                {post.featuredImage && (
                  <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/post/${post.slug}`}
                    className="font-medium hover:text-primary line-clamp-1"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.viewCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {post.downloadCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
            <Link href="/admin/categories">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <span className="font-medium">Quản lý danh mục</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/comments">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    Duyệt bình luận
                    {data.totals.pendingComments > 0 && (
                      <Badge className="ml-2" variant="destructive">
                        {data.totals.pendingComments}
                      </Badge>
                    )}
                  </span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/analytics">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="font-medium">Xem thống kê</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
