import { AccountModel } from "../../../domain/models/account/account-model";

export interface LoadAccountByEmailRepository {
  loadAccountByEmail(email: string): Promise<AccountModel>;
}
