import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (process.env.APP_MODE !== "runner") {
    return;
  }
  if (request.nextUrl.pathname.startsWith("/runner")) {
    return NextResponse.rewrite(new URL("/runner", request.url));
  }
  return NextResponse.redirect(new URL("/runner", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:path*",
};
