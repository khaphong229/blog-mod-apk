import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-12 text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary/20">404</h1>
          </div>

          {/* Message */}
          <div className="space-y-4 mb-8">
            <h2 className="text-3xl font-bold">Không tìm thấy trang</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Về trang chủ
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/search">
                <Search className="mr-2 h-5 w-5" />
                Tìm kiếm
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Quay lại
            </Button>
          </div>

          {/* Suggestions */}
          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Có thể bạn quan tâm:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/category/apps">
                <Button variant="secondary" size="sm">
                  Ứng dụng
                </Button>
              </Link>
              <Link href="/category/games">
                <Button variant="secondary" size="sm">
                  Games
                </Button>
              </Link>
              <Link href="/category/tools">
                <Button variant="secondary" size="sm">
                  Tools
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
