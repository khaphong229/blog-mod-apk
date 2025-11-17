"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  FileArchive,
  HardDrive,
  Smartphone,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

interface DownloadSectionProps {
  postSlug: string;
  downloadUrl?: string | null;
  version?: string | null;
  fileSize?: string | null;
  requirements?: string | null;
  developer?: string | null;
  downloadCount: number;
}

export function DownloadSection({
  postSlug,
  downloadUrl,
  version,
  fileSize,
  requirements,
  developer,
  downloadCount,
}: DownloadSectionProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!downloadUrl) {
      toast.error("Link tải xuống không khả dụng");
      return;
    }

    setIsDownloading(true);

    try {
      // Track download
      await axios.post(`/api/posts/${postSlug}/downloads`);

      // Open download link
      window.open(downloadUrl, "_blank");
      toast.success("Đang bắt đầu tải xuống...");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Không thể tải xuống. Vui lòng thử lại.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Tải xuống
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Download Info */}
        <div className="grid gap-3">
          {version && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Phiên bản</p>
                <p className="text-muted-foreground">{version}</p>
              </div>
            </div>
          )}

          {fileSize && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <HardDrive className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Dung lượng</p>
                <p className="text-muted-foreground">{fileSize}</p>
              </div>
            </div>
          )}

          {requirements && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Smartphone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Yêu cầu</p>
                <p className="text-muted-foreground">{requirements}</p>
              </div>
            </div>
          )}

          {developer && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <FileArchive className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Nhà phát triển</p>
                <p className="text-muted-foreground">{developer}</p>
              </div>
            </div>
          )}
        </div>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          disabled={isDownloading || !downloadUrl}
          className="w-full h-12 text-base font-semibold"
          size="lg"
        >
          <Download className="mr-2 h-5 w-5" />
          {isDownloading ? "Đang xử lý..." : "Tải xuống miễn phí"}
        </Button>

        {/* Download Count */}
        <p className="text-center text-sm text-muted-foreground">
          {downloadCount.toLocaleString()} lượt tải xuống
        </p>

        {/* Note */}
        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <p>
            ⚠️ Lưu ý: Tải về file APK từ nguồn không chính thống có thể gây rủi
            ro bảo mật. Hãy cân nhắc kỹ trước khi cài đặt.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
