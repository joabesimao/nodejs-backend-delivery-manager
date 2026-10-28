import { env } from "../../../../../config/Env";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  datasourceUrl: env.DATABASE_URL,
});
