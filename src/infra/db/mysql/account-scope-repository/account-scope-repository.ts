import { PrismaClient } from "@prisma/client";
import {
  LoadAccountRoleRepository,
  LoadAccountScopeRepository,
} from "../../../../data/protocols/db/account/load-account-scope-repository";
import { AccountRole } from "../../../../domain/models/account/account-role";
import { AccountScope } from "../../../../domain/models/store/account-scope";
import { getAccountScope } from "../helpers/store-scope";

export class AccountScopeMysqlRepository
  implements LoadAccountScopeRepository, LoadAccountRoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async loadScope(accountId: number): Promise<AccountScope | null> {
    return await getAccountScope(this.prisma, accountId);
  }

  async loadRole(accountId: number): Promise<AccountRole | null> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: { role: true },
    });
    return account?.role ?? null;
  }
}
