"use client";

import { PostCard } from "@/components/post/PostCard";
import { Pagination } from "@/components/ui/pagination";
import { Loader2, SearchX } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  author: {
    name?: string | null;
    image?: string | null;
  };
  category?: {
    name: string;
    slug: string;
    color?: string | null;
  } | null;
  _count?: {
    comments: number;
  };
}

interface SearchResultsProps {
  posts?: Post[];
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  totalResults?: number;
  query?: string;
  onPageChange: (page: number) => void;
}

export function SearchResults({
  posts,
  isLoading,
  error,
  currentPage,
  totalPages,
  totalResults,
  query,
  onPageChange,
}: SearchResultsProps) {
  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <SearchX className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Lỗi khi tìm kiếm</h3>
        <p className="text-muted-foreground">
          Không thể tải kết quả tìm kiếm. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  // Empty State
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Không tìm thấy kết quả</h3>
        <p className="text-muted-foreground">
          {query
            ? `Không có kết quả nào cho "${query}"`
            : "Không có bài viết nào phù hợp với bộ lọc của bạn"}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Kết quả tìm kiếm</h2>
          {totalResults !== undefined && (
            <p className="text-sm text-muted-foreground mt-1">
              Tìm thấy {totalResults.toLocaleString()} kết quả
              {query && ` cho "${query}"`}
            </p>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
