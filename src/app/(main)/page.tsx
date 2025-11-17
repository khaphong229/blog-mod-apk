import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedPosts } from "@/components/home/FeaturedPosts";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { RecentPosts } from "@/components/home/RecentPosts";
import { PopularPosts } from "@/components/home/PopularPosts";

export default function HomePage() {
  return (
    <>
      {/* Hero Section with Search */}
      <HeroSection />

      {/* Featured Posts - 4 posts in grid */}
      <FeaturedPosts />

      {/* Categories Grid */}
      <CategoriesGrid />

      {/* Recent Posts with Popular Sidebar */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Recent Posts */}
            <div className="lg:col-span-2">
              <RecentPosts />
            </div>

            {/* Sidebar - Popular Posts */}
            <aside className="space-y-6">
              <PopularPosts />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
