import { PrismaClient } from "@prisma/client";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/access-token-repository/update-access-token-repository";
import { UpdateRefreshTokenRepository } from "../../../../data/protocols/db/access-token-repository/update-refresh-token-repository";
import { DeleteAccountRepository } from "../../../../data/protocols/db/account/delete-account-repository";
import { FindAccountByEmailRepository } from "../../../../data/protocols/db/account/find-account-by-email-repository";
import { LoadAccountByTokenRepository } from "../../../../data/protocols/db/account/load-account-by-token-repository";
import { AccountModel } from "../../../../domain/models/account/account-model";

export class AccountMySqlRepository
  implements
    FindAccountByEmailRepository,
    UpdateAccessTokenRepository,
    UpdateRefreshTokenRepository,
    LoadAccountByTokenRepository,
    DeleteAccountRepository
{
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
    // Access tokens are short-lived stateless JWTs (no revocation needed),
    // so there is nothing to persist here by design.
    void id;
    void token;
    return;
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
