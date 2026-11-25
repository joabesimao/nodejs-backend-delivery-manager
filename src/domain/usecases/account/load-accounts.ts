import { AccountRole } from "../../models/account/account-role";
import { PublicAccountModel } from "../../models/account/public-account-model";

export interface LoadAccountsFilter {
  role?: AccountRole;
  q?: string;
}

export interface LoadAccounts {
  load(filter?: LoadAccountsFilter): Promise<PublicAccountModel[]>;
}
