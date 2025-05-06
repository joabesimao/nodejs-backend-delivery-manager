import env from "../../../../env";
import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";

export let prisma = new PrismaClient();

export const pool = mysql.createPool({
  host: env.host,
  port: env.port,
  user: env.user,
  password: env.password,
  database: env.database,
});
