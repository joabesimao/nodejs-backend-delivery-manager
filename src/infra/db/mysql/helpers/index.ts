import {env} from "../../../../../config/Env";
import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";

export let prisma = new PrismaClient();

export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME
});
