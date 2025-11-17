"use client";

import { useState } from "react";
import { usePostsByCategory } from "@/hooks/usePosts";
import { PostCard } from "@/components/post/PostCard";
import { FilterBar } from "@/components/category/FilterBar";
import { Pagination } from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";

interface CategoryPageProps {
  categorySlug: string;
  categoryName: string;
  categoryDescription?: string | null;
  categoryColor?: string | null;
}

export function CategoryPage({
  categorySlug,
  categoryName,
  categoryDescription,
  categoryColor,
}: CategoryPageProps) {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const limit = 12;

  const { data, isLoading, error } = usePostsByCategory(
    categorySlug,
    page,
    limit,
    sortBy
  );

  // Handle sort change
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setPage(1); // Reset to first page when sorting changes
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top of posts
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container py-8">
      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          {categoryColor && (
            <div
              className="h-1.5 w-12 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
          )}
          <h1 className="text-3xl md:text-4xl font-bold">{categoryName}</h1>
        </div>
        {categoryDescription && (
          <p className="text-lg text-muted-foreground max-w-3xl">
            {categoryDescription}
          </p>
        )}
      </div>

      {/* Filter Bar */}
      <div className="mb-6">
        <FilterBar
          sortBy={sortBy}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalPosts={data?.pagination.total}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            Không thể tải bài viết. Vui lòng thử lại sau.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && (!data?.posts || data.posts.length === 0) && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            Chưa có bài viết nào trong danh mục này.
          </p>
        </div>
      )}

      {/* Posts Grid/List */}
      {!isLoading && !error && data?.posts && data.posts.length > 0 && (
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "space-y-6"
            }
          >
            {data.posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                variant={viewMode === "list" ? "compact" : "default"}
              />
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={page}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
