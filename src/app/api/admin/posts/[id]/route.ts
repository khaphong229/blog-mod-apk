import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Get post
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // If user is EDITOR, check if they own the post
    if (userRole === "EDITOR" && post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only view your own posts" },
        { status: 403 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // If user is EDITOR, check if they own the post
    if (userRole === "EDITOR" && post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own posts" },
        { status: 403 }
      );
    }

    // Delete the post
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();
    const { tagIds, ...restData } = body;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // If user is EDITOR, check if they own the post
    if (userRole === "EDITOR" && post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only update your own posts" },
        { status: 403 }
      );
    }

    // Update publishedAt if status changes to PUBLISHED
    if (restData.status === "PUBLISHED" && post.authorId) {
      const currentPost = await prisma.post.findUnique({
        where: { id },
        select: { status: true, publishedAt: true },
      });
      if (currentPost?.status !== "PUBLISHED" && !currentPost?.publishedAt) {
        restData.publishedAt = new Date();
      }
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...restData,
        tags: tagIds
          ? {
              set: [], // Clear existing tags
              connect: tagIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    return NextResponse.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}
