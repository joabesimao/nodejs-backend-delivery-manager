import { AccountRole } from "@prisma/client";
import { AccountModel } from "../../models/account/account-model";

export interface AddAccountModel {
  name: string;
  email: string;
  password: string;
  role?: AccountRole;
}

export interface AddAccount {
  add(account: AddAccountModel): Promise<AccountModel>;
}
