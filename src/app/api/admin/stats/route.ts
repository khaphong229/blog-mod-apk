import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or editor
    const userRole = (session.user as any).role;
    if (!["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get statistics
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
      totalTags,
      totalComments,
      totalUsers,
      totalViews,
      totalDownloads,
      recentPosts,
      recentComments,
    ] = await Promise.all([
      // Total posts
      prisma.post.count(),

      // Published posts
      prisma.post.count({
        where: { status: "PUBLISHED" },
      }),

      // Draft posts
      prisma.post.count({
        where: { status: "DRAFT" },
      }),

      // Total categories
      prisma.category.count(),

      // Total tags
      prisma.tag.count(),

      // Total comments
      prisma.comment.count(),

      // Total users
      prisma.user.count(),

      // Total views
      prisma.post.aggregate({
        _sum: {
          viewCount: true,
        },
      }),

      // Total downloads
      prisma.post.aggregate({
        _sum: {
          downloadCount: true,
        },
      }),

      // Recent posts (last 5)
      prisma.post.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          createdAt: true,
          author: {
            select: {
              name: true,
            },
          },
        },
      }),

      // Recent comments (last 5)
      prisma.comment.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          status: true,
          author: {
            select: {
              name: true,
            },
          },
          post: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        posts: {
          total: totalPosts,
          published: publishedPosts,
          draft: draftPosts,
        },
        categories: totalCategories,
        tags: totalTags,
        comments: totalComments,
        users: totalUsers,
        views: totalViews._sum.viewCount || 0,
        downloads: totalDownloads._sum.downloadCount || 0,
      },
      recentActivity: {
        posts: recentPosts,
        comments: recentComments,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
