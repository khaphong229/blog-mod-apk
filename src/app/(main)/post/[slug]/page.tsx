import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PostPageClient } from "@/components/post/PostPageClient";
import {
  generateMetadata as generateSEOMetadata,
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  generateSoftwareApplicationStructuredData,
} from "@/lib/seo";

interface PostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = params;

  const post = await prisma.post.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      tags: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!post) {
    return {
      title: "Không tìm thấy bài viết",
    };
  }

  return generateSEOMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || "",
    image: post.featuredImage || undefined,
    url: `/post/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    author: post.author.name || undefined,
    tags: post.tags.map((tag) => tag.name),
  });
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <>
      <PostPageClient slug={params.slug} />
      <StructuredData slug={params.slug} />
    </>
  );
}

// Structured Data Component
async function StructuredData({ slug }: { slug: string }) {
  const post = await prisma.post.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!post) {
    return null;
  }

  const articleData = generateArticleStructuredData({
    title: post.title,
    description: post.excerpt || "",
    image: post.featuredImage || undefined,
    url: `/post/${post.slug}`,
    publishedTime: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    author: {
      name: post.author.name || "Anonymous",
      image: post.author.image || undefined,
    },
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Trang chủ", url: "/" },
    ...(post.category
      ? [{ name: post.category.name, url: `/category/${post.category.slug}` }]
      : []),
    { name: post.title, url: `/post/${post.slug}` },
  ]);

  const softwareData =
    post.version || post.developer
      ? generateSoftwareApplicationStructuredData({
          name: post.title,
          description: post.excerpt || "",
          image: post.featuredImage || undefined,
          version: post.version || undefined,
          fileSize: post.fileSize || undefined,
          requirements: post.requirements || undefined,
          developer: post.developer || undefined,
          downloadUrl: post.downloadUrl || undefined,
        })
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      {softwareData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareData) }}
        />
      )}
    </>
  );
}
