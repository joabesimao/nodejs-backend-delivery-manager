import { config } from "dotenv";
import { z } from "zod";

// Carrega o .env
config();

// Define o schema das variáveis
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  PORT: z.string(),
  JWT_SECRET: z.string(),

  MYSQL_ROOT_PASSWORD: z.string().optional(),
});

// Valida as variáveis
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Erro nas variáveis de ambiente:");
  console.error(_env.error.format());
  process.exit(1);
}

// Exporta tipado
export const env = _env.data;