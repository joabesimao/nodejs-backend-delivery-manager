import { AccountModel } from "../../../../domain/models/account/account-model";

export interface LoadAccountByTokenRepository {
  loadByToken(token: string, role?: string): Promise<AccountModel>;
}
