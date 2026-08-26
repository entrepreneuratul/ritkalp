// =====================================================================
// One-time CLI to create (or reset the password of) an admin account —
// there's no public admin signup page on purpose. Run locally against
// whichever DATABASE_URL is in scope (local .env for dev, or pull
// production env vars with `vercel env pull` first for prod):
//
//   npm run admin:create -- owner@ritkalp.com "a-strong-password" "Atul" OWNER
//
// Role is optional, defaults to OWNER for the very first admin.
// =====================================================================

import { PrismaClient, AdminRole } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  const [email, password, name, roleArg] = process.argv.slice(2);

  if (!email || !password) {
    console.error(
      'Usage: npm run admin:create -- <email> <password> ["Name"] [OWNER|STAFF]'
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const role: AdminRole = roleArg === "STAFF" ? AdminRole.STAFF : AdminRole.OWNER;
  const passwordHash = await hashPassword(password);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, name: name ?? undefined, role },
    create: { email, passwordHash, name: name ?? undefined, role },
  });

  console.log(`✓ Admin ready: ${admin.email} (${admin.role})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
