import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define routes that require authentication
  const protectedRoutes = [
    "/user/health",
    "/user/appointments",
    "/user/doctors",
    "/user/hospitals",
    "/doctor/dashboard",
    "/admin/dashboard",
  ];

  // Check if the requested path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check if the user is authenticated using NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "your-nextauth-secret",
    });

    if (!token) {
      // If there's no token, redirect to login
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Only run the middleware on specific paths
export const config = {
  matcher: ["/user/:path*", "/doctor/:path*", "/admin/:path*"],
};
