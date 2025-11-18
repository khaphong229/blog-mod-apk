"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Settings as SettingsIcon } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

interface SettingsData {
  // Site Info
  siteName?: string;
  siteDescription?: string;
  siteUrl?: string;
  siteKeywords?: string;

  // Contact
  contactEmail?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialYoutube?: string;

  // SEO
  googleSiteVerification?: string;
  googleAnalytics?: string;

  // Features
  enableComments?: string;
  enableDownloads?: string;
  postsPerPage?: string;
}

async function getSettings(): Promise<SettingsData> {
  const response = await axios.get("/api/admin/settings");
  return response.data.settings;
}

async function updateSettings(data: SettingsData) {
  await axios.post("/api/admin/settings", data);
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: getSettings,
  });

  const [formData, setFormData] = useState<SettingsData>({});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      toast.success("Cập nhật cài đặt thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: () => {
      toast.error("Không thể cập nhật cài đặt");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Cài đặt</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý cấu hình và thiết lập website
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin Website</CardTitle>
            <CardDescription>
              Cấu hình thông tin cơ bản của website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Tên Website</Label>
              <Input
                id="siteName"
                name="siteName"
                value={formData.siteName || ""}
                onChange={handleChange}
                placeholder="BlogModAPK"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Mô tả Website</Label>
              <Textarea
                id="siteDescription"
                name="siteDescription"
                value={formData.siteDescription || ""}
                onChange={handleChange}
                placeholder="Tải xuống ứng dụng, game và công cụ mới nhất..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteUrl">URL Website</Label>
              <Input
                id="siteUrl"
                name="siteUrl"
                type="url"
                value={formData.siteUrl || ""}
                onChange={handleChange}
                placeholder="https://blogmodapk.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteKeywords">Từ khóa (SEO)</Label>
              <Input
                id="siteKeywords"
                name="siteKeywords"
                value={formData.siteKeywords || ""}
                onChange={handleChange}
                placeholder="apps, games, tools, download, modapk"
              />
              <p className="text-sm text-muted-foreground">
                Phân tách bằng dấu phẩy
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Social */}
        <Card>
          <CardHeader>
            <CardTitle>Liên hệ & Mạng xã hội</CardTitle>
            <CardDescription>
              Thông tin liên hệ và các liên kết mạng xã hội
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email liên hệ</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail || ""}
                onChange={handleChange}
                placeholder="contact@blogmodapk.com"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="socialFacebook">Facebook URL</Label>
              <Input
                id="socialFacebook"
                name="socialFacebook"
                type="url"
                value={formData.socialFacebook || ""}
                onChange={handleChange}
                placeholder="https://facebook.com/blogmodapk"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="socialTwitter">Twitter/X URL</Label>
              <Input
                id="socialTwitter"
                name="socialTwitter"
                type="url"
                value={formData.socialTwitter || ""}
                onChange={handleChange}
                placeholder="https://twitter.com/blogmodapk"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="socialInstagram">Instagram URL</Label>
              <Input
                id="socialInstagram"
                name="socialInstagram"
                type="url"
                value={formData.socialInstagram || ""}
                onChange={handleChange}
                placeholder="https://instagram.com/blogmodapk"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="socialYoutube">YouTube URL</Label>
              <Input
                id="socialYoutube"
                name="socialYoutube"
                type="url"
                value={formData.socialYoutube || ""}
                onChange={handleChange}
                placeholder="https://youtube.com/@blogmodapk"
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO & Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>SEO & Analytics</CardTitle>
            <CardDescription>
              Cấu hình công cụ tìm kiếm và theo dõi phân tích
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="googleSiteVerification">
                Google Site Verification
              </Label>
              <Input
                id="googleSiteVerification"
                name="googleSiteVerification"
                value={formData.googleSiteVerification || ""}
                onChange={handleChange}
                placeholder="your-verification-code"
              />
              <p className="text-sm text-muted-foreground">
                Mã xác minh từ Google Search Console
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
              <Input
                id="googleAnalytics"
                name="googleAnalytics"
                value={formData.googleAnalytics || ""}
                onChange={handleChange}
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-sm text-muted-foreground">
                Google Analytics 4 Measurement ID
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Feature Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Tính năng</CardTitle>
            <CardDescription>
              Bật/tắt các tính năng của website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="postsPerPage">Số bài viết mỗi trang</Label>
              <Input
                id="postsPerPage"
                name="postsPerPage"
                type="number"
                value={formData.postsPerPage || "12"}
                onChange={handleChange}
                min="1"
                max="100"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Bình luận</Label>
                <p className="text-sm text-muted-foreground">
                  Cho phép người dùng bình luận
                </p>
              </div>
              <Input
                type="checkbox"
                name="enableComments"
                checked={formData.enableComments === "true"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    enableComments: e.target.checked ? "true" : "false",
                  })
                }
                className="h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Download</Label>
                <p className="text-sm text-muted-foreground">
                  Cho phép tải xuống
                </p>
              </div>
              <Input
                type="checkbox"
                name="enableDownloads"
                checked={formData.enableDownloads === "true"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    enableDownloads: e.target.checked ? "true" : "false",
                  })
                }
                className="h-4 w-4"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={updateMutation.isPending} size="lg">
            {updateMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Save className="mr-2 h-4 w-4" />
            Lưu cài đặt
          </Button>
        </div>
      </form>
    </div>
  );
}
