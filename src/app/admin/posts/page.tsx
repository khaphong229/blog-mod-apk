"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PostsTable } from "@/components/admin/PostsTable";
import { PostFilters } from "@/components/admin/PostFilters";
import { BulkActions } from "@/components/admin/BulkActions";
import { Pagination } from "@/components/ui/pagination";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";
import { useDebounce } from "@/hooks/useDebounce";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  author: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  _count?: {
    comments: number;
  };
}

interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function getAdminPosts(
  page: number,
  search: string,
  status: string,
  categoryId: string
): Promise<PostsResponse> {
  const params: any = { page, limit: 10 };
  if (search) params.search = search;
  if (status !== "all") params.status = status;
  if (categoryId !== "all") params.categoryId = categoryId;

  const response = await axios.get<PostsResponse>("/api/admin/posts", { params });
  return response.data;
}

export default function AdminPostsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-posts", page, debouncedSearch, status, categoryId],
    queryFn: () => getAdminPosts(page, debouncedSearch, status, categoryId),
    staleTime: 60 * 1000,
  });

  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
    setCategoryId("all");
    setPage(1);
  };

  const handleSelectPost = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && data?.posts) {
      setSelectedPosts(data.posts.map((post) => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedPosts([]);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSelectedPosts([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý bài viết</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và chỉnh sửa bài viết của bạn
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo bài viết mới
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <PostFilters
        search={search}
        status={status}
        categoryId={categoryId}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onCategoryChange={setCategoryId}
        onClear={handleClearFilters}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedPosts.length}
        selectedPosts={selectedPosts}
        onClearSelection={handleClearSelection}
      />

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            Không thể tải dữ liệu. Vui lòng thử lại sau.
          </p>
        </div>
      ) : data ? (
        <>
          <PostsTable
            posts={data.posts}
            selectedPosts={selectedPosts}
            onSelectPost={handleSelectPost}
            onSelectAll={handleSelectAll}
          />

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Hiển thị {(page - 1) * 10 + 1}-{Math.min(page * 10, data.pagination.total)} trong
              tổng số {data.pagination.total} bài viết
            </div>
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : null}
    </div>
  );
}
