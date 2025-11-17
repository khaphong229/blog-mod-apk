"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { useCategories } from "@/hooks/usePosts";
import { Loader2, Save, Eye } from "lucide-react";

interface PostFormData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  status: string;
  featured: boolean;
  categoryId?: string;
  tagIds?: string[];
  version?: string;
  fileSize?: string;
  requirements?: string;
  developer?: string;
  downloadUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

interface PostFormProps {
  initialData?: Partial<PostFormData> & { id?: string };
  mode: "create" | "edit";
}

async function createPost(data: PostFormData) {
  const response = await axios.post("/api/admin/posts", data);
  return response.data;
}

async function updatePost(id: string, data: PostFormData) {
  const response = await axios.patch(`/api/admin/posts/${id}`, data);
  return response.data;
}

export function PostForm({ initialData, mode }: PostFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();

  const [content, setContent] = useState(initialData?.content || "");
  const [status, setStatus] = useState(initialData?.status || "DRAFT");
  const [featured, setFeatured] = useState(initialData?.featured || false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormData>({
    defaultValues: {
      ...initialData,
      status: initialData?.status || "DRAFT",
      featured: initialData?.featured || false,
    },
  });

  const title = watch("title");

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const saveMutation = useMutation({
    mutationFn: (data: PostFormData) => {
      if (mode === "create") {
        return createPost(data);
      } else {
        return updatePost(initialData?.id!, data);
      }
    },
    onSuccess: () => {
      toast.success(
        mode === "create"
          ? "Tạo bài viết thành công"
          : "Cập nhật bài viết thành công"
      );
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      router.push("/admin/posts");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Có lỗi xảy ra");
    },
  });

  const onSubmit = (data: PostFormData) => {
    const submitData = {
      ...data,
      content,
      status,
      featured,
    };
    saveMutation.mutate(submitData);
  };

  const handleSaveDraft = () => {
    setStatus("DRAFT");
    handleSubmit(onSubmit)();
  };

  const handlePublish = () => {
    setStatus("PUBLISHED");
    handleSubmit(onSubmit)();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {mode === "create" ? "Tạo bài viết mới" : "Chỉnh sửa bài viết"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSaveDraft}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Lưu nháp
          </Button>
          <Button
            type="button"
            onClick={handlePublish}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            Xuất bản
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nội dung chính</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Tiêu đề là bắt buộc" })}
                  placeholder="Nhập tiêu đề bài viết"
                  onChange={(e) => {
                    register("title").onChange(e);
                    if (mode === "create") {
                      setValue("slug", generateSlug(e.target.value));
                    }
                  }}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  {...register("slug", { required: "Slug là bắt buộc" })}
                  placeholder="slug-bai-viet"
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Mô tả ngắn</Label>
                <Textarea
                  id="excerpt"
                  {...register("excerpt")}
                  placeholder="Mô tả ngắn về bài viết"
                  rows={3}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label>Nội dung *</Label>
                <RichTextEditor content={content} onChange={setContent} />
              </div>
            </CardContent>
          </Card>

          {/* App Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin ứng dụng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Phiên bản</Label>
                  <Input id="version" {...register("version")} placeholder="1.0.0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fileSize">Dung lượng</Label>
                  <Input id="fileSize" {...register("fileSize")} placeholder="50 MB" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Yêu cầu hệ thống</Label>
                <Input
                  id="requirements"
                  {...register("requirements")}
                  placeholder="Android 5.0+"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="developer">Nhà phát triển</Label>
                <Input
                  id="developer"
                  {...register("developer")}
                  placeholder="Tên nhà phát triển"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="downloadUrl">Link tải xuống</Label>
                <Input
                  id="downloadUrl"
                  {...register("downloadUrl")}
                  placeholder="https://example.com/download"
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  {...register("metaTitle")}
                  placeholder="Tiêu đề SEO"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  {...register("metaDescription")}
                  placeholder="Mô tả SEO"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  {...register("metaKeywords")}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category */}
              <div className="space-y-2">
                <Label>Danh mục</Label>
                <Select
                  value={watch("categoryId")}
                  onValueChange={(value) => setValue("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Featured */}
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Bài viết nổi bật</Label>
                <Switch
                  id="featured"
                  checked={featured}
                  onCheckedChange={setFeatured}
                />
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Ảnh đại diện</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="featuredImage">URL ảnh</Label>
                <Input
                  id="featuredImage"
                  {...register("featuredImage")}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {watch("featuredImage") && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={watch("featuredImage")}
                    alt="Featured"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
