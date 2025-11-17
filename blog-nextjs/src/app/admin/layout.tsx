import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Header } from "@/components/layout/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <AdminSidebar />
        <main className="pl-64 pt-0">
          <div className="container py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
