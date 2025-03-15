import { AccountModel } from "../../models/account/account-model";

export interface LoadAccountByToken {
  load(accessToken: string, role?: string): Promise<AccountModel>;
}
