import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (!["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Parallel queries for better performance
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalUsers,
      totalCategories,
      totalTags,
      totalComments,
      pendingComments,
      approvedComments,
      totalDownloads,
      totalViews,
      recentPosts,
      recentComments,
      topPosts,
      postsGrowth,
      downloadsGrowth,
      viewsGrowth,
      usersGrowth,
    ] = await Promise.all([
      // Total counts
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.user.count(),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.comment.count(),
      prisma.comment.count({ where: { status: "PENDING" } }),
      prisma.comment.count({ where: { status: "APPROVED" } }),
      prisma.download.count(),

      // Total views (sum of all post views)
      prisma.post.aggregate({
        _sum: { viewCount: true },
      }),

      // Recent posts (last 5)
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          createdAt: true,
          featuredImage: true,
          author: {
            select: { name: true, image: true },
          },
        },
      }),

      // Recent comments (last 5)
      prisma.comment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          status: true,
          createdAt: true,
          author: {
            select: { name: true, image: true },
          },
          post: {
            select: { title: true, slug: true },
          },
        },
      }),

      // Top posts by views
      prisma.post.findMany({
        take: 10,
        where: { status: "PUBLISHED" },
        orderBy: { viewCount: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          viewCount: true,
          downloadCount: true,
          featuredImage: true,
        },
      }),

      // Growth metrics
      prisma.post.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.download.count({
        where: { createdAt: { gte: startDate } },
      }),
      prisma.post.aggregate({
        where: { createdAt: { gte: startDate } },
        _sum: { viewCount: true },
      }),
      prisma.user.count({
        where: { createdAt: { gte: startDate } },
      }),
    ]);

    // Calculate growth percentages
    const postsGrowthPercent = totalPosts > 0
      ? ((postsGrowth / totalPosts) * 100).toFixed(1)
      : 0;
    const downloadsGrowthPercent = totalDownloads > 0
      ? ((downloadsGrowth / totalDownloads) * 100).toFixed(1)
      : 0;
    const viewsTotal = totalViews._sum.viewCount || 0;
    const viewsGrowthPercent = viewsTotal > 0
      ? (((viewsGrowth._sum.viewCount || 0) / viewsTotal) * 100).toFixed(1)
      : 0;
    const usersGrowthPercent = totalUsers > 0
      ? ((usersGrowth / totalUsers) * 100).toFixed(1)
      : 0;

    // Get daily stats for the last 7 days
    const dailyStats = await prisma.$queryRaw<
      Array<{ date: Date; posts: bigint; downloads: bigint; views: bigint }>
    >`
      SELECT
        DATE(created_at) as date,
        COUNT(CASE WHEN table_name = 'Post' THEN 1 END) as posts,
        COUNT(CASE WHEN table_name = 'Download' THEN 1 END) as downloads,
        0 as views
      FROM (
        SELECT created_at, 'Post' as table_name FROM "Post" WHERE created_at >= ${startDate}
        UNION ALL
        SELECT created_at, 'Download' as table_name FROM "Download" WHERE created_at >= ${startDate}
      ) combined
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 7
    `;

    return NextResponse.json({
      totals: {
        posts: totalPosts,
        publishedPosts,
        draftPosts,
        users: totalUsers,
        categories: totalCategories,
        tags: totalTags,
        comments: totalComments,
        pendingComments,
        approvedComments,
        downloads: totalDownloads,
        views: viewsTotal,
      },
      growth: {
        posts: {
          count: postsGrowth,
          percent: postsGrowthPercent,
        },
        downloads: {
          count: downloadsGrowth,
          percent: downloadsGrowthPercent,
        },
        views: {
          count: viewsGrowth._sum.viewCount || 0,
          percent: viewsGrowthPercent,
        },
        users: {
          count: usersGrowth,
          percent: usersGrowthPercent,
        },
      },
      recentPosts,
      recentComments,
      topPosts,
      dailyStats: dailyStats.reverse().map((stat) => ({
        date: stat.date,
        posts: Number(stat.posts),
        downloads: Number(stat.downloads),
        views: Number(stat.views),
      })),
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
