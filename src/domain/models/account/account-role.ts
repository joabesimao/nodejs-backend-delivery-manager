export const ACCOUNT_ROLES = [
  "admin",
  "gerente_estoque",
  "entregador",
  "user",
] as const;

export type AccountRole = (typeof ACCOUNT_ROLES)[number];

export const isAccountRole = (value: unknown): value is AccountRole =>
  typeof value === "string" &&
  (ACCOUNT_ROLES as readonly string[]).includes(value);
