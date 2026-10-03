import { AccountRole } from "@prisma/client";

// Rotas de leitura sem lista explícita usam auth() e aceitam qualquer role.

export const DASHBOARD_READ_ROLES: AccountRole[] = [
  "admin",
  "gerente_estoque",
  "user",
];

// Entregadores, produtos, cidades e bairros.
export const CATALOG_READ_ROLES: AccountRole[] = [
  "admin",
  "gerente_estoque",
  "user",
];

// Criação/edição de pedidos, cadastros, catálogo e veículos.
export const OPERATOR_WRITE_ROLES: AccountRole[] = [
  "admin",
  "gerente_estoque",
  "user",
];

// Atualizar/finalizar pedido e lançar troca de óleo/abastecimento.
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
