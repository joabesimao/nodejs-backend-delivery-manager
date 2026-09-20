import { AccountRole } from "@prisma/client";
import { PublicAccountModel } from "../../models/account/public-account-model";

export interface LoadAccountsFilter {
  role?: AccountRole;
  q?: string;
}

export interface LoadAccounts {
  load(filter?: LoadAccountsFilter): Promise<PublicAccountModel[]>;
}
