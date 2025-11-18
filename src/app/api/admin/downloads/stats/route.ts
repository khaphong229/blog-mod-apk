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

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get download statistics
    const [
      totalDownloads,
      downloadsInPeriod,
      topPosts,
      downloadsByDay,
    ] = await Promise.all([
      // Total downloads
      prisma.download.count(),

      // Downloads in period
      prisma.download.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),

      // Top downloaded posts
      prisma.post.findMany({
        orderBy: {
          downloadCount: "desc",
        },
        take: 10,
        select: {
          id: true,
          title: true,
          slug: true,
          downloadCount: true,
          featuredImage: true,
        },
      }),

      // Downloads by day (last 30 days)
      prisma.$queryRaw`
        SELECT
          DATE(createdAt) as date,
          COUNT(*) as count
        FROM Download
        WHERE createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,
    ]);

    return NextResponse.json({
      totalDownloads,
      downloadsInPeriod,
      topPosts,
      downloadsByDay,
    });
  } catch (error) {
    console.error("Error fetching download stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch download statistics" },
      { status: 500 }
    );
  }
}
