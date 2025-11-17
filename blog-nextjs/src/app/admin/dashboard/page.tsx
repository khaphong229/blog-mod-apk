import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, MessageSquare, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Tổng bài viết",
      value: "245",
      description: "+12 trong tháng này",
      icon: FileText,
    },
    {
      title: "Người dùng",
      value: "1,234",
      description: "+48 người dùng mới",
      icon: Users,
    },
    {
      title: "Bình luận",
      value: "567",
      description: "+89 chưa duyệt",
      icon: MessageSquare,
    },
    {
      title: "Lượt xem",
      value: "45,678",
      description: "+18% so với tháng trước",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Chào mừng bạn trở lại! Đây là tổng quan hệ thống.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bài viết gần đây</CardTitle>
            <CardDescription>
              Các bài viết mới nhất được tạo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Nội dung sẽ được thêm ở bước tiếp theo...
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các hoạt động mới trên hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Nội dung sẽ được thêm ở bước tiếp theo...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
