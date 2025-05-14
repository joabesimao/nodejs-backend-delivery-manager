import { AccountModel } from "../../../../domain/models/account/account-model";
import {
  AddAccount,
  AddAccountModel,
} from "../../../../domain/usescases/signup/add-account";
import { Hasher } from "../../../protocols/criptography/hasher";
import { AddAccountRepository } from "../../../protocols/db/account/add-account-repository";
import { FindAccountByEmailRepository } from "../../../protocols/db/account/find-account-by-email-repository";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountRepository: FindAccountByEmailRepository
  ) {}
  async add(account: AddAccountModel): Promise<AccountModel> {
    const findAccount = await this.loadAccountRepository.loadAccountByEmail(
      account.email
    );
    if (!findAccount) {
      const passwordHashed = await this.hasher.hash(account.password);
      const newAccount = await this.addAccountRepository.add(
        Object.assign({}, account, { password: passwordHashed })
      );
      return newAccount;
    }
    return null;
  }
}
