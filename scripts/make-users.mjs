// scripts/make-user.mjs
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // load DATABASE_URL from .env.local

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [, , phone, password, nameArg, roleArg] = process.argv;
  if (!phone || !password) {
    console.error("Usage: node scripts/make-user.mjs <phone> <password> [name] [role: USER|ADMIN|PARTNER]");
    process.exit(1);
  }
  const name = nameArg || "";
  const role = roleArg === "ADMIN" || roleArg === "PARTNER" ? roleArg : "USER";

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { phone },
    update: { password: hash, name },
    create: { phone, password: hash, name, role },
  });

  console.log("OK user:", user.id, user.phone, "role:", user.role);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
