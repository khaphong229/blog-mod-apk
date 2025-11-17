"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Download, MessageCircle, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface PostMetaProps {
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
  createdAt: string;
  viewCount: number;
  downloadCount: number;
  commentCount: number;
}

export function PostMeta({
  author,
  category,
  tags,
  createdAt,
  viewCount,
  downloadCount,
  commentCount,
}: PostMetaProps) {
  const authorName = author.name || "Anonymous";
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <div className="space-y-6">
      {/* Author & Category */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Author */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={author.image || undefined} alt={authorName} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{authorName}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {timeAgo}
            </p>
          </div>
        </div>

        {/* Category */}
        {category && (
          <>
            <div className="h-6 w-px bg-border" />
            <Link href={`/${category.slug}`}>
              <Badge
                variant="secondary"
                className="cursor-pointer hover:opacity-80"
                style={{
                  backgroundColor: category.color
                    ? `${category.color}15`
                    : undefined,
                  color: category.color || undefined,
                  borderColor: category.color || undefined,
                }}
              >
                {category.name}
              </Badge>
            </Link>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Eye className="h-4 w-4" />
          <span>{viewCount.toLocaleString()} lượt xem</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1.5">
          <Download className="h-4 w-4" />
          <span>{downloadCount.toLocaleString()} lượt tải</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4" />
          <span>{commentCount} bình luận</span>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <Link key={tag.id} href={`/tag/${tag.slug}`}>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                #{tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
