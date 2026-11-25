import { AccountModel } from "../../../../domain/models/account/account-model";
import { AddAccountModel } from "../../../../domain/usecases/signup/add-account";

export interface AddAccountRepository {
  add(account: AddAccountModel): Promise<AccountModel>;
}
