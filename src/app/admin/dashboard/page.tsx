"use client";

import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/admin/StatsCard";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { QuickActions } from "@/components/admin/QuickActions";
import {
  FileText,
  Users,
  MessageSquare,
  Eye,
  Download,
  FolderOpen,
  Tag,
} from "lucide-react";
import axios from "@/lib/axios";
import { Loader2 } from "lucide-react";

interface DashboardStats {
  stats: {
    posts: {
      total: number;
      published: number;
      draft: number;
    };
    categories: number;
    tags: number;
    comments: number;
    users: number;
    views: number;
    downloads: number;
  };
  recentActivity: {
    posts: Array<{
      id: string;
      title: string;
      slug: string;
      status: string;
      createdAt: string;
      author: {
        name?: string | null;
      };
    }>;
    comments: Array<{
      id: string;
      content: string;
      createdAt: string;
      status: string;
      author: {
        name?: string | null;
      };
      post: {
        title: string;
        slug: string;
      };
    }>;
  };
}

async function getDashboardStats(): Promise<DashboardStats> {
  const response = await axios.get<DashboardStats>("/api/admin/stats");
  return response.data;
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-stats"],
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng bài viết"
          value={data.stats.posts.total}
          icon={FileText}
          description={`${data.stats.posts.published} đã xuất bản, ${data.stats.posts.draft} nháp`}
        />
        <StatsCard
          title="Lượt xem"
          value={data.stats.views}
          icon={Eye}
          description="Tổng lượt xem"
        />
        <StatsCard
          title="Lượt tải"
          value={data.stats.downloads}
          icon={Download}
          description="Tổng lượt tải xuống"
        />
        <StatsCard
          title="Bình luận"
          value={data.stats.comments}
          icon={MessageSquare}
          description="Tổng số bình luận"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Người dùng"
          value={data.stats.users}
          icon={Users}
          description="Tổng người dùng"
        />
        <StatsCard
          title="Danh mục"
          value={data.stats.categories}
          icon={FolderOpen}
          description="Số danh mục"
        />
        <StatsCard
          title="Tags"
          value={data.stats.tags}
          icon={Tag}
          description="Số tags"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity
        posts={data.recentActivity.posts}
        comments={data.recentActivity.comments}
      />
    </div>
  );
}
