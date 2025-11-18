"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Reply, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string | null;
      image: string | null;
      role: string;
    };
    replies?: any[];
  };
  onReply: (commentId: string, content: string) => Promise<void>;
  isAuthenticated: boolean;
  isReplying?: boolean;
}

export function CommentItem({
  comment,
  onReply,
  isAuthenticated,
  isReplying = false,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyContent);
      setReplyContent("");
      setShowReplyForm(false);
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex gap-3 ${isReplying ? "ml-12" : ""}`}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={comment.author.image || undefined} />
        <AvatarFallback>
          {comment.author.name?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{comment.author.name || "Anonymous"}</span>
          {["ADMIN", "SUPER_ADMIN"].includes(comment.author.role) && (
            <Badge variant="destructive" className="text-xs">
              Admin
            </Badge>
          )}
          {comment.author.role === "EDITOR" && (
            <Badge variant="secondary" className="text-xs">
              Editor
            </Badge>
          )}
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
              locale: vi,
            })}
          </span>
        </div>

        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

        {!isReplying && isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            <Reply className="h-3 w-3 mr-1" />
            Trả lời
          </Button>
        )}

        {showReplyForm && (
          <div className="space-y-2 pt-2">
            <Textarea
              placeholder="Viết câu trả lời..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleReplySubmit}
                disabled={isSubmitting || !replyContent.trim()}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gửi
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent("");
                }}
              >
                Hủy
              </Button>
            </div>
          </div>
        )}

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-4 pt-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                isAuthenticated={isAuthenticated}
                isReplying={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
