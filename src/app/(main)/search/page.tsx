"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSearchPosts } from "@/hooks/usePosts";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get params from URL
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [categoryId, setCategoryId] = useState<string | undefined>(
    searchParams.get("categoryId") || undefined
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "recent");

  // Fetch search results
  const { data, isLoading, error } = useSearchPosts(
    query,
    page,
    12,
    categoryId,
    sortBy
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (page > 1) params.set("page", page.toString());
    if (categoryId) params.set("categoryId", categoryId);
    if (sortBy !== "recent") params.set("sortBy", sortBy);

    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl, { scroll: false });
  }, [query, page, categoryId, sortBy, router]);

  // Handle search
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1); // Reset to first page
  };

  // Handle filter changes
  const handleCategoryChange = (newCategoryId: string | undefined) => {
    setCategoryId(newCategoryId);
    setPage(1);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const handleClearFilters = () => {
    setCategoryId(undefined);
    setSortBy("recent");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Tìm kiếm</h1>
        <div className="max-w-2xl">
          <SearchBar
            initialQuery={query}
            onSearch={handleSearch}
            autoFocus={!query}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Filters */}
        <aside className="lg:col-span-1">
          <SearchFilters
            selectedCategoryId={categoryId}
            selectedSortBy={sortBy}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Main - Results */}
        <main className="lg:col-span-3">
          <SearchResults
            posts={data?.posts}
            isLoading={isLoading}
            error={error}
            currentPage={page}
            totalPages={data?.pagination.totalPages || 1}
            totalResults={data?.pagination.total}
            query={query}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
}
