import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sortBy = searchParams.get("sortBy") || "recent"; // recent, popular, title
    const skip = (page - 1) * limit;

    // Find category
    const category = await prisma.category.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Danh mục không tồn tại" },
        { status: 404 }
      );
    }

    // Determine sort order
    let orderBy: any = { createdAt: "desc" }; // default: recent

    if (sortBy === "popular") {
      orderBy = { views: "desc" };
    } else if (sortBy === "title") {
      orderBy = { title: "asc" };
    } else if (sortBy === "downloads") {
      orderBy = { downloads: "desc" };
    }

    // Fetch posts with pagination
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          categoryId: category.id,
          status: "PUBLISHED",
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          views: true,
          downloads: true,
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
      prisma.post.count({
        where: {
          categoryId: category.id,
          status: "PUBLISHED",
        },
      }),
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
    console.error("Error fetching posts by category:", error);
    return NextResponse.json(
      { error: "Lỗi khi tải bài viết" },
      { status: 500 }
    );
  }
}
