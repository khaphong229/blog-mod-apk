"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Tải ứng dụng, game{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              miễn phí
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            Khám phá hàng nghìn ứng dụng, game và công cụ chất lượng cao.
            Tải xuống nhanh chóng, an toàn và hoàn toàn miễn phí.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-10">
            <div className="flex gap-2 mx-auto max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm ứng dụng, game..."
                  className="pl-10 h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8">
                Tìm kiếm
              </Button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div>
              <span className="text-2xl font-bold text-foreground">1000+</span>
              <p className="mt-1">Ứng dụng</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <span className="text-2xl font-bold text-foreground">500+</span>
              <p className="mt-1">Game</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <span className="text-2xl font-bold text-foreground">50K+</span>
              <p className="mt-1">Lượt tải</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>
    </section>
  );
}
