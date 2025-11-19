import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  const { pathname } = req.nextUrl;

  // Public API routes (GET requests only)
  const isPublicGetRoute =
    req.method === "GET" && (
      pathname === "/api/posts/featured" ||
      pathname === "/api/posts/recent" ||
      pathname === "/api/posts/popular" ||
      pathname === "/api/categories" ||
      pathname.startsWith("/api/posts/category/") ||
      pathname.startsWith("/api/posts/search") ||
      pathname === "/api/posts" ||
      (pathname.startsWith("/api/posts/") && !pathname.includes("/downloads") && !pathname.includes("/comments"))
    );

  // Allow public GET requests without authentication
  if (isPublicGetRoute) {
    return NextResponse.next();
  }

  // Protected routes that require authentication
  const isProtectedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/posts") ||
    pathname.startsWith("/api/categories") ||
    pathname.startsWith("/api/tags") ||
    pathname.startsWith("/api/comments") ||
    pathname.startsWith("/api/media") ||
    pathname.startsWith("/api/upload");

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/posts/:path*",
    "/api/categories/:path*",
    "/api/tags/:path*",
    "/api/comments/:path*",
    "/api/media/:path*",
    "/api/upload/:path*",
  ],
};
