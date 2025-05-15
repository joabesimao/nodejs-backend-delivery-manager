import { PrismaClient } from "@prisma/client";
import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository";
import { AccountModel } from "../../../../domain/models/account/account-model";
import { AddAccountModel } from "../../../../domain/usescases/signup/add-account";

export class AddAccountMySqlRepository implements AddAccountRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    const addAccount = await this.prisma.account.create({
      data: {
        name: account.name,
        email: account.email,
        password: account.password,
      },
    });
    return addAccount;
  }
}
