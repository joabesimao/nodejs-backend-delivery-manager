import { Prisma, PrismaClient } from "@prisma/client";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/access-token-repository/update-access-token-repository";
import { UpdateRefreshTokenRepository } from "../../../../data/protocols/db/access-token-repository/update-refresh-token-repository";
import { DeleteAccountRepository } from "../../../../data/protocols/db/account/delete-account-repository";
import { FindAccountByEmailRepository } from "../../../../data/protocols/db/account/find-account-by-email-repository";
import { LoadAccountByTokenRepository } from "../../../../data/protocols/db/account/load-account-by-token-repository";
import { LoadAccountsRepository } from "../../../../data/protocols/db/account/load-accounts-repository";
import { LoadAccountByIdRepository } from "../../../../data/protocols/db/account/load-account-by-id-repository";
import { CountActiveAdminsRepository } from "../../../../data/protocols/db/account/count-active-admins-repository";
import { UpdateAccountRepository } from "../../../../data/protocols/db/account/update-account-repository";
import { AccountModel } from "../../../../domain/models/account/account-model";
import { PublicAccountModel } from "../../../../domain/models/account/public-account-model";
import { LoadAccountsFilter } from "../../../../domain/usescases/account/load-accounts";
import { UpdateAccountModel } from "../../../../domain/usescases/account/update-account";

const PUBLIC_ACCOUNT_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  active: true,
  unitStoreId: true,
} satisfies Prisma.AccountSelect;

export class AccountMySqlRepository
  implements
    FindAccountByEmailRepository,
    UpdateAccessTokenRepository,
    UpdateRefreshTokenRepository,
    LoadAccountByTokenRepository,
    DeleteAccountRepository,
    LoadAccountsRepository,
    LoadAccountByIdRepository,
    CountActiveAdminsRepository,
    UpdateAccountRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async loadByToken(token: string): Promise<AccountModel> {
    const account = await this.prisma.account.findUnique({
      where: { id: Number(token) },
    });

    if (!account) {
      return null;
    }

    return account;
  }

  async updateAccessToken(id: number, token: string): Promise<void> {
    void id;
    void token;
  }

  async updateRefreshToken(
    id: number,
    refreshTokenHash: string | null,
    expiresAt: Date | null
  ): Promise<void> {
    await this.prisma.account.update({
      where: { id },
      data: { refreshTokenHash, refreshTokenExpiresAt: expiresAt },
    });
  }

  async loadAccountByEmail(email: string): Promise<AccountModel> {
    const accountById = await this.prisma.account.findUnique({
      where: { email },
    });
    return accountById;
  }

  async deleteById(id: number): Promise<string> {
    await this.prisma.account.delete({
      where: { id },
    });
    return "Conta deletada com sucesso!";
  }

  async loadAll(filter?: LoadAccountsFilter): Promise<PublicAccountModel[]> {
    const accounts = await this.prisma.account.findMany({
      where: {
        role: filter?.role,
        ...(filter?.q
          ? {
              OR: [
                { name: { contains: filter.q } },
                { email: { contains: filter.q } },
              ],
            }
          : {}),
      },
      select: PUBLIC_ACCOUNT_SELECT,
      orderBy: { name: "asc" },
    });

    return accounts;
  }

  async loadById(id: number): Promise<PublicAccountModel | null> {
    const account = await this.prisma.account.findUnique({
      where: { id },
      select: PUBLIC_ACCOUNT_SELECT,
    });
    return account;
  }

  async countActiveAdmins(): Promise<number> {
    return await this.prisma.account.count({
      where: { role: "admin", active: true },
    });
  }

  async updateById(
    id: number,
    data: UpdateAccountModel,
  ): Promise<PublicAccountModel> {
    const account = await this.prisma.account.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        active: data.active,
        password: data.password,
      },
      select: PUBLIC_ACCOUNT_SELECT,
    });
    return account;
  }
}
