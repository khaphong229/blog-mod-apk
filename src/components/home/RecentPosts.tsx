"use client";

import { useRecentPosts } from "@/hooks/usePosts";
import { PostCard } from "@/components/post/PostCard";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function RecentPosts() {
  const { data: posts, isLoading, error } = useRecentPosts(12);

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
            Không thể tải bài viết mới
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="py-12">
        <div className="container">
          <div className="text-center py-12 text-muted-foreground">
            Chưa có bài viết nào
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Mới cập nhật</h2>
            <p className="mt-2 text-muted-foreground">
              Ứng dụng và game mới nhất
            </p>
          </div>
          <Link href="/apps">
            <Button variant="ghost" className="hidden md:flex">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/apps">
            <Button variant="outline" className="w-full sm:w-auto">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
