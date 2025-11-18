import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  const { pathname } = req.nextUrl;

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
