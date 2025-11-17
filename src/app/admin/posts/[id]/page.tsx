"use client";

import { useQuery } from "@tanstack/react-query";
import { PostForm } from "@/components/admin/PostForm";
import { Loader2 } from "lucide-react";
import axios from "@/lib/axios";

interface PostEditPageProps {
  params: {
    id: string;
  };
}

async function getPost(id: string) {
  const response = await axios.get(`/api/admin/posts/${id}`);
  return response.data.post;
}

export default function PostEditPage({ params }: PostEditPageProps) {
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["admin-post", params.id],
    queryFn: () => getPost(params.id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">
          Không thể tải bài viết. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  // Transform post data for form
  const initialData = {
    ...post,
    tagIds: post.tags?.map((tag: any) => tag.id) || [],
  };

  return <PostForm mode="edit" initialData={initialData} />;
}
