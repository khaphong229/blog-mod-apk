import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const session = await getServerSession(authOptions);

    // Get IP and User Agent
    const ipAddress = request.headers.get("x-forwarded-for") ||
                     request.headers.get("x-real-ip") ||
                     "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Find post
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Create download record and increment count
    await Promise.all([
      prisma.download.create({
        data: {
          postId: post.id,
          userId: session?.user?.id || null,
          ipAddress,
          userAgent,
        },
      }),
      prisma.post.update({
        where: { id: post.id },
        data: {
          downloadCount: {
            increment: 1,
          },
        },
      }),
    ]);

    const updatedPost = await prisma.post.findUnique({
      where: { id: post.id },
      select: { downloadCount: true },
    });

    return NextResponse.json({
      success: true,
      downloadCount: updatedPost?.downloadCount || 0,
    });
  } catch (error) {
    console.error("Error tracking download:", error);
    return NextResponse.json(
      { error: "Lỗi khi cập nhật lượt tải" },
      { status: 500 }
    );
  }
}
