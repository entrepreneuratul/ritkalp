// =====================================================================
// AUTH CONFIG — the Edge-safe half of the Auth.js setup. Contains NO
// providers (Credentials providers pull in Prisma + bcryptjs, which
// aren't Edge-runtime-safe) and NO Node-only imports, so middleware.ts
// can build its own NextAuth() instance from just this config to read
// the session cookie — see lib/auth.ts for the full config (providers
// included) used everywhere else (API routes, server components).
// =====================================================================

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/account/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const u = user as { role?: "customer" | "admin"; adminRole?: "OWNER" | "STAFF" };
        token.role = u.role;
        token.adminRole = u.adminRole;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as "customer" | "admin" | undefined) ?? "customer";
        session.user.adminRole = token.adminRole as "OWNER" | "STAFF" | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
