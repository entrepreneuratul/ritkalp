// =====================================================================
// PRISMA CLIENT — singleton
// Next.js dev mode hot-reloads modules on every save, which would create
// a fresh PrismaClient (and a fresh DB connection pool) each time
// without this — the standard fix is stashing the instance on
// `globalThis` so it survives reloads. In production (one process per
// serverless invocation) this just behaves like a plain singleton.
// =====================================================================

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
