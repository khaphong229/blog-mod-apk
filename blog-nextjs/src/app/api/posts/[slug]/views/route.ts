import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Increment view count
    const post = await prisma.post.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        viewCount: true,
      },
    });

    return NextResponse.json({
      success: true,
      viewCount: post.viewCount,
    });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật lượt xem" },
      { status: 500 }
    );
  }
}
