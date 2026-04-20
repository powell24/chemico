import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const hasSession = request.cookies.getAll().some(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  )

  const isAuthRoute = pathname.startsWith("/login")
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/copilot") ||
    pathname.startsWith("/documents") ||
    pathname.startsWith("/sites") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/settings")

  if (!hasSession && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
}
