"use client";

import { useEffect } from "react";
import { usePost } from "@/hooks/usePosts";
import { PostContent } from "@/components/post/PostContent";
import { PostMeta } from "@/components/post/PostMeta";
import { DownloadSection } from "@/components/post/DownloadSection";
import { TableOfContents } from "@/components/post/TableOfContents";
import { RelatedPosts } from "@/components/post/RelatedPosts";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import axios from "@/lib/axios";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  const { data: post, isLoading, error } = usePost(slug);

  // Track view count
  useEffect(() => {
    if (post) {
      // Increment view count after 3 seconds (to avoid bots)
      const timer = setTimeout(() => {
        axios.post(`/api/posts/${slug}/views`).catch(console.error);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [post, slug]);

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-muted/30 py-12">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Title */}
            <h1 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {/* Meta Info */}
            <PostMeta
              author={post.author}
              category={post.category}
              tags={post.tags}
              createdAt={post.createdAt}
              viewCount={post.viewCount}
              downloadCount={post.downloadCount}
              commentCount={post._count?.comments || 0}
            />
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </section>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Table of Contents (Desktop) */}
            <aside className="hidden xl:block xl:col-span-2">
              <TableOfContents />
            </aside>

            {/* Main Article */}
            <article className="lg:col-span-7 xl:col-span-7">
              {/* Excerpt */}
              {post.excerpt && (
                <div className="mb-8 rounded-lg bg-primary/5 border-l-4 border-primary p-6">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>
              )}

              {/* Content */}
              <PostContent content={post.content} />
            </article>

            {/* Right Sidebar - Download Section */}
            <aside className="lg:col-span-5 xl:col-span-3 space-y-6">
              <DownloadSection
                postSlug={post.slug}
                downloadUrl={post.downloadUrl}
                version={post.version}
                fileSize={post.fileSize}
                requirements={post.requirements}
                developer={post.developer}
                downloadCount={post.downloadCount}
              />

              {/* Mobile Table of Contents */}
              <div className="xl:hidden">
                <TableOfContents />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <RelatedPosts postId={post.id} categoryId={post.category?.id} />
    </>
  );
}
