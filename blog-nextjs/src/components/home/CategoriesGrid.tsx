"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/usePosts";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";

export function CategoriesGrid() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  // Get icon component dynamically
  const getIcon = (iconName?: string | null) => {
    if (!iconName) return LucideIcons.Folder;
    const Icon = (LucideIcons as any)[iconName];
    return Icon || LucideIcons.Folder;
  };

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">Danh mục</h2>
          <p className="mt-2 text-muted-foreground">
            Khám phá theo loại ứng dụng
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 8).map((category) => {
            const Icon = getIcon(category.icon);
            const postCount = category._count?.posts || 0;

            return (
              <Link key={category.id} href={`/${category.slug}`}>
                <Card className="group hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6">
                    <div
                      className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: category.color
                          ? `${category.color}15`
                          : undefined,
                        color: category.color || undefined,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {postCount} ứng dụng
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
