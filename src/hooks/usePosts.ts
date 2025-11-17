import { useQuery } from "@tanstack/react-query";
import { postService, categoryService } from "@/services/post.service";

/**
 * Get featured posts
 */
export function useFeaturedPosts(limit = 4) {
  return useQuery({
    queryKey: ["posts", "featured", limit],
    queryFn: () => postService.getFeaturedPosts(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get recent posts
 */
export function useRecentPosts(limit = 12) {
  return useQuery({
    queryKey: ["posts", "recent", limit],
    queryFn: () => postService.getRecentPosts(limit),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get popular posts
 */
export function usePopularPosts(limit = 5) {
  return useQuery({
    queryKey: ["posts", "popular", limit],
    queryFn: () => postService.getPopularPosts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get posts with pagination
 */
export function usePosts(page = 1, limit = 12) {
  return useQuery({
    queryKey: ["posts", "list", page, limit],
    queryFn: () => postService.getPosts(page, limit),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get single post by slug
 */
export function usePost(slug: string) {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: () => postService.getPostBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Get posts by category
 */
export function usePostsByCategory(
  categorySlug: string,
  page = 1,
  limit = 12,
  sortBy = "recent"
) {
  return useQuery({
    queryKey: ["posts", "category", categorySlug, page, limit, sortBy],
    queryFn: () => postService.getPostsByCategory(categorySlug, page, limit, sortBy),
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Search posts
 */
export function useSearchPosts(
  query: string,
  page = 1,
  limit = 12,
  categoryId?: string,
  sortBy = "recent"
) {
  return useQuery({
    queryKey: ["posts", "search", query, page, limit, categoryId, sortBy],
    queryFn: () => postService.searchPosts(query, page, limit, categoryId, sortBy),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
    staleTime: 15 * 60 * 1000, // 15 minutes (categories rarely change)
  });
}

/**
 * Get category by slug
 */
export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => categoryService.getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 15 * 60 * 1000,
  });
}
