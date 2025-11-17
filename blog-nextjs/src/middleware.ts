import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

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
