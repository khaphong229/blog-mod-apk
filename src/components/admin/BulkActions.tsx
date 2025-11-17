"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ChevronDown, Trash2, Archive, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

interface BulkActionsProps {
  selectedCount: number;
  selectedPosts: string[];
  onClearSelection: () => void;
}

async function bulkDeletePosts(postIds: string[]) {
  await Promise.all(postIds.map((id) => axios.delete(`/api/admin/posts/${id}`)));
}

async function bulkUpdateStatus(postIds: string[], status: string) {
  await Promise.all(
    postIds.map((id) => axios.patch(`/api/admin/posts/${id}`, { status }))
  );
}

export function BulkActions({
  selectedCount,
  selectedPosts,
  onClearSelection,
}: BulkActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: bulkDeletePosts,
    onSuccess: () => {
      toast.success(`Đã xóa ${selectedCount} bài viết`);
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      onClearSelection();
      setDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error("Không thể xóa bài viết");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) =>
      bulkUpdateStatus(selectedPosts, status),
    onSuccess: (_, variables) => {
      const statusText =
        variables.status === "PUBLISHED"
          ? "đã xuất bản"
          : variables.status === "DRAFT"
          ? "chuyển thành nháp"
          : "lưu trữ";
      toast.success(`Đã ${statusText} ${selectedCount} bài viết`);
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      onClearSelection();
    },
    onError: () => {
      toast.error("Không thể cập nhật bài viết");
    },
  });

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(selectedPosts);
  };

  const handleUpdateStatus = (status: string) => {
    updateStatusMutation.mutate({ status });
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Đã chọn {selectedCount} bài viết
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Hành động
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleUpdateStatus("PUBLISHED")}>
              <Eye className="mr-2 h-4 w-4" />
              Xuất bản
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatus("DRAFT")}>
              <EyeOff className="mr-2 h-4 w-4" />
              Chuyển thành nháp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatus("ARCHIVED")}>
              <Archive className="mr-2 h-4 w-4" />
              Lưu trữ
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Bỏ chọn tất cả
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa {selectedCount} bài viết</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {selectedCount} bài viết đã chọn? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
