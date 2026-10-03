import {
  envSchema,
  JWT_SECRET_MIN_LENGTH_PRODUCTION,
  PUBLIC_PLACEHOLDER_SECRETS,
} from "../../../config/Env";

const makeEnv = (overrides: Record<string, string | undefined> = {}) => ({
  PORT: "3000",
  DB_HOST: "localhost",
  DB_PORT: "3306",
  DB_NAME: "db",
  DB_USER: "user",
  DB_PASSWORD: "pass",
  JWT_SECRET: "a".repeat(JWT_SECRET_MIN_LENGTH_PRODUCTION),
  ...overrides,
});

describe("Env schema", () => {
  test("Should default NODE_ENV to development", () => {
    const result = envSchema.safeParse(makeEnv());
    expect(result.success && result.data.NODE_ENV).toBe("development");
  });

  test("Should accept a short or placeholder JWT_SECRET outside production", () => {
    expect(envSchema.safeParse(makeEnv({ JWT_SECRET: "short" })).success).toBe(true);
    expect(
      envSchema.safeParse(makeEnv({ JWT_SECRET: PUBLIC_PLACEHOLDER_SECRETS[0] })).success,
    ).toBe(true);
  });

  test("Should reject an empty JWT_SECRET", () => {
    expect(envSchema.safeParse(makeEnv({ JWT_SECRET: "" })).success).toBe(false);
  });

  test("Should reject a placeholder JWT_SECRET in production", () => {
    const result = envSchema.safeParse(
      makeEnv({
        NODE_ENV: "production",
        JWT_SECRET: PUBLIC_PLACEHOLDER_SECRETS[0],
        CORS_ORIGINS: "https://app.com",
      }),
    );
    expect(result.success).toBe(false);
  });

  test("Should reject a short JWT_SECRET in production", () => {
    const result = envSchema.safeParse(
      makeEnv({
        NODE_ENV: "production",
        JWT_SECRET: "a".repeat(JWT_SECRET_MIN_LENGTH_PRODUCTION - 1),
        CORS_ORIGINS: "https://app.com",
      }),
    );
    expect(result.success).toBe(false);
  });

  test("Should accept a strong JWT_SECRET in production", () => {
    const result = envSchema.safeParse(
      makeEnv({
        NODE_ENV: "production",
        JWT_SECRET: "b".repeat(64),
        CORS_ORIGINS: "https://app.com",
      }),
    );
    expect(result.success).toBe(true);
  });

  test("Should require CORS_ORIGINS in production", () => {
    const result = envSchema.safeParse(
      makeEnv({ NODE_ENV: "production", JWT_SECRET: "b".repeat(64) }),
    );
    expect(result.success).toBe(false);
  });

  test("Should parse CORS_ORIGINS into a trimmed list without trailing slashes", () => {
    const result = envSchema.safeParse(
      makeEnv({ CORS_ORIGINS: " https://app.com/ , http://localhost:5173 ,," }),
    );
    expect(result.success && result.data.CORS_ORIGINS).toEqual([
      "https://app.com",
      "http://localhost:5173",
    ]);
  });

  test("Should leave CORS_ORIGINS undefined when empty", () => {
    const result = envSchema.safeParse(makeEnv({ CORS_ORIGINS: " " }));
    expect(result.success && result.data.CORS_ORIGINS).toBeUndefined();
  });
});
