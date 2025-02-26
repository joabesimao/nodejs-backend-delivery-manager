import { AccountModel } from "../../../domain/models/account/account-model";
import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/usescases/signup/add-account";
import { Encrypter } from "../../protocols/encrypter/encrypter";
import { AddAccountRepository } from "../../../data/protocols/db/account/add-account-repository";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}
  async add(account: AddAccountModel): Promise<AccountModel> {
    const passwordHashed = await this.encrypter.encrypt(account.password);
    const newAccount = await this.addAccountRepository.add(
      Object.assign({}, account, { password: passwordHashed })
    );
    return newAccount;
  }
}
