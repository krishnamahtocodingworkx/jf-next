import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Edge middleware (root `middleware.ts`).
 * Runs before requests complete — use for redirects, headers, locale, A/B flags, etc.
 * Auth with tokens in localStorage cannot be read here; use cookies/session if you need Edge auth.
 *
 * Industry placement: repository root next to `app/` (or `src/middleware.ts` when using a `src/` layout).
 */
export function middleware(request: NextRequest) {
  console.log("[middleware]", request.method, request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on all paths except static assets, Next internals, and metadata files.
     * Adjust if you only need middleware on specific segments (e.g. `/app/:path*`).
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
