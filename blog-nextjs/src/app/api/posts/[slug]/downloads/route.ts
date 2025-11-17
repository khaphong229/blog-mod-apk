import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Increment download count
    const post = await prisma.post.update({
      where: { slug },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        downloadCount: true,
      },
    });

    return NextResponse.json({
      success: true,
      downloadCount: post.downloadCount,
    });
  } catch (error) {
    console.error("Error incrementing download count:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật lượt tải" },
      { status: 500 }
    );
  }
}
