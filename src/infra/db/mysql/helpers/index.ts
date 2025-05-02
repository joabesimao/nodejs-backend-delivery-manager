import mysql from "mysql2/promise";
/* import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

async function connection() {
  await prisma.$connect();
}
connection(); */

export async function get() {}

export const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123456",
  database: "CadClient",
});
