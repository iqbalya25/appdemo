import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (
      (req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/orders") || // Add this line
        req.nextUrl.pathname === "/orders") && // Add this line for exact match
      req.nextauth.token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (
      req.nextUrl.pathname.startsWith("/cashier") &&
      req.nextauth.token?.role !== "ADMIN" &&
      req.nextauth.token?.role !== "CASHIER"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/orders", // Add exact match
    "/orders/:path*", // Add for nested routes
    "/cashier",
    "/cashier/:path*",
  ],
};
