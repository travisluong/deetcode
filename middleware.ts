import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (process.env.APP_MODE !== "runner") {
    return;
  }
  if (request.nextUrl.pathname.startsWith("/playground")) {
    return NextResponse.redirect(new URL("/runner", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/problem-list")) {
    return NextResponse.redirect(new URL("/runner", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/problems")) {
    return NextResponse.redirect(new URL("/runner", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/runner", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/runner", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/users")) {
    return NextResponse.redirect(new URL("/runner", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/runner", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:path*",
};
