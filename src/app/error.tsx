"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error caught by error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-12 text-center">
          {/* Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-destructive/10 p-6">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4 mb-8">
            <h2 className="text-3xl font-bold">Đã xảy ra lỗi</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Xin lỗi, có gì đó đã xảy ra sai sót. Chúng tôi đã ghi nhận lỗi và sẽ khắc phục sớm nhất.
            </p>
            {process.env.NODE_ENV === "development" && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Chi tiết lỗi (Development only)
                </summary>
                <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto">
                  {error.message}
                  {error.stack}
                </pre>
              </details>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={reset} size="lg">
              <RefreshCcw className="mr-2 h-5 w-5" />
              Thử lại
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Về trang chủ
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Nếu vấn đề vẫn tiếp diễn, vui lòng{" "}
              <Link href="/contact" className="text-primary hover:underline">
                liên hệ với chúng tôi
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
