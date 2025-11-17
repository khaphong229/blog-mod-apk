import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Không tìm thấy bài viết</h1>
        <p className="mb-8 text-muted-foreground">
          Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Tìm kiếm
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
