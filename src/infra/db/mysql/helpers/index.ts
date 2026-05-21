import {env} from "../../../../../config/Env";
import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";

export let prisma = new PrismaClient({
  datasourceUrl: `mysql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
});

export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME
});
