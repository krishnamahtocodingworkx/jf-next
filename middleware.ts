// Next.js Edge middleware stub. Auth tokens live in localStorage so route guarding happens client-side
// in `AuthGuard` / `PublicGuard`; this file exists so we can hook in redirects, headers, or A/B flags later
// without touching the matcher config.
import { NextResponse } from "next/server";

/** No-op pass-through — extend here when we need server-side redirects (e.g., locale, maintenance mode). */
export function middleware() {
  return NextResponse.next();
}

/** Runs on every request except static asset / Next internals / image extensions. */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
