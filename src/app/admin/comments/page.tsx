"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pagination } from "@/components/ui/pagination";
import { Loader2, Search, Check, X, Trash2, MessageSquare } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface Comment {
  id: string;
  content: string;
  status: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  };
  post: {
    id: string;
    title: string;
    slug: string;
  };
  _count: {
    replies: number;
  };
}

interface CommentsResponse {
  comments: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function getComments(
  page: number,
  status: string,
  search: string
): Promise<CommentsResponse> {
  const response = await axios.get("/api/admin/comments", {
    params: { page, limit: 20, status, search },
  });
  return response.data;
}

async function updateCommentStatus(id: string, status: string) {
  await axios.patch(`/api/admin/comments/${id}`, { status });
}

async function deleteComment(id: string) {
  await axios.delete(`/api/admin/comments/${id}`);
}

export default function CommentsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-comments", page, status, search],
    queryFn: () => getComments(page, status, search),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateCommentStatus(id, status),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
    },
    onError: () => toast.error("Không thể cập nhật trạng thái"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      toast.success("Xóa bình luận thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
      setDeleteDialogOpen(false);
    },
    onError: () => toast.error("Không thể xóa bình luận"),
  });

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="default">Đã duyệt</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Chờ duyệt</Badge>;
      case "SPAM":
        return <Badge variant="destructive">Spam</Badge>;
      case "REJECTED":
        return <Badge variant="outline">Từ chối</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Quản lý Bình luận</h1>
        <p className="text-muted-foreground mt-1">
          Duyệt và quản lý bình luận từ người dùng
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Tìm kiếm bình luận..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="SPAM">Spam</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : data && data.comments.length > 0 ? (
        <>
          <div className="space-y-4">
            {data.comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.author.image || undefined} />
                      <AvatarFallback>
                        {comment.author.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      {/* Author info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {comment.author.name || "Anonymous"}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {comment.author.email}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            •
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                              locale: vi,
                            })}
                          </span>
                        </div>
                        {getStatusBadge(comment.status)}
                      </div>

                      {/* Post title */}
                      <div className="flex items-center gap-2 text-sm">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Bài viết:</span>
                        <Link
                          href={`/post/${comment.post.slug}`}
                          className="text-primary hover:underline"
                        >
                          {comment.post.title}
                        </Link>
                        {comment._count.replies > 0 && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">
                              {comment._count.replies} câu trả lời
                            </span>
                          </>
                        )}
                      </div>

                      {/* Comment content */}
                      <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-lg">
                        {comment.content}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {comment.status !== "APPROVED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateMutation.mutate({
                                id: comment.id,
                                status: "APPROVED",
                              })
                            }
                            disabled={updateMutation.isPending}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Duyệt
                          </Button>
                        )}
                        {comment.status !== "SPAM" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateMutation.mutate({
                                id: comment.id,
                                status: "SPAM",
                              })
                            }
                            disabled={updateMutation.isPending}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Spam
                          </Button>
                        )}
                        {comment.status !== "REJECTED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateMutation.mutate({
                                id: comment.id,
                                status: "REJECTED",
                              })
                            }
                            disabled={updateMutation.isPending}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Từ chối
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(comment.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data.pagination.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Không tìm thấy bình luận nào</p>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
