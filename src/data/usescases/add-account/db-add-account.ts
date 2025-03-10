import { AccountModel } from "../../../domain/models/account/account-model";
import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/usescases/signup/add-account";
import { Hasher } from "../../protocols/criptography/hasher";
import { AddAccountRepository } from "../../../data/protocols/db/account/add-account-repository";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}
  async add(account: AddAccountModel): Promise<AccountModel> {
    const passwordHashed = await this.hasher.hash(account.password);
    const newAccount = await this.addAccountRepository.add(
      Object.assign({}, account, { password: passwordHashed })
    );
    return newAccount;
  }
}
