import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

const protectedRoutes = ["/dashboard", "/assets", "/tickets", "/maintenance"]
const publicRoutes = ["/login", "/", "/signup"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth-token")?.value

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/api/auth")

  // Allow API routes and public routes
  if (pathname.startsWith("/api") || isPublicRoute) {
    return NextResponse.next()
  }

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If accessing protected route with token, verify it
  if (isProtectedRoute && token) {
    try {
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch (err) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // If accessing login/signup while authenticated, redirect to dashboard
  if ((pathname === "/login" || pathname === "/signup") && token) {
    try {
      await jwtVerify(token, secret)
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } catch (err) {
      // Token is invalid, allow access to login
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
