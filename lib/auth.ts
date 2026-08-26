// =====================================================================
// AUTH — the full Auth.js (NextAuth v5) config, Node-runtime only (API
// routes, server components/actions — never middleware, see
// lib/auth.config.ts for why). Two Credentials "providers" share one
// config: `customer` (optional accounts — checkout never requires one,
// see components/CartDrawer.tsx) and `admin` (required for everything
// under /admin — see middleware.ts). Both just verify a bcrypt hash
// against Prisma directly in `authorize` — no NextAuth database
// adapter/tables needed since sessions are JWTs, not DB-backed.
// =====================================================================

import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "customer" | "admin";
      adminRole?: "OWNER" | "STAFF";
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "customer",
      name: "Customer",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const customer = await prisma.customer.findUnique({ where: { email } });
        if (!customer?.passwordHash) return null;

        const valid = await verifyPassword(password, customer.passwordHash);
        if (!valid) return null;

        return {
          id: customer.id,
          name: customer.name ?? undefined,
          email: customer.email ?? undefined,
          role: "customer" as const,
        };
      },
    }),
    Credentials({
      id: "admin",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) return null;

        const valid = await verifyPassword(password, admin.passwordHash);
        if (!valid) return null;

        return {
          id: admin.id,
          name: admin.name ?? undefined,
          email: admin.email,
          role: "admin" as const,
          adminRole: admin.role,
        };
      },
    }),
  ],
});
