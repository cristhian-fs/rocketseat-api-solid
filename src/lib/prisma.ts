import { env } from "@/env";
import { PrismaClient } from "@/generated/client";

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query'] : []
})
