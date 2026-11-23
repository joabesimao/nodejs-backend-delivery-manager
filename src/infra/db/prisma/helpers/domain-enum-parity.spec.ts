import {
  AccountRole as PrismaAccountRole,
  OrderStatus as PrismaOrderStatus,
} from "@prisma/client";
import {
  ACCOUNT_ROLES,
  AccountRole,
} from "../../../../domain/models/account/account-role";
import { OrderStatus } from "../../../../domain/models/order-delivery/order-delivery";

type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
const accountRoleMatches: Same<AccountRole, PrismaAccountRole> = true;
const orderStatusMatches: Same<OrderStatus, PrismaOrderStatus> = true;

describe("paridade entre enums do domínio e do Prisma", () => {
  test("AccountRole tem os mesmos valores", () => {
    expect(accountRoleMatches).toBe(true);
    expect([...ACCOUNT_ROLES].sort()).toEqual(
      Object.values(PrismaAccountRole).sort(),
    );
  });

  test("OrderStatus tem os mesmos valores", () => {
    expect(orderStatusMatches).toBe(true);
  });
});
