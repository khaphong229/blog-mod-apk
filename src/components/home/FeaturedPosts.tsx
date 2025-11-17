"use client";

import { useFeaturedPosts } from "@/hooks/usePosts";
import { PostCard } from "@/components/post/PostCard";
import { Loader2 } from "lucide-react";

export function FeaturedPosts() {
  const { data: posts, isLoading, error } = useFeaturedPosts(4);

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container">
          <div className="text-center py-12 text-muted-foreground">
            Không thể tải bài viết nổi bật
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Nổi bật</h2>
          <p className="mt-2 text-muted-foreground">
            Các ứng dụng và game được đề xuất hàng đầu
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} variant="featured" />
          ))}
        </div>
      </div>
    </section>
  );
}
