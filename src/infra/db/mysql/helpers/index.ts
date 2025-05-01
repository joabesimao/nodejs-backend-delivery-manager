import mysql from "mysql2/promise";
import { PrismaClient } from "../../../../../generated/prisma";

export const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123456",
  database: "CadClient",
});

export const prisma = new PrismaClient();
