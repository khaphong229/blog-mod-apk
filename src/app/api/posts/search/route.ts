import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const categoryId = searchParams.get("categoryId");
    const tagId = searchParams.get("tagId");
    const sortBy = searchParams.get("sortBy") || "recent";
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: "PUBLISHED",
    };

    // Search query - search in title, excerpt, and content
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { excerpt: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ];
    }

    // Filter by category
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Filter by tag
    if (tagId) {
      where.tags = {
        some: {
          id: tagId,
        },
      };
    }

    // Determine sort order
    let orderBy: any = { createdAt: "desc" }; // default: recent
    if (sortBy === "popular") {
      orderBy = { viewCount: "desc" };
    } else if (sortBy === "downloads") {
      orderBy = { downloadCount: "desc" };
    } else if (sortBy === "title") {
      orderBy = { title: "asc" };
    }

    // Fetch posts with pagination
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          viewCount: true,
          downloadCount: true,
          createdAt: true,
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
              color: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    return NextResponse.json(
      { error: "Lỗi khi tìm kiếm bài viết" },
      { status: 500 }
    );
  }
}
