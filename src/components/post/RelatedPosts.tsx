"use client";

import { useQuery } from "@tanstack/react-query";
import { PostCard } from "@/components/post/PostCard";
import { Loader2 } from "lucide-react";
import axios from "@/lib/axios";

interface RelatedPostsProps {
  postId: string;
  categoryId?: string | null;
}

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

async function getRelatedPosts(
  postId: string,
  categoryId?: string | null
): Promise<Post[]> {
  const response = await axios.get<Post[]>("/api/posts/related", {
    params: { postId, categoryId, limit: 4 },
  });
  return response.data;
}

export function RelatedPosts({ postId, categoryId }: RelatedPostsProps) {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", "related", postId],
    queryFn: () => getRelatedPosts(postId, categoryId),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container">
          <h2 className="mb-8 text-2xl font-bold">Bài viết liên quan</h2>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <h2 className="mb-8 text-2xl font-bold">Bài viết liên quan</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
