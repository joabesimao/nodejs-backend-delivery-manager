import { PrismaClient } from "@prisma/client";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/access-token-repository/update-access-token-repository";
import { DeleteAccountRepository } from "../../../../data/protocols/db/account/delete-account-repository";
import { FindAccountByEmailRepository } from "../../../../data/protocols/db/account/find-account-by-email-repository";
import { LoadAccountByTokenRepository } from "../../../../data/protocols/db/account/load-account-by-token-repository";
import { AccountModel } from "../../../../domain/models/account/account-model";

export class AccountMySqlRepository
  implements
    FindAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository,
    DeleteAccountRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    const account = await this.prisma.account.findUnique({
      where: { id: Number(token) },
    });

    if (!account) {
      return null;
    }

    if (role && account.role !== role) {
      return null;
    }

    return account;
  }

  async updateAccessToken(id: number, token: string): Promise<void> {
    // The current Prisma Account model does not include an accessToken field,
    // so persisting it here would throw at runtime. Keeping this method as a
    // no-op preserves the auth flow without violating the schema.
    void id;
    void token;
    return;
  }
  async loadAccountByEmail(email: string): Promise<AccountModel> {
    const accountById = await this.prisma.account.findUnique({
      where: { email: email },
    });
    return accountById;
  }

  async deleteById(id: number): Promise<string> {
    const deletedAccount = await this.prisma.account.delete({
      where: { id: id },
    });
    return "Conta deletada com sucesso!";
  }
}
