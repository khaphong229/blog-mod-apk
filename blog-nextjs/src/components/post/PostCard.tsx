import Link from "next/link";
import Image from "next/image";
import { Calendar, Download, Eye, User } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/utils";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    featuredImage?: string | null;
    publishedAt?: Date | string | null;
    downloadCount?: number;
    viewCount?: number;
    author?: {
      name?: string | null;
    };
    category?: {
      name: string;
      slug: string;
      color?: string | null;
    } | null;
    tags?: {
      name: string;
      slug: string;
    }[];
  };
  variant?: "default" | "compact" | "featured";
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  const imageUrl = post.featuredImage || "/placeholder-post.jpg";

  if (variant === "compact") {
    return (
      <Link href={`/post/${post.slug}`}>
        <div className="flex gap-3 group">
          <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              {post.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.publishedAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/post/${post.slug}`}>
        <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
          <div className="relative h-64 w-full">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {post.category && (
              <Badge
                className="absolute top-3 left-3"
                style={{
                  backgroundColor: post.category.color || undefined,
                }}
              >
                {post.category.name}
              </Badge>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-muted-foreground">
              {post.author?.name && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {post.author.name}
                </span>
              )}
              {post.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.publishedAt)}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="px-4 pb-4 pt-0 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {formatNumber(post.downloadCount || 0)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(post.viewCount || 0)}
            </span>
          </CardFooter>
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/post/${post.slug}`}>
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow h-full">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {post.category && (
            <Badge
              className="absolute top-3 left-3"
              style={{
                backgroundColor: post.category.color || undefined,
              }}
            >
              {post.category.name}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {formatNumber(post.downloadCount || 0)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
