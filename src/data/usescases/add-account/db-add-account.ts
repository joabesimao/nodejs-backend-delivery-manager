import { AccountModel } from "../../../domain/models/account/account-model";
import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/usescases/signup/add-account";
import { Encrypter } from "../../protocols/encrypter/encrypter";

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}
  async add(account: AddAccountModel): Promise<AccountModel> {
    this.encrypter.encrypt(account.password);
    return new Promise((resolve) => resolve(null));
  }
}
