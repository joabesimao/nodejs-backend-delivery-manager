import { AccountModel } from "../../../../domain/models/account/account-model";

export interface FindAccountByEmailRepository {
  loadAccountByEmail(email: string): Promise<AccountModel>;
}
