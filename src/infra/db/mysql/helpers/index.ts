import { PrismaClient } from "@prisma/client";
import mysql from "mysql2";

export const prisma = PrismaClient();

export const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123456",
  database: "CadClient",
});
