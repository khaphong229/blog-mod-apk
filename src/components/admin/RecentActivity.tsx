import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";

interface RecentPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
  author: {
    name?: string | null;
  };
}

interface RecentComment {
  id: string;
  content: string;
  createdAt: string;
  status: string;
  author: {
    name?: string | null;
  };
  post: {
    title: string;
    slug: string;
  };
}

interface RecentActivityProps {
  posts?: RecentPost[];
  comments?: RecentComment[];
}

export function RecentActivity({ posts, comments }: RecentActivityProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Bài viết mới nhất
          </CardTitle>
        </CardHeader>
        <CardContent>
          {posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="text-sm font-medium hover:text-primary line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {post.author.name || "Anonymous"}
                      </p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      post.status === "PUBLISHED" ? "default" : "secondary"
                    }
                    className="flex-shrink-0"
                  >
                    {post.status === "PUBLISHED" ? "Đã xuất bản" : "Nháp"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Chưa có bài viết nào
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4" />
            Bình luận mới nhất
          </CardTitle>
        </CardHeader>
        <CardContent>
          {comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm line-clamp-2">{comment.content}</p>
                    <Badge
                      variant={
                        comment.status === "APPROVED" ? "default" : "secondary"
                      }
                      className="flex-shrink-0"
                    >
                      {comment.status === "APPROVED" ? "Đã duyệt" : "Chờ duyệt"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{comment.author.name || "Anonymous"}</span>
                    <span>•</span>
                    <Link
                      href={`/post/${comment.post.slug}`}
                      className="hover:text-primary line-clamp-1"
                    >
                      {comment.post.title}
                    </Link>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Chưa có bình luận nào
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
