"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import { CommentItem } from "./CommentItem";
import Link from "next/link";

interface CommentSectionProps {
  slug: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
  };
  replies?: Comment[];
}

async function getComments(slug: string): Promise<Comment[]> {
  const response = await axios.get(`/api/posts/${slug}/comments`);
  return response.data.comments;
}

async function createComment(data: {
  slug: string;
  content: string;
  parentId?: string;
}) {
  const response = await axios.post(`/api/posts/${data.slug}/comments`, {
    content: data.content,
    parentId: data.parentId,
  });
  return response.data;
}

export function CommentSection({ slug }: CommentSectionProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", slug],
    queryFn: () => getComments(slug),
  });

  const createMutation = useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      toast.success(data.message || "Bình luận đã được gửi");
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["comments", slug] });
    },
    onError: () => {
      toast.error("Không thể gửi bình luận");
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) return;
    createMutation.mutate({ slug, content });
  };

  const handleReply = async (parentId: string, replyContent: string) => {
    await createMutation.mutateAsync({
      slug,
      content: replyContent,
      parentId,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Bình luận
          {comments && comments.length > 0 && (
            <span className="text-muted-foreground font-normal">
              ({comments.length})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment form */}
        {session ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Viết bình luận của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || !content.trim()}
            >
              {createMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Gửi bình luận
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 bg-muted rounded-lg">
            <p className="text-muted-foreground mb-2">
              Bạn cần đăng nhập để bình luận
            </p>
            <Button asChild variant="outline">
              <Link href="/auth/signin">Đăng nhập</Link>
            </Button>
          </div>
        )}

        {/* Comments list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                isAuthenticated={!!session}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
