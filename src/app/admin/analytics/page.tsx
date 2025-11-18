"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, TrendingUp } from "lucide-react";
import axios from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";

interface DownloadStats {
  totalDownloads: number;
  downloadsInPeriod: number;
  topPosts: Array<{
    id: string;
    title: string;
    slug: string;
    downloadCount: number;
    featuredImage?: string | null;
  }>;
  downloadsByDay: Array<{
    date: string;
    count: number;
  }>;
}

async function getDownloadStats(): Promise<DownloadStats> {
  const response = await axios.get("/api/admin/downloads/stats?days=30");
  return response.data;
}

export default function AnalyticsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["download-stats"],
    queryFn: getDownloadStats,
    staleTime: 5 * 60 * 1000,
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
          Không thể tải dữ liệu. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Thống kê & Phân tích</h1>
        <p className="text-muted-foreground mt-1">
          Theo dõi lượt tải xuống và hiệu suất
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng lượt tải
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalDownloads.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tất cả thời gian
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              30 ngày qua
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.downloadsInPeriod.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((data.downloadsInPeriod / data.totalDownloads) * 100).toFixed(1)}% tổng số
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Trung bình/ngày
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(data.downloadsInPeriod / 30).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              30 ngày qua
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Downloaded Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 bài viết được tải nhiều nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topPosts.map((post, index) => (
              <div
                key={post.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
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
                  <p className="text-sm text-muted-foreground">
                    {post.downloadCount.toLocaleString()} lượt tải
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Downloads by Day */}
      <Card>
        <CardHeader>
          <CardTitle>Lượt tải theo ngày (30 ngày qua)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.downloadsByDay.length > 0 ? (
              data.downloadsByDay.map((item: any) => (
                <div key={item.date} className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground w-24">
                    {new Date(item.date).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="flex-1">
                    <div className="h-6 bg-primary/20 rounded overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(parseInt(item.count) / Math.max(...data.downloadsByDay.map((d: any) => parseInt(d.count)))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-medium w-16 text-right">
                    {item.count}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Chưa có dữ liệu
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
