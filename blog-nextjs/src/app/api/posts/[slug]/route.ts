import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const post = await prisma.post.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        featuredImage: true,
        status: true,
        featured: true,
        version: true,
        fileSize: true,
        requirements: true,
        developer: true,
        downloadUrl: true,
        downloadCount: true,
        viewCount: true,
        metaTitle: true,
        metaDescription: true,
        metaKeywords: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Bài viết không tồn tại" },
        { status: 404 }
      );
    }

    // Only return published posts to public
    if (post.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Bài viết không tồn tại" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Lỗi khi tải bài viết" },
      { status: 500 }
    );
  }
}
