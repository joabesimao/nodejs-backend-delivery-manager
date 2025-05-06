import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";

export let prisma = new PrismaClient();

export const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootpassword",
  database: "CadClient",
});
