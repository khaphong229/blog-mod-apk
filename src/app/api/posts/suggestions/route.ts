import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "5");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
      },
      orderBy: {
        viewCount: "desc",
      },
      take: limit,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return NextResponse.json([], { status: 500 });
  }
}
