import { AccountRole } from "@prisma/client";

export const DASHBOARD_READ_ROLES: AccountRole[] = [
  "admin",
  "gerente_estoque",
  "user",
];

export const CATALOG_READ_ROLES: AccountRole[] = [
  "admin",
  "gerente_estoque",
  "user",
];

export const OPERATOR_WRITE_ROLES: AccountRole[] = [
  "admin",
  "gerente_estoque",
  "user",
];

export const FIELD_WRITE_ROLES: AccountRole[] = [
  "admin",
  "gerente_estoque",
  "entregador",
  "user",
];

export const FLEET_READ_ROLES: AccountRole[] = [
  "admin",
  "gerente_estoque",
  "entregador",
  "user",
];

export const MANAGER_ROLES: AccountRole[] = ["admin", "gerente_estoque"];

export const ADMIN_ROLES: AccountRole[] = ["admin"];
