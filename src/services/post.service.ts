import axios from "@/lib/axios";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  status: string;
  featured: boolean;
  version?: string | null;
  fileSize?: string | null;
  requirements?: string | null;
  developer?: string | null;
  downloadUrl?: string | null;
  downloadCount: number;
  viewCount: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
    color?: string | null;
  } | null;
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
  _count?: {
    comments: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  color?: string | null;
  order: number;
  _count?: {
    posts: number;
  };
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class PostService {
  /**
   * Get featured posts
   */
  async getFeaturedPosts(limit = 4): Promise<Post[]> {
    const response = await axios.get<Post[]>("/api/posts/featured", {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Get recent posts
   */
  async getRecentPosts(limit = 12): Promise<Post[]> {
    const response = await axios.get<Post[]>("/api/posts/recent", {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Get popular posts (by views/downloads)
   */
  async getPopularPosts(limit = 5): Promise<Post[]> {
    const response = await axios.get<Post[]>("/api/posts/popular", {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Get all posts with pagination
   */
  async getPosts(page = 1, limit = 12): Promise<PostsResponse> {
    const response = await axios.get<PostsResponse>("/api/posts", {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Get single post by slug
   */
  async getPostBySlug(slug: string): Promise<Post> {
    const response = await axios.get<Post>(`/api/posts/${slug}`);
    return response.data;
  }

  /**
   * Get posts by category
   */
  async getPostsByCategory(
    categorySlug: string,
    page = 1,
    limit = 12,
    sortBy = "recent"
  ): Promise<PostsResponse> {
    const response = await axios.get<PostsResponse>(
      `/api/posts/category/${categorySlug}`,
      {
        params: { page, limit, sortBy },
      }
    );
    return response.data;
  }

  /**
   * Search posts
   */
  async searchPosts(query: string, page = 1, limit = 12): Promise<PostsResponse> {
    const response = await axios.get<PostsResponse>("/api/posts/search", {
      params: { q: query, page, limit },
    });
    return response.data;
  }
}

class CategoryService {
  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await axios.get<Category[]>("/api/categories");
    return response.data;
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await axios.get<Category>(`/api/categories/${slug}`);
    return response.data;
  }
}

export const postService = new PostService();
export const categoryService = new CategoryService();
