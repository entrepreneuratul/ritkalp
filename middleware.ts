// =====================================================================
// MIDDLEWARE — gates /admin/** behind an admin session. Everything else
// (storefront, /account/**) is public; /account pages do their own
// "logged in?" check since guest checkout means most visitors there
// simply aren't signed in, which isn't an error the way it is for /admin.
//
// Built from lib/auth.config.ts (NOT lib/auth.ts) on purpose — Next.js
// middleware runs on the Edge runtime, which can't load Prisma/bcryptjs
// (lib/auth.ts's Credentials providers pull both in). This lighter
// instance only reads/verifies the session cookie, which is enough to
// gate routes; it never calls `authorize()`.
// =====================================================================

import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  if (isAdminRoute && !isAdminLogin) {
    const isAdmin = req.auth?.user?.role === "admin";
    if (!isAdmin) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
