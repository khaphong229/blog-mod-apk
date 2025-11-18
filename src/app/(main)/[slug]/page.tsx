import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryPage } from "@/components/category/CategoryPage";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      description: true,
      image: true,
    },
  });

  if (!category) {
    return {
      title: "Không tìm thấy danh mục",
    };
  }

  return generateSEOMetadata({
    title: category.name,
    description:
      category.description ||
      `Khám phá các ứng dụng và game trong danh mục ${category.name}`,
    image: category.image || undefined,
    url: `/${params.slug}`,
    type: "website",
  });
}

export default async function Page({ params }: CategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      color: true,
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <CategoryPage
      categorySlug={category.slug}
      categoryName={category.name}
      categoryDescription={category.description}
      categoryColor={category.color}
    />
  );
}
