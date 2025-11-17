"use client";

import { useCategories } from "@/hooks/usePosts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SlidersHorizontal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SearchFiltersProps {
  selectedCategoryId?: string;
  selectedSortBy: string;
  onCategoryChange: (categoryId: string | undefined) => void;
  onSortChange: (sortBy: string) => void;
  onClearFilters: () => void;
}

export function SearchFilters({
  selectedCategoryId,
  selectedSortBy,
  onCategoryChange,
  onSortChange,
  onClearFilters,
}: SearchFiltersProps) {
  const { data: categories } = useCategories();

  const hasActiveFilters = selectedCategoryId || selectedSortBy !== "recent";

  const selectedCategory = categories?.find((c) => c.id === selectedCategoryId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Bộ lọc
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-8 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Danh mục</label>
          <Select
            value={selectedCategoryId || "all"}
            onValueChange={(value) =>
              onCategoryChange(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    {category.color && (
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    <span>{category.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({category._count?.posts || 0})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sắp xếp theo</label>
          <Select value={selectedSortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Mới nhất</SelectItem>
              <SelectItem value="popular">Phổ biến nhất</SelectItem>
              <SelectItem value="downloads">Nhiều lượt tải</SelectItem>
              <SelectItem value="title">Tên A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="pt-4 border-t space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Bộ lọc đang áp dụng:
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedCategory && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => onCategoryChange(undefined)}
                >
                  {selectedCategory.name}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              {selectedSortBy !== "recent" && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => onSortChange("recent")}
                >
                  {selectedSortBy === "popular" && "Phổ biến"}
                  {selectedSortBy === "downloads" && "Lượt tải"}
                  {selectedSortBy === "title" && "A-Z"}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
