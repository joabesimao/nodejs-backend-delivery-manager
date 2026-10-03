import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Valores de exemplo publicados no repositório (.env.public, README). Qualquer
// pessoa conhece esses segredos, então nunca podem ser usados em produção.
export const PUBLIC_PLACEHOLDER_SECRETS = [
  "fastone_jwt_secret_public_change_me",
  "fastone_jwt_secret_here",
  "sua_chave_secreta_aqui",
];

export const JWT_SECRET_MIN_LENGTH_PRODUCTION = 32;

export const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number(),

    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(),
    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),

    JWT_SECRET: z.string().min(1),
    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

    // Origens liberadas no CORS, separadas por vírgula
    // (ex.: "https://app.exemplo.com,http://localhost:5173").
    // Sem valor, qualquer origem é aceita — permitido só fora de produção.
    CORS_ORIGINS: z
      .string()
      .optional()
      .transform((value) => {
        const origins = (value ?? "")
          .split(",")
          .map((origin) => origin.trim().replace(/\/+$/, ""))
          .filter(Boolean);
        return origins.length ? origins : undefined;
      }),
  })
  .superRefine((value, ctx) => {
    if (value.NODE_ENV !== "production") {
      return;
    }
    if (PUBLIC_PLACEHOLDER_SECRETS.includes(value.JWT_SECRET)) {
      ctx.addIssue({
        code: "custom",
        path: ["JWT_SECRET"],
        message:
          "JWT_SECRET de exemplo não pode ser usado em produção. Gere um com: openssl rand -hex 32",
      });
    }
    if (!value.CORS_ORIGINS) {
      ctx.addIssue({
        code: "custom",
        path: ["CORS_ORIGINS"],
        message:
          "Defina CORS_ORIGINS em produção com as origens do frontend (separadas por vírgula).",
      });
    }
    if (value.JWT_SECRET.length < JWT_SECRET_MIN_LENGTH_PRODUCTION) {
      ctx.addIssue({
        code: "custom",
        path: ["JWT_SECRET"],
        message: `JWT_SECRET deve ter ao menos ${JWT_SECRET_MIN_LENGTH_PRODUCTION} caracteres em produção.`,
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Erro nas variáveis de ambiente:");
  console.error(parsed.error.format());

  process.exit(1);
}

if (
  parsed.data.NODE_ENV === "development" &&
  (PUBLIC_PLACEHOLDER_SECRETS.includes(parsed.data.JWT_SECRET) ||
    parsed.data.JWT_SECRET.length < JWT_SECRET_MIN_LENGTH_PRODUCTION)
) {
  console.warn(
    "⚠️  JWT_SECRET fraco ou de exemplo: aceitável só em desenvolvimento/demo local.",
  );
}

export const env = parsed.data;
