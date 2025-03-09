import { AccountModel } from "../../../domain/models/account/account-model";

export interface LoadAccountByEmailRepository {
  load(email: string): Promise<AccountModel>;
}
